import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { enrichVehicles } from '@/lib/vehicles'
import type { Vehicle } from '@/types'
import FleetView from '@/components/vehicles/FleetView'

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { company } = await searchParams
  const activeCompanyId = company || null

  const [{ data: rawVehicles }, { data: companies }] = await Promise.all([
    supabase.from('vehicles').select('*').eq('user_id', user.id).eq('archived', false).order('registration_expiry', { ascending: true }),
    supabase.from('companies').select('*').eq('user_id', user.id).order('name', { ascending: true }),
  ])

  const allVehicles = enrichVehicles((rawVehicles || []) as Vehicle[])
  const vehicles = activeCompanyId
    ? allVehicles.filter((v: any) => v.company_id === activeCompanyId)
    : allVehicles

  return (
    <FleetView
      vehicles={vehicles}
      allVehicles={allVehicles}
      companies={companies || []}
      activeCompanyId={activeCompanyId}
      userId={user.id}
    />
  )
}
