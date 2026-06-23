import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_status, stripe_customer_id, stripe_subscription_id')
    .eq('id', user.id)
    .single()

  return (
    <BillingClient
      plan={profile?.plan || 'none'}
      planStatus={profile?.plan_status || 'inactive'}
      hasCustomer={!!profile?.stripe_customer_id}
    />
  )
}
