'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Company { id: string; name: string }

interface Props {
  profile: { full_name: string | null; email: string; company_name: string | null; plan: string } | null
  companies: Company[]
  activeCompanyId: string | null
}

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: 30, height: 30, borderRadius: 7, background: '#0C2340', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.3"/>
      </svg>
    </div>
    <span style={{ fontWeight: 600, fontSize: 16, color: '#0C2340' }}>RegTrack</span>
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
  const fleetLabel = activeCompany ? activeCompany.name : 'All fleets'

  // Close dropdown when clicking outside
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
    if (!newCompanyName.trim()) { toast.error('Enter a company name'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error("Not logged in"); setSaving(false); return }
    const { data, error } = await supabase
      .from('companies')
      .insert({ user_id: user.id, name: newCompanyName.trim() })
      .select()
      .single()
    if (error) { toast.error('Failed to add company'); setSaving(false); return }
    toast.success(`"${newCompanyName}" added!`)
    setNewCompanyName('')
    setAddingCompany(false)
    setSaving(false)
    setDropdownOpen(false)
    router.push(`/dashboard/vehicles?company=${data.id}`)
    router.refresh()
  }

  const onFleet = pathname.startsWith('/dashboard/vehicles')

  return (
    <nav style={{
      background: 'white',
      borderBottom: '0.5px solid rgba(20,60,120,0.12)',
      padding: '0 24px',
      height: 58,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', marginRight: 16 }}>
          <Logo />
        </Link>

        {/* Overview link */}
        <Link href="/dashboard" style={{
          textDecoration: 'none', fontSize: 14, fontWeight: 500,
          padding: '6px 12px', borderRadius: 7,
          color: pathname === '/dashboard' ? '#0C2340' : '#6b7c93',
          background: pathname === '/dashboard' ? '#EEF4FB' : 'transparent',
        }}>
          Overview
        </Link>

        {/* Settings link */}
        <Link href="/dashboard/settings" style={{
          textDecoration: "none", fontSize: 14, fontWeight: 500,
          padding: "6px 12px", borderRadius: 7,
          color: pathname === "/dashboard/settings" ? "#0C2340" : "#6b7c93",
          background: pathname === "/dashboard/settings" ? "#EEF4FB" : "transparent",
        }}>
          Settings
        </Link>

        {/* Fleet dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 7,
              color: onFleet ? '#0C2340' : '#6b7c93',
              background: onFleet ? '#EEF4FB' : 'transparent',
              border: 'none', cursor: 'pointer',
            }}
          >
            Fleet
            {onFleet && activeCompany && (
              <span style={{ fontSize: 11, background: '#0C2340', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                {activeCompany.name}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <path d="M2 4l4 4 4-4" stroke="#0C2340" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 6,
              background: 'white', border: '0.5px solid rgba(20,60,120,0.15)',
              borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
              minWidth: 220, zIndex: 100, overflow: 'hidden',
            }}>
              {/* All fleets option */}
              <button
                onClick={() => switchCompany(null)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 16px',
                  background: !activeCompanyId ? '#EEF4FB' : 'white',
                  border: 'none', cursor: 'pointer', fontSize: 14,
                  fontWeight: !activeCompanyId ? 600 : 400,
                  color: !activeCompanyId ? '#0C2340' : '#4a6080',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>🚘</span>
                All fleets
                {!activeCompanyId && <span style={{ marginLeft: 'auto', color: '#1A5FA8', fontSize: 12 }}>✓</span>}
              </button>

              {companies.length > 0 && (
                <div style={{ borderTop: '0.5px solid rgba(20,60,120,0.08)', padding: '6px 0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9aabc0', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 16px 6px' }}>Companies</div>
                  {companies.map(c => (
                    <button
                      key={c.id}
                      onClick={() => switchCompany(c.id)}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 16px',
                        background: activeCompanyId === c.id ? '#EEF4FB' : 'white',
                        border: 'none', cursor: 'pointer', fontSize: 14,
                        fontWeight: activeCompanyId === c.id ? 600 : 400,
                        color: activeCompanyId === c.id ? '#0C2340' : '#4a6080',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#E6F1FB', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1A5FA8', flexShrink: 0 }}>
                        {c.name[0].toUpperCase()}
                      </span>
                      {c.name}
                      {activeCompanyId === c.id && <span style={{ marginLeft: 'auto', color: '#1A5FA8', fontSize: 12 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* Add company */}
              <div style={{ borderTop: '0.5px solid rgba(20,60,120,0.08)', padding: '8px 12px' }}>
                {!addingCompany ? (
                  <button
                    onClick={() => setAddingCompany(true)}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#1A5FA8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    + Add company
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      autoFocus
                      value={newCompanyName}
                      onChange={e => setNewCompanyName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddCompany(); if (e.key === 'Escape') setAddingCompany(false) }}
                      placeholder="Company name"
                      style={{ flex: 1, padding: '7px 10px', border: '1px solid rgba(20,60,120,0.2)', borderRadius: 7, fontSize: 13, outline: 'none', color: '#0C2340' }}
                    />
                    <button onClick={handleAddCompany} disabled={saving} style={{ padding: '7px 12px', background: '#0C2340', color: 'white', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#0C2340' }}>{profile?.full_name || profile?.email}</div>
          {profile?.company_name && <div style={{ fontSize: 11, color: '#9aabc0' }}>{profile.company_name}</div>}
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1A5FA8' }}>
          {(profile?.full_name || profile?.email || '?')[0].toUpperCase()}
        </div>
        <button
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          style={{ fontSize: 13, color: '#6b7c93', background: 'none', border: '1px solid rgba(20,60,120,0.15)', padding: '6px 12px', borderRadius: 7, cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
