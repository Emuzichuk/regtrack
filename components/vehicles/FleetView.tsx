'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { VehicleWithStatus, VehicleType } from '@/types'
import AddVehicleModal from '@/components/vehicles/AddVehicleModal'
import EditVehicleModal from '@/components/vehicles/EditVehicleModal'
import RegistrationStatusModal from '@/components/vehicles/RegistrationStatusModal'

interface Company { id: string; name: string; notes: string | null }
interface Props {
  vehicles: VehicleWithStatus[]
  allVehicles: VehicleWithStatus[]
  companies: Company[]
  activeCompanyId: string | null
  userId: string
}

type VehicleTab = VehicleType | 'all'
type SortKey = 'fleet_number' | 'make' | 'year' | 'expiry' | 'status'

const TABS: { type: VehicleTab; label: string }[] = [
  { type: 'all', label: 'All' },
  { type: 'car', label: 'Cars' },
  { type: 'truck', label: 'Trucks' },
  { type: 'trailer', label: 'Trailers' },
]

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'fleet_number', label: 'Fleet #' },
  { value: 'make', label: 'Make' },
  { value: 'year', label: 'Year' },
  { value: 'expiry', label: 'Expiry' },
  { value: 'status', label: 'Status' },
]

const S = { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

export default function FleetView({ vehicles, allVehicles, companies, activeCompanyId, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<VehicleTab>('all')
  const [sort, setSort] = useState<SortKey>('fleet_number')
  const [showAdd, setShowAdd] = useState(false)
  const [editV, setEditV] = useState<VehicleWithStatus | null>(null)
  const [statusV, setStatusV] = useState<VehicleWithStatus | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const activeCompany = companies.find(c => c.id === activeCompanyId)

  const filtered = useMemo(() => {
    const byType = tab === 'all' ? vehicles : vehicles.filter(v => v.vehicle_type === tab)
    return [...byType].sort((a, b) => {
      switch (sort) {
        case 'fleet_number': return a.fleet_number.localeCompare(b.fleet_number, undefined, { numeric: true })
        case 'make': return (a.make || '').localeCompare(b.make || '')
        case 'year': return (b.year || 0) - (a.year || 0)
        case 'expiry': return a.daysUntilExpiry - b.daysUntilExpiry
        case 'status': return { expired: 0, expiring_soon: 1, current: 2 }[a.status] - { expired: 0, expiring_soon: 1, current: 2 }[b.status]
        default: return 0
      }
    })
  }, [vehicles, tab, sort])

  const counts = { all: vehicles.length, car: vehicles.filter(v => v.vehicle_type === 'car').length, truck: vehicles.filter(v => v.vehicle_type === 'truck').length, trailer: vehicles.filter(v => v.vehicle_type === 'trailer').length }

  async function del(id: string) {
    if (!confirm('Remove this vehicle?')) return
    setDeletingId(id)
    await supabase.from('vehicles').update({ archived: true }).eq('id', id)
    router.refresh()
    setDeletingId(null)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #E2E5EA', paddingBottom: 32, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={S}>Fleet</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em', marginTop: 6 }}>
            {activeCompany ? activeCompany.name : 'All fleets'}
          </h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4, fontWeight: 300 }}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ fontSize: 13, fontWeight: 600, background: '#0A1628', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em' }}>
          + Add vehicle
        </button>
      </div>

      {/* Tabs + Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E5EA' }}>
          {TABS.map(t => (
            <button key={t.type} onClick={() => setTab(t.type)} style={{
              fontSize: 13, fontWeight: 500, padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: tab === t.type ? '#0A1628' : '#6B7280',
              borderBottom: tab === t.type ? '2px solid #0A1628' : '2px solid transparent',
              marginBottom: -1, display: 'flex', alignItems: 'center', gap: 7,
            }}>
              {t.label}
              <span style={{ fontSize: 11, color: tab === t.type ? '#0A1628' : '#9CA3AF', fontWeight: 500 }}>{counts[t.type]}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sort</span>
          {SORTS.map(s => (
            <button key={s.value} onClick={() => setSort(s.value)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: '1px solid', borderColor: sort === s.value ? '#0A1628' : '#E2E5EA', background: sort === s.value ? '#0A1628' : 'white', color: sort === s.value ? 'white' : '#6B7280', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div style={{ border: '1px solid #E2E5EA', padding: '64px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, fontWeight: 300 }}>No {tab === 'all' ? 'vehicles' : tab + 's'} yet.</p>
          <button onClick={() => setShowAdd(true)} style={{ fontSize: 13, fontWeight: 600, background: '#0A1628', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Add vehicle
          </button>
        </div>
      ) : (
        <div style={{ border: '1px solid #E2E5EA' }}>
          {/* Table head */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 120px 130px 130px 160px', padding: '10px 20px', borderBottom: '1px solid #E2E5EA', background: '#FAFAFA' }}>
            {['Fleet #', 'Vehicle', 'Type', 'Plate', 'Expires', 'Status', 'Actions'].map(h => (
              <div key={h} style={S}>{h}</div>
            ))}
          </div>

          {filtered.map((v, i) => {
            const name = [v.year, v.make, v.model].filter(Boolean).join(' ') || (v.trailer_type || '—')
            const sc = { current: { bg: '#F0FDF4', text: '#15803D', label: 'Current' }, expiring_soon: { bg: '#FFFBEB', text: '#B45309', label: `${v.daysUntilExpiry}d left` }, expired: { bg: '#FEF2F2', text: '#B91C1C', label: 'Expired' } }[v.status]
            const companyName = !activeCompanyId ? companies.find(c => c.id === (v as any).company_id)?.name : null

            return (
              <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 100px 120px 130px 130px 160px', padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #E2E5EA' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', fontFamily: 'monospace' }}>#{v.fleet_number}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0A1628', letterSpacing: '-0.01em' }}>{name}</div>
                  {companyName && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{companyName}</div>}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', textTransform: 'capitalize' }}>{v.vehicle_type}</div>
                <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>{v.license_plate || '—'}</div>
                <div style={{ fontSize: 12, color: '#374151' }}>
                  {new Date(v.registration_expiry + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: sc.bg, color: sc.text, letterSpacing: '0.02em' }}>
                    {sc.label}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setStatusV(v)} style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 6, border: '1px solid #E2E5EA', background: 'white', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Status</button>
                  <button onClick={() => setEditV(v)} style={{ fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid #E2E5EA', background: 'white', color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                  <button onClick={() => del(v.id)} disabled={deletingId === v.id} style={{ fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {deletingId === v.id ? '...' : 'Del'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && <AddVehicleModal userId={userId} defaultType="car" companies={companies} activeCompanyId={activeCompanyId} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); router.refresh() }} />}
      {editV && <EditVehicleModal vehicle={editV} companies={companies} onClose={() => setEditV(null)} onSaved={() => { setEditV(null); router.refresh() }} />}
      {statusV && <RegistrationStatusModal vehicle={statusV} onClose={() => setStatusV(null)} onSaved={() => { setStatusV(null); router.refresh() }} />}
    </div>
  )
}
