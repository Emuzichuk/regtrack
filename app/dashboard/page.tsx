import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { enrichVehicles, getFleetSummary } from '@/lib/vehicles'
import type { Vehicle } from '@/types'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single()
  const { data: rawVehicles } = await supabase.from('vehicles').select('*').eq('user_id', user.id).eq('archived', false).order('registration_expiry', { ascending: true })

  const vehicles = enrichVehicles((rawVehicles || []) as Vehicle[])
  const summary = getFleetSummary(vehicles)
  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const urgent = vehicles.filter(v => v.status !== 'current').slice(0, 5)

  const S = { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #E2E5EA', paddingBottom: 32, marginBottom: 40 }}>
        <p style={S}>Overview</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em', marginTop: 6 }}>
          Good to see you, {firstName}.
        </h1>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid #E2E5EA', marginBottom: 40 }}>
        {[
          { label: 'Total vehicles', value: summary.total, color: '#0A1628' },
          { label: 'Current', value: summary.current, color: '#15803D' },
          { label: 'Expiring soon', value: summary.expiringSoon, color: '#B45309' },
          { label: 'Expired', value: summary.expired, color: '#B91C1C' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '28px 24px', borderRight: i < 3 ? '1px solid #E2E5EA' : 'none' }}>
            <p style={S}>{s.label}</p>
            <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em', color: s.color, marginTop: 8 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Vehicle type row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #E2E5EA', borderTop: 'none', marginBottom: 40 }}>
        {[
          { label: 'Cars', value: summary.cars, href: '/dashboard/vehicles?type=car' },
          { label: 'Trucks', value: summary.trucks, href: '/dashboard/vehicles?type=truck' },
          { label: 'Trailers', value: summary.trailers, href: '/dashboard/vehicles?type=trailer' },
        ].map((item, i) => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none', padding: '22px 24px', borderRight: i < 2 ? '1px solid #E2E5EA' : 'none', display: 'block', transition: 'background 0.1s' }}>
            <p style={S}>{item.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#0A1628', marginTop: 6 }}>{item.value}</p>
          </Link>
        ))}
      </div>

      {/* Needs attention */}
      {urgent.length > 0 && (
        <div style={{ border: '1px solid #E2E5EA' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E5EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={S}>Needs attention</p>
            <Link href="/dashboard/vehicles" style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none' }}>View all →</Link>
          </div>
          {urgent.map((v, i) => {
            const name = [v.year, v.make, v.model].filter(Boolean).join(' ') || `Fleet #${v.fleet_number}`
            const isExp = v.status === 'expired'
            const label = isExp ? `Expired ${Math.abs(v.daysUntilExpiry)}d ago` : `${v.daysUntilExpiry} days left`
            return (
              <div key={v.id} style={{ padding: '16px 24px', borderBottom: i < urgent.length - 1 ? '1px solid #E2E5EA' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', fontFamily: 'monospace' }}>#{v.fleet_number}</span>
                  <span style={{ fontSize: 13, color: '#0A1628', fontWeight: 500 }}>{name}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'capitalize' }}>{v.vehicle_type}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4, background: isExp ? '#FEF2F2' : '#FFFBEB', color: isExp ? '#B91C1C' : '#B45309', letterSpacing: '0.02em' }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {summary.total === 0 && (
        <div style={{ border: '1px solid #E2E5EA', padding: '64px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, fontWeight: 300 }}>No vehicles yet. Add your first vehicle to start tracking registrations.</p>
          <Link href="/dashboard/vehicles" style={{ fontSize: 13, fontWeight: 600, background: '#0A1628', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', display: 'inline-block' }}>
            Add your first vehicle
          </Link>
        </div>
      )}
    </div>
  )
}
