import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: companies }] = await Promise.all([
    supabase.from('profiles').select('full_name, email, company_name, plan').eq('id', user.id).single(),
    supabase.from('companies').select('id, name').eq('user_id', user.id).order('name'),
  ])

  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FC', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <DashboardNav profile={profile} companies={companies || []} activeCompanyId={null} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  )
}
