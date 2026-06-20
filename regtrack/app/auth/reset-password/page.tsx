'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/ui/FormField'
import SubmitButton from '@/components/ui/SubmitButton'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle="">
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#E6F1FB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A5FA8" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <p style={{ fontSize: 14, color: '#4a6080', lineHeight: 1.6, margin: '0 0 24px' }}>
            We sent a password reset link to <strong style={{ color: 'var(--navy)' }}>{email}</strong>.
            Check your inbox and click the link to reset your password.
          </p>
          <p style={{ fontSize: 12, color: '#9aabc0' }}>
            Didn't get it? Check your spam folder, or{' '}
            <button onClick={() => setSent(false)}
              style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: 12, padding: 0 }}>
              try again
            </button>
            .
          </p>
        </div>
        <Link href="/auth/login"
          style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--blue)', textDecoration: 'none', marginTop: 8 }}>
          ← Back to sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Email address" id="email" type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="maria@example.com"
          autoComplete="email" required
        />
        <SubmitButton loading={loading} label="Send reset link" loadingLabel="Sending…" />
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7c93', marginTop: 20 }}>
        <Link href="/auth/login" style={{ color: 'var(--blue)', textDecoration: 'none' }}>
          ← Back to sign in
        </Link>
      </p>
    </AuthCard>
  )
}
