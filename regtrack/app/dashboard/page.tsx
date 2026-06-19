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
  const urgent = vehicles.filter(v => v.status !== 'current').slice(0, 3)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0C2340', margin: '0 0 4px' }}>Welcome back, {firstName}</h1>
        <p style={{ fontSize: 14, color: '#6b7c93', margin: 0 }}>Here's your fleet at a glance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total vehicles', value: summary.total, color: '#0C2340' },
          { label: 'Current', value: summary.current, color: '#3B6D11' },
          { label: 'Expiring soon', value: summary.expiringSoon, color: '#854F0B' },
          { label: 'Expired', value: summary.expired, color: '#A32D2D' },
        ].map(card => (
          <div key={card.label} style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9aabc0', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Cars', value: summary.cars, icon: '🚗', href: '/dashboard/vehicles?type=car' },
          { label: 'Trucks', value: summary.trucks, icon: '🛻', href: '/dashboard/vehicles?type=truck' },
          { label: 'Trailers', value: summary.trailers, icon: '🚛', href: '/dashboard/vehicles?type=trailer' },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0C2340' }}>{item.value}</div>
                <div style={{ fontSize: 12, color: '#6b7c93' }}>{item.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {urgent.length > 0 && (
        <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0C2340' }}>Needs attention</div>
            <Link href="/dashboard/vehicles" style={{ fontSize: 13, color: '#1A5FA8', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {urgent.map(v => {
              const colors = v.status === 'expired' ? { bg: '#FCEBEB', text: '#A32D2D' } : { bg: '#FAEEDA', text: '#854F0B' }
              const name = [v.year, v.make, v.model].filter(Boolean).join(' ') || `Fleet #${v.fleet_number}`
              const label = v.status === 'expired' ? `Expired ${Math.abs(v.daysUntilExpiry)}d ago` : `${v.daysUntilExpiry} days left`
              return (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F5F8FC', borderRadius: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0C2340' }}>Fleet #{v.fleet_number}</span>
                    <span style={{ fontSize: 13, color: '#6b7c93', marginLeft: 8 }}>{name}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: colors.bg, color: colors.text }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {summary.total === 0 && (
        <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '48px 24px', textAlign: 'center' as const }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚗</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#0C2340', marginBottom: 8 }}>No vehicles yet</div>
          <div style={{ fontSize: 14, color: '#6b7c93', marginBottom: 24 }}>Add your first vehicle to start tracking registrations.</div>
          <Link href="/dashboard/vehicles" style={{ background: '#0C2340', color: 'white', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            Add your first vehicle →
          </Link>
        </div>
      )}
    </div>
  )
}
