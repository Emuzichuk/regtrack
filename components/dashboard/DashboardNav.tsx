'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Company { id: string; name: string }
interface Props {
  profile: { full_name: string | null; email: string; company_name: string | null; plan: string } | null
  companies: Company[]
  activeCompanyId: string | null
}

export default function DashboardNav({ profile, companies, activeCompanyId }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [fleetOpen, setFleetOpen] = useState(false)
  const [addingCompany, setAddingCompany] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const onFleet = pathname.startsWith('/dashboard/vehicles')
  const activeCompany = companies.find(c => c.id === activeCompanyId)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setFleetOpen(false); setAddingCompany(false) } }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function addCompany() {
    if (!newName.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('companies').insert({ user_id: user.id, name: newName.trim() }).select().single()
      if (data) { setFleetOpen(false); setAddingCompany(false); setNewName(''); setSaving(false); router.push(`/dashboard/vehicles?company=${data.id}`); router.refresh() }
    }
    setSaving(false)
  }

  const link = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link href={href} style={{ fontSize: 13, fontWeight: 500, color: active ? '#0A1628' : '#6B7280', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, background: active ? 'rgba(0,0,0,0.06)' : 'transparent', letterSpacing: '-0.01em' }}>
        {label}
      </Link>
    )
  }

  return (
    <header style={{ height: 52, borderBottom: '1px solid #E2E5EA', background: 'white', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50, gap: 32 }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 24, height: 24, background: '#0A1628', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.2"/>
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#0A1628', letterSpacing: '-0.02em' }}>RegTrack</span>
      </Link>

      {/* Divider */}
      <div style={{ width: 1, height: 18, background: '#E2E5EA' }} />

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1 }}>
        {link('/dashboard', 'Overview')}
        {link('/dashboard/settings', 'Settings')}
        {link('/dashboard/billing', 'Billing')}

        {/* Fleet dropdown */}
        <div ref={ref} style={{ position: 'relative' }}>
          <button onClick={() => setFleetOpen(o => !o)} style={{
            fontSize: 13, fontWeight: 500, padding: '4px 10px', borderRadius: 6,
            background: onFleet ? 'rgba(0,0,0,0.06)' : 'transparent',
            color: onFleet ? '#0A1628' : '#6B7280',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', letterSpacing: '-0.01em',
          }}>
            Fleet
            {activeCompany && <span style={{ fontSize: 11, background: '#0A1628', color: 'white', padding: '1px 7px', borderRadius: 10, fontWeight: 500 }}>{activeCompany.name}</span>}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: fleetOpen ? 'rotate(180deg)' : 'none', transition: '0.15s', opacity: 0.4 }}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {fleetOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: 'white', border: '1px solid #E2E5EA', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', minWidth: 210, zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '6px 0' }}>
                <button onClick={() => { router.push('/dashboard/vehicles'); setFleetOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: !activeCompanyId ? '#F7F8FA' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#0A1628', fontWeight: !activeCompanyId ? 600 : 400, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  All fleets
                  {!activeCompanyId && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
              </div>

              {companies.length > 0 && (
                <div style={{ borderTop: '1px solid #E2E5EA', padding: '6px 0' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#9CA3AF', padding: '4px 16px 8px', textTransform: 'uppercase' }}>Companies</div>
                  {companies.map(c => (
                    <button key={c.id} onClick={() => { router.push(`/dashboard/vehicles?company=${c.id}`); setFleetOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: activeCompanyId === c.id ? '#F7F8FA' : 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: '#0A1628', fontWeight: activeCompanyId === c.id ? 600 : 400, fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {c.name}
                      {activeCompanyId === c.id && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#1B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid #E2E5EA', padding: '8px' }}>
                {!addingCompany ? (
                  <button onClick={() => setAddingCompany(true)} style={{ width: '100%', padding: '8px 10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#6B7280', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    Add company
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addCompany(); if (e.key === 'Escape') setAddingCompany(false) }} placeholder="Company name" style={{ flex: 1, padding: '7px 10px', border: '1px solid #E2E5EA', borderRadius: 6, fontSize: 12, outline: 'none', fontFamily: 'inherit', color: '#0A1628' }} />
                    <button onClick={addCompany} disabled={saving} style={{ padding: '7px 12px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {saving ? '...' : 'Add'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{profile?.email}</span>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} style={{ fontSize: 12, color: '#6B7280', background: 'none', border: '1px solid #E2E5EA', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
          Sign out
        </button>
      </div>
    </header>
  )
}
