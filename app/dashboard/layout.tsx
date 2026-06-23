import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'
import TrialBanner from '@/components/dashboard/TrialBanner'
import TrialExpiredModal from '@/components/dashboard/TrialExpiredModal'
import { isTrialExpired } from '@/lib/trial'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: companies }] = await Promise.all([
    supabase.from('profiles').select('full_name, email, company_name, plan, plan_status, trial_started_at').eq('id', user.id).single(),
    supabase.from('companies').select('id, name').eq('user_id', user.id).order('name'),
  ])

  if (profile && !profile.trial_started_at) {
    await supabase.from('profiles').update({ trial_started_at: new Date().toISOString() }).eq('id', user.id)
  }

  const trialExpired = isTrialExpired(profile?.trial_started_at || null, profile?.plan || 'none', profile?.plan_status || 'inactive')

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif", color: '#0A1628' }}>
      <DashboardNav profile={profile} companies={companies || []} activeCompanyId={null} />
      <TrialBanner trialStartedAt={profile?.trial_started_at || null} plan={profile?.plan || 'none'} planStatus={profile?.plan_status || 'inactive'} />
      <main>{children}</main>
      <TrialExpiredModal isExpired={trialExpired} />
    </div>
  )
}
