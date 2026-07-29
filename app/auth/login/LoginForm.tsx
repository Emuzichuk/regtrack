'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/ui/FormField'
import SubmitButton from '@/components/ui/SubmitButton'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg === 'check-email') toast.success('Check your email to confirm your account before logging in.')
    if (msg === 'password-updated') toast.success('Password updated. Please sign in.')
  }, [searchParams])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password.trim()) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email before signing in. Check your inbox.')
      } else if (error.message.includes('Invalid login')) {
        setErrors({ password: 'Incorrect email or password.' })
      } else {
        toast.error(error.message)
      }
      setLoading(false)
      return
    }

    if (!rememberMe) {
      sessionStorage.setItem('regtrack-session-only', 'true')
    } else {
      localStorage.removeItem('regtrack-session-only')
    }

    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthCard title="Sign in to RegTrack" subtitle="Manage your fleet registrations and reminders.">
      <form onSubmit={handleSubmit}>
        <FormField label="Email address" id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" required error={errors.email} />
        <FormField label="Password" id="password" type="password" value={form.password} onChange={set('password')} placeholder="Your password" autoComplete="current-password" required error={errors.password} />

        {/* Remember me + Forgot password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: -4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              border: `1.5px solid ${rememberMe ? '#0A1628' : '#D1D5DB'}`,
              background: rememberMe ? '#0A1628' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}>
              {rememberMe && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: '#374151', userSelect: 'none' as const }}>Keep me signed in</span>
          </label>
          <Link href="/auth/reset-password" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <SubmitButton loading={loading} label="Sign in" loadingLabel="Signing in..." />
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280', marginTop: 20 }}>
        Don't have an account?{' '}
        <Link href="/auth/signup" style={{ color: '#0A1628', fontWeight: 600, textDecoration: 'none' }}>Start free trial</Link>
      </p>
    </AuthCard>
  )
}
