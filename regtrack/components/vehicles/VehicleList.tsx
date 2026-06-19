'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { VehicleWithStatus, VehicleType } from '@/types'
import AddVehicleModal from '@/components/vehicles/AddVehicleModal'
import EditVehicleModal from '@/components/vehicles/EditVehicleModal'
import RegistrationStatusModal from '@/components/vehicles/RegistrationStatusModal'

interface Props {
  vehicles: VehicleWithStatus[]
  activeType: VehicleType
  userId: string
}

type SortKey = 'fleet_number' | 'make' | 'year' | 'expiry' | 'status'

const TABS: { type: VehicleType; label: string; icon: string }[] = [
  { type: 'car',     label: 'Cars',     icon: '🚗' },
  { type: 'truck',   label: 'Trucks',   icon: '🚛' },
  { type: 'trailer', label: 'Trailers', icon: '🚜' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'fleet_number', label: 'Fleet #' },
  { value: 'make',         label: 'Make' },
  { value: 'year',         label: 'Year' },
  { value: 'expiry',       label: 'Expiry date' },
  { value: 'status',       label: 'Status' },
]

export default function VehicleList({ vehicles, activeType, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<VehicleType>(activeType)
  const [sortBy, setSortBy] = useState<SortKey>('fleet_number')
  const [showAdd, setShowAdd] = useState(false)
  const [editVehicle, setEditVehicle] = useState<VehicleWithStatus | null>(null)
  const [statusVehicle, setStatusVehicle] = useState<VehicleWithStatus | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const byType = vehicles.filter(v => v.vehicle_type === tab)
    return [...byType].sort((a, b) => {
      switch (sortBy) {
        case 'fleet_number':
          return a.fleet_number.localeCompare(b.fleet_number, undefined, { numeric: true })
        case 'make':
          return (a.make || '').localeCompare(b.make || '')
        case 'year':
          return (b.year || 0) - (a.year || 0)
        case 'expiry':
          return a.daysUntilExpiry - b.daysUntilExpiry
        case 'status':
          const order = { expired: 0, expiring_soon: 1, current: 2 }
          return order[a.status] - order[b.status]
        default:
          return 0
      }
    })
  }, [vehicles, tab, sortBy])

  const counts = {
    car:     vehicles.filter(v => v.vehicle_type === 'car').length,
    truck:   vehicles.filter(v => v.vehicle_type === 'truck').length,
    trailer: vehicles.filter(v => v.vehicle_type === 'trailer').length,
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return
    setDeletingId(id)
    const { error } = await supabase.from('vehicles').update({ archived: true }).eq('id', id)
    if (error) { toast.error('Failed to delete vehicle') } else { toast.success('Vehicle removed'); router.refresh() }
    setDeletingId(null)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0C2340', margin: '0 0 4px' }}>Fleet</h1>
          <p style={{ fontSize: 14, color: '#6b7c93', margin: 0 }}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: '#0C2340', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          + Add vehicle
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid rgba(20,60,120,0.10)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button
            key={t.type}
            onClick={() => setTab(t.type)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 16px', fontSize: 14, fontWeight: 500,
              color: tab === t.type ? '#0C2340' : '#6b7c93',
              borderBottom: tab === t.type ? '2px solid #0C2340' : '2px solid transparent',
              marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{t.icon}</span>
            {t.label}
            <span style={{ fontSize: 11, background: tab === t.type ? '#E6F1FB' : '#F5F8FC', color: tab === t.type ? '#1A5FA8' : '#9aabc0', padding: '1px 7px', borderRadius: 20, fontWeight: 600 }}>
              {counts[t.type]}
            </span>
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#9aabc0', fontWeight: 600 }}>Sort by:</span>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            style={{
              fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', border: 'none',
              background: sortBy === opt.value ? '#0C2340' : '#F0F4F8',
              color: sortBy === opt.value ? 'white' : '#6b7c93',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{TABS.find(t => t.type === tab)?.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0C2340', marginBottom: 8 }}>No {tab}s added yet</div>
          <div style={{ fontSize: 14, color: '#6b7c93', marginBottom: 20 }}>Add your first {tab} to start tracking its registration.</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#0C2340', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            + Add {tab}
          </button>
        </div>
      ) : (
        <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, overflow: 'hidden' }}>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 110px 120px 130px 170px', padding: '10px 20px', background: '#F5F8FC', borderBottom: '0.5px solid rgba(20,60,120,0.10)' }}>
            {['Fleet #', 'Vehicle', 'Plate', 'Expires', 'Status', 'Actions'].map(h => (
              <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#9aabc0', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((v, i) => {
            const name = [v.year, v.make, v.model].filter(Boolean).join(' ') || (v.trailer_type || '—')
            const statusConfig = {
              current:       { bg: '#EAF3DE', text: '#3B6D11', label: 'Current' },
              expiring_soon: { bg: '#FAEEDA', text: '#854F0B', label: `${v.daysUntilExpiry}d left` },
              expired:       { bg: '#FCEBEB', text: '#A32D2D', label: 'Expired' },
            }[v.status]

            return (
              <div
                key={v.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr 110px 120px 130px 170px',
                  padding: '13px 20px',
                  borderBottom: i < filtered.length - 1 ? '0.5px solid rgba(20,60,120,0.08)' : 'none',
                  alignItems: 'center',
                }}
              >
                {/* Fleet # */}
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0C2340', fontFamily: 'monospace' }}>
                  #{v.fleet_number}
                </div>

                {/* Vehicle name */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0C2340' }}>{name}</div>
                  {v.notes && v.notes.startsWith('[') && (
                    <div style={{ fontSize: 11, color: '#854F0B', marginTop: 2 }}>{v.notes.split(']')[0].replace('[', '')}</div>
                  )}
                </div>

                {/* Plate */}
                <div style={{ fontSize: 12, color: '#6b7c93', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {v.license_plate || '—'}
                </div>

                {/* Expiry */}
                <div style={{ fontSize: 12, color: '#0C2340' }}>
                  {new Date(v.registration_expiry + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                {/* Status badge */}
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: statusConfig.bg, color: statusConfig.text }}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setStatusVehicle(v)}
                    style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#EAF3DE', color: '#3B6D11' }}
                  >
                    ✓ Status
                  </button>
                  <button
                    onClick={() => setEditVehicle(v)}
                    style={{ fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#E6F1FB', color: '#1A5FA8' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    disabled={deletingId === v.id}
                    style={{ fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#FCEBEB', color: '#A32D2D' }}
                  >
                    {deletingId === v.id ? '...' : 'Del'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddVehicleModal userId={userId} defaultType={tab} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); router.refresh() }} />
      )}
      {editVehicle && (
        <EditVehicleModal vehicle={editVehicle} onClose={() => setEditVehicle(null)} onSaved={() => { setEditVehicle(null); router.refresh() }} />
      )}
      {statusVehicle && (
        <RegistrationStatusModal vehicle={statusVehicle} onClose={() => setStatusVehicle(null)} onSaved={() => { setStatusVehicle(null); router.refresh() }} />
      )}
    </div>
  )
}
