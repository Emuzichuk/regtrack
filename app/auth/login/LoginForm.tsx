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
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) {
      if (error.message.includes('Email not confirmed')) toast.error('Please confirm your email before signing in.')
      else if (error.message.includes('Invalid login')) setErrors({ password: 'Incorrect email or password.' })
      else toast.error(error.message)
      setLoading(false)
      return
    }
    toast.success('Welcome back!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthCard title="Sign in to RegTrack" subtitle="Manage your fleet registrations and reminders.">
      <form onSubmit={handleSubmit}>
        <FormField label="Email address" id="email" type="email" value={form.email} onChange={set('email')} placeholder="maria@example.com" autoComplete="email" required error={errors.email} />
        <div style={{ marginBottom: 8 }}>
          <FormField label="Password" id="password" type="password" value={form.password} onChange={set('password')} placeholder="Your password" autoComplete="current-password" required error={errors.password} />
        </div>
        <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
          <Link href="/auth/reset-password" style={{ fontSize: 13, color: 'var(--blue)', textDecoration: 'none' }}>Forgot password?</Link>
        </div>
        <SubmitButton loading={loading} label="Sign in" loadingLabel="Signing in..." />
      </form>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7c93', marginTop: 20 }}>
        Don't have an account?{' '}
        <Link href="/auth/signup" style={{ color: 'var(--blue)', fontWeight: 500, textDecoration: 'none' }}>Create one free</Link>
      </p>
    </AuthCard>
  )
}
