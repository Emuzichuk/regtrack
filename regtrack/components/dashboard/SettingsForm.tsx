'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  plan: string
  plan_status: string
}

interface Props {
  profile: Profile | null
  email: string
}

const INPUT = { width: '100%', padding: '9px 12px', border: '1px solid rgba(20,60,120,0.18)', borderRadius: 8, fontSize: 14, color: '#0C2340', background: 'white', outline: 'none', boxSizing: 'border-box' as const }
const LABEL = { display: 'block', fontSize: 12, fontWeight: 600, color: '#4a6080', marginBottom: 5 } as const

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', border: '0.5px solid rgba(20,60,120,0.12)', borderRadius: 12, padding: '24px 28px', marginBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0C2340' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: '#9aabc0', marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsForm({ profile, email }: Props) {
  const supabase = createClient()

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    phone: profile?.phone || '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // Password form
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [savingPassword, setSavingPassword] = useState(false)

  // Notification preferences (stored in localStorage for now, Stripe gates email)
  const [notifications, setNotifications] = useState({
    days_30: true,
    days_14: true,
    days_7: true,
    expired: true,
  })

  const setProfile = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileForm(p => ({ ...p, [f]: e.target.value }))

  const setPassword = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordForm(p => ({ ...p, [f]: e.target.value }))

  async function handleSaveProfile() {
    if (!profileForm.full_name.trim()) { toast.error('Name is required'); return }
    setSavingProfile(true)
    const { error } = await supabase.from('profiles').update({
      full_name: profileForm.full_name.trim(),
      company_name: profileForm.company_name.trim() || null,
      phone: profileForm.phone.trim() || null,
    }).eq('id', profile!.id)
    if (error) { toast.error('Failed to save profile') } else { toast.success('Profile updated!') }
    setSavingProfile(false)
  }

  async function handleSavePassword() {
    if (passwordForm.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (passwordForm.password !== passwordForm.confirm) { toast.error('Passwords do not match'); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: passwordForm.password })
    if (error) { toast.error(error.message) } else {
      toast.success('Password updated!')
      setPasswordForm({ password: '', confirm: '' })
    }
    setSavingPassword(false)
  }

  const planColors: Record<string, { bg: string; text: string }> = {
    none:  { bg: '#F0F4F8', text: '#6b7c93' },
    basic: { bg: '#E6F1FB', text: '#1A5FA8' },
    pro:   { bg: '#EAF3DE', text: '#3B6D11' },
  }
  const planColor = planColors[profile?.plan || 'none']

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0C2340', margin: '0 0 4px' }}>Account settings</h1>
        <p style={{ fontSize: 14, color: '#6b7c93', margin: 0 }}>Manage your profile, password, and preferences.</p>
      </div>

      {/* Plan status */}
      <Section title="Your plan" subtitle="Current subscription status">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20, background: planColor.bg, color: planColor.text, textTransform: 'capitalize' }}>
              {profile?.plan === 'none' ? 'Free trial' : profile?.plan}
            </span>
            <span style={{ fontSize: 13, color: '#6b7c93' }}>
              {profile?.plan_status === 'active' ? '✓ Active' : profile?.plan_status === 'inactive' ? 'Inactive' : profile?.plan_status}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#9aabc0' }}>
            Stripe billing coming soon
          </div>
        </div>
      </Section>

      {/* Profile */}
      <Section title="Profile" subtitle="Your name and contact information">
        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>Email address</label>
          <input style={{ ...INPUT, background: '#F5F8FC', color: '#9aabc0' }} value={email} disabled />
          <p style={{ fontSize: 11, color: '#9aabc0', marginTop: 4 }}>Email cannot be changed here. Contact support if needed.</p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>Full name <span style={{ color: '#E24B4A' }}>*</span></label>
          <input style={INPUT} value={profileForm.full_name} onChange={setProfile('full_name')} placeholder="Your full name" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={LABEL}>Company name</label>
            <input style={INPUT} value={profileForm.company_name} onChange={setProfile('company_name')} placeholder="Optional" />
          </div>
          <div>
            <label style={LABEL}>Phone number</label>
            <input style={INPUT} value={profileForm.phone} onChange={setProfile('phone')} placeholder="Optional" type="tel" />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          style={{ background: '#0C2340', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: savingProfile ? 0.7 : 1 }}
        >
          {savingProfile ? 'Saving...' : 'Save profile'}
        </button>
      </Section>

      {/* Password */}
      <Section title="Change password" subtitle="Choose a strong password for your account">
        <div style={{ marginBottom: 14 }}>
          <label style={LABEL}>New password</label>
          <input style={INPUT} type="password" value={passwordForm.password} onChange={setPassword('password')} placeholder="At least 8 characters" autoComplete="new-password" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={LABEL}>Confirm new password</label>
          <input style={INPUT} type="password" value={passwordForm.confirm} onChange={setPassword('confirm')} placeholder="Re-enter password" autoComplete="new-password" />
        </div>
        <button
          onClick={handleSavePassword}
          disabled={savingPassword}
          style={{ background: '#0C2340', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: savingPassword ? 0.7 : 1 }}
        >
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </Section>

      {/* Notifications */}
      <Section title="Email reminders" subtitle="Choose when RegTrack sends you registration alerts">
        {[
          { key: 'days_30', label: '30 days before expiry', desc: 'Early warning so you have time to renew' },
          { key: 'days_14', label: '14 days before expiry', desc: 'Two-week reminder' },
          { key: 'days_7',  label: '7 days before expiry',  desc: 'Final reminder before expiry' },
          { key: 'expired', label: 'When registration expires', desc: 'Alert when a vehicle registration has lapsed' },
        ].map((item, i, arr) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '0.5px solid rgba(20,60,120,0.08)' : 'none' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0C2340' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#9aabc0', marginTop: 2 }}>{item.desc}</div>
            </div>
            <button
              onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                background: notifications[item.key as keyof typeof notifications] ? '#0C2340' : '#D0D8E4',
                position: 'relative', flexShrink: 0, transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: notifications[item.key as keyof typeof notifications] ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%', background: 'white',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        ))}
        <p style={{ fontSize: 12, color: '#9aabc0', marginTop: 16, padding: '10px 14px', background: '#F5F8FC', borderRadius: 8 }}>
          Email reminders are sent automatically each morning. Make sure your email address is correct above.
        </p>
      </Section>

      {/* Danger zone */}
      <Section title="Sign out" subtitle="Sign out of your RegTrack account on this device">
        <form action="/auth/signout" method="post">
          <button type="submit" style={{ background: 'white', color: '#A32D2D', border: '1px solid #F09595', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Sign out
          </button>
        </form>
      </Section>
    </div>
  )
}
