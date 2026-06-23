'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/ui/FormField'
import SubmitButton from '@/components/ui/SubmitButton'

function UpdatePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function init() {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (token_hash && type === 'recovery') {
        // Verify the OTP to establish a recovery session
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'recovery',
        })
        if (error) {
          toast.error('Reset link is invalid or expired. Please request a new one.')
          router.push('/auth/reset-password')
          return
        }
        setReady(true)
        return
      }

      // Check if already in a recovery session (came via callback)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      } else {
        toast.error('No valid reset session. Please request a new reset link.')
        router.push('/auth/reset-password')
      }
    }
    init()
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  function validate() {
    const errs: Record<string, string> = {}
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password: form.password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Sign out after password change so they log in fresh
    await supabase.auth.signOut()
    toast.success('Password updated successfully!')
    router.push('/auth/login?message=password-updated')
  }

  if (!ready) {
    return (
      <AuthCard title="Verifying..." subtitle="Please wait.">
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#9aabc0', fontSize: 14 }}>
          Verifying your reset link...
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a strong password for your RegTrack account.">
      <form onSubmit={handleSubmit}>
        <FormField
          label="New password" id="password" type="password"
          value={form.password} onChange={set('password')}
          placeholder="Min. 8 characters" autoComplete="new-password"
          required error={errors.password}
        />
        <FormField
          label="Confirm new password" id="confirm" type="password"
          value={form.confirm} onChange={set('confirm')}
          placeholder="Re-enter new password" autoComplete="new-password"
          required error={errors.confirm}
        />
        <SubmitButton loading={loading} label="Update password" loadingLabel="Updating..." />
      </form>
    </AuthCard>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F5F8FC' }} />}>
      <UpdatePasswordForm />
    </Suspense>
  )
}
