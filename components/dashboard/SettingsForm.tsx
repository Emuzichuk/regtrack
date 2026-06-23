'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Profile { id: string; full_name: string | null; company_name: string | null; phone: string | null; plan: string; plan_status: string }

const S = { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }
const INPUT = { width: '100%', padding: '10px 14px', border: '1px solid #E2E5EA', borderRadius: 6, fontSize: 14, color: '#0A1628', background: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #E2E5EA', marginBottom: 24 }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E5EA', background: '#FAFAFA' }}>
        <p style={S}>{title}</p>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{label}</label>
      {children}
    </div>
  )
}

export default function SettingsForm({ profile, email }: { profile: Profile | null; email: string }) {
  const supabase = createClient()
  const [pf, setPf] = useState({ full_name: profile?.full_name || '', company_name: profile?.company_name || '', phone: profile?.phone || '' })
  const [pw, setPw] = useState({ password: '', confirm: '' })
  const [savingPf, setSavingPf] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  async function saveProfile() {
    if (!pf.full_name.trim()) { toast.error('Name is required'); return }
    setSavingPf(true)
    const { error } = await supabase.from('profiles').update({ full_name: pf.full_name.trim(), company_name: pf.company_name.trim() || null, phone: pf.phone.trim() || null }).eq('id', profile!.id)
    if (error) { toast.error('Failed to save') } else { toast.success('Profile updated') }
    setSavingPf(false)
  }

  async function savePassword() {
    if (pw.password.length < 8) { toast.error('Minimum 8 characters'); return }
    if (pw.password !== pw.confirm) { toast.error('Passwords do not match'); return }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: pw.password })
    if (error) { toast.error(error.message) } else { toast.success('Password updated'); setPw({ password: '', confirm: '' }) }
    setSavingPw(false)
  }

  const btn = (label: string, loading: boolean, onClick: () => void) => (
    <button onClick={onClick} disabled={loading} style={{ fontSize: 13, fontWeight: 600, padding: '9px 20px', border: 'none', borderRadius: 6, background: loading ? '#6B7280' : '#0A1628', color: 'white', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em' }}>
      {loading ? 'Saving...' : label}
    </button>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ borderBottom: '1px solid #E2E5EA', paddingBottom: 32, marginBottom: 40 }}>
        <p style={S}>Account</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', letterSpacing: '-0.03em', marginTop: 6 }}>Settings</h1>
      </div>

      <Section title="Profile">
        <Field label="Email address">
          <input style={{ ...INPUT, background: '#F7F8FA', color: '#9CA3AF' }} value={email} disabled />
        </Field>
        <Field label="Full name">
          <input style={INPUT} value={pf.full_name} onChange={e => setPf(p => ({ ...p, full_name: e.target.value }))} placeholder="Your full name" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
          <Field label="Company name">
            <input style={INPUT} value={pf.company_name} onChange={e => setPf(p => ({ ...p, company_name: e.target.value }))} placeholder="Optional" />
          </Field>
          <Field label="Phone">
            <input style={INPUT} value={pf.phone} onChange={e => setPf(p => ({ ...p, phone: e.target.value }))} placeholder="Optional" type="tel" />
          </Field>
        </div>
        {btn('Save profile', savingPf, saveProfile)}
      </Section>

      <Section title="Password">
        <Field label="New password">
          <input style={INPUT} type="password" value={pw.password} onChange={e => setPw(p => ({ ...p, password: e.target.value }))} placeholder="At least 8 characters" autoComplete="new-password" />
        </Field>
        <Field label="Confirm password">
          <input style={INPUT} type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Re-enter password" autoComplete="new-password" />
        </Field>
        {btn('Update password', savingPw, savePassword)}
      </Section>

      <Section title="Notifications">
        <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 300, lineHeight: 1.6, marginBottom: 20 }}>
          Email reminders are sent automatically each morning. RegTrack will notify you 30, 14, and 7 days before any registration expires, and again when it lapses.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {['30 days before expiry', '14 days before expiry', '7 days before expiry', 'When registration expires'].map((label, i, arr) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #E2E5EA' : 'none' }}>
              <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D', background: '#F0FDF4', padding: '3px 8px', borderRadius: 4, letterSpacing: '0.04em' }}>ACTIVE</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sign out">
        <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 300, marginBottom: 16 }}>Sign out of your RegTrack account on this device.</p>
        <form action="/auth/signout" method="post">
          <button type="submit" style={{ fontSize: 13, fontWeight: 600, padding: '9px 20px', border: '1px solid #FECACA', borderRadius: 6, background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', fontFamily: 'inherit' }}>
            Sign out
          </button>
        </form>
      </Section>
    </div>
  )
}
