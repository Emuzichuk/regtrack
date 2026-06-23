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

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <div style={{ width: 30, height: 30, borderRadius: 8, background: '#0C2340', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.25"/>
      </svg>
    </div>
    <span style={{ fontWeight: 600, fontSize: 16, color: '#0A1929', letterSpacing: '-0.02em' }}>RegTrack</span>
  </div>
)

export default function DashboardNav({ profile, companies, activeCompanyId }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addingCompany, setAddingCompany] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [saving, setSaving] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeCompany = companies.find(c => c.id === activeCompanyId)
  const onFleet = pathname.startsWith('/dashboard/vehicles')

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setAddingCompany(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchCompany(id: string | null) {
    const params = id ? `?company=${id}` : ''
    setDropdownOpen(false)
    router.push(`/dashboard/vehicles${params}`)
    router.refresh()
  }

  async function handleAddCompany() {
    if (!newCompanyName.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { data, error } = await supabase.from('companies').insert({ user_id: user.id, name: newCompanyName.trim() }).select().single()
    if (!error && data) {
      setNewCompanyName('')
      setAddingCompany(false)
      setSaving(false)
      setDropdownOpen(false)
      router.push(`/dashboard/vehicles?company=${data.id}`)
      router.refresh()
    } else { setSaving(false) }
  }

  const navLink = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link key={href} href={href} style={{
        textDecoration: 'none', fontSize: 14, fontWeight: 500,
        padding: '6px 14px', borderRadius: 8,
        color: active ? '#0A1929' : '#6B8099',
        background: active ? '#F0F4F8' : 'transparent',
        transition: 'all 0.1s',
      }}>{label}</Link>
    )
  }

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      padding: '0 32px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', marginRight: 20 }}><Logo /></Link>
        {navLink('/dashboard', 'Overview')}
        {navLink('/dashboard/settings', 'Settings')}
        {navLink('/dashboard/billing', 'Billing')}

        {/* Fleet dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button onClick={() => setDropdownOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 14, fontWeight: 500, padding: '6px 14px', borderRadius: 8,
            color: onFleet ? '#0A1929' : '#6B8099',
            background: onFleet ? '#F0F4F8' : 'transparent',
            border: 'none', cursor: 'pointer',
          }}>
            Fleet
            {onFleet && activeCompany && (
              <span style={{ fontSize: 11, background: '#0C2340', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                {activeCompany.name}
              </span>
            )}
            <i className="ti ti-chevron-down" style={{ fontSize: 13, opacity: 0.5, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} aria-hidden="true" />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              background: 'white', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              minWidth: 230, zIndex: 100, overflow: 'hidden',
            }}>
              <button onClick={() => switchCompany(null)} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: !activeCompanyId ? '#F5F8FC' : 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: !activeCompanyId ? 600 : 400, color: !activeCompanyId ? '#0A1929' : '#5A7090', display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="ti ti-layout-grid" style={{ fontSize: 16, color: '#8A9DB0' }} aria-hidden="true" />
                All fleets
                {!activeCompanyId && <i className="ti ti-check" style={{ marginLeft: 'auto', fontSize: 14, color: '#1A5FA8' }} aria-hidden="true" />}
              </button>

              {companies.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '6px 0' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9AABBC', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 16px 6px' }}>Companies</div>
                  {companies.map(c => (
                    <button key={c.id} onClick={() => switchCompany(c.id)} style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: activeCompanyId === c.id ? '#F5F8FC' : 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeCompanyId === c.id ? 600 : 400, color: activeCompanyId === c.id ? '#0A1929' : '#5A7090', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EEF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1A5FA8', flexShrink: 0 }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      {c.name}
                      {activeCompanyId === c.id && <i className="ti ti-check" style={{ marginLeft: 'auto', fontSize: 14, color: '#1A5FA8' }} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '8px 12px' }}>
                {!addingCompany ? (
                  <button onClick={() => setAddingCompany(true)} style={{ width: '100%', textAlign: 'left', padding: '8px 6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#1A5FA8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
                    Add company
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input autoFocus value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAddCompany(); if (e.key === 'Escape') setAddingCompany(false) }} placeholder="Company name" style={{ flex: 1, padding: '7px 10px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, fontSize: 13, outline: 'none', color: '#0A1929', fontFamily: 'inherit' }} />
                    <button onClick={handleAddCompany} disabled={saving} style={{ padding: '7px 12px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                      {saving ? '...' : 'Add'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#0A1929', letterSpacing: '-0.01em' }}>{profile?.full_name || profile?.email}</div>
          {profile?.company_name && <div style={{ fontSize: 11, color: '#9AABBC' }}>{profile.company_name}</div>}
        </div>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#EEF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1A5FA8', border: '1px solid #C8DFF5' }}>
          {(profile?.full_name || profile?.email || '?')[0].toUpperCase()}
        </div>
        <button
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          style={{ fontSize: 13, color: '#8A9DB0', background: 'none', border: '1px solid rgba(0,0,0,0.10)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
