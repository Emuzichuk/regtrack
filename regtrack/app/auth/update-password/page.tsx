'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/ui/FormField'
import SubmitButton from '@/components/ui/SubmitButton'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    toast.success('Password updated successfully!')
    router.push('/auth/login?message=password-updated')
  }

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password for your RegTrack account."
    >
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
        <SubmitButton loading={loading} label="Update password" loadingLabel="Updating…" />
      </form>
    </AuthCard>
  )
}
