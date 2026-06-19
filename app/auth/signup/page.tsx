'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/ui/FormField'
import SubmitButton from '@/components/ui/SubmitButton'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.full_name.trim())    errs.full_name = 'Full name is required'
    if (!form.email.trim())        errs.email = 'Email is required'
    if (form.password.length < 8)  errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, company_name: form.company_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Update profile with company name if provided
    if (form.company_name) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles')
          .update({ company_name: form.company_name })
          .eq('id', user.id)
      }
    }

    toast.success('Account created! Check your email to confirm.')
    router.push('/auth/login?message=check-email')
    setLoading(false)
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start tracking your fleet registrations today."
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Full name" id="full_name" value={form.full_name}
          onChange={set('full_name')} placeholder="Maria Santos"
          autoComplete="name" required error={errors.full_name}
        />
        <FormField
          label="Company name" id="company_name" value={form.company_name}
          onChange={set('company_name')} placeholder="Santos Transport (optional)"
          autoComplete="organization"
        />
        <FormField
          label="Email address" id="email" type="email" value={form.email}
          onChange={set('email')} placeholder="maria@example.com"
          autoComplete="email" required error={errors.email}
        />
        <FormField
          label="Password" id="password" type="password" value={form.password}
          onChange={set('password')} placeholder="Min. 8 characters"
          autoComplete="new-password" required error={errors.password}
          hint="At least 8 characters"
        />
        <FormField
          label="Confirm password" id="confirm_password" type="password"
          value={form.confirm_password} onChange={set('confirm_password')}
          placeholder="Re-enter your password"
          autoComplete="new-password" required error={errors.confirm_password}
        />

        <SubmitButton loading={loading} label="Create account" loadingLabel="Creating account…" />
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7c93', marginTop: 20 }}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ color: 'var(--blue)', fontWeight: 500, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>

      <p style={{ fontSize: 11, color: '#9aabc0', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
        By creating an account you agree to our terms of service and privacy policy.
      </p>
    </AuthCard>
  )
}
