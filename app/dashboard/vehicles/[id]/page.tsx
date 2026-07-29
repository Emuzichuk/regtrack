import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import VehicleDetail from '@/components/vehicles/VehicleDetail'

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { id } = await params

  const [{ data: vehicle }, { data: documents }] = await Promise.all([
    supabase.from('vehicles').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('vehicle_documents').select('*').eq('vehicle_id', id).eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  if (!vehicle) notFound()

  return <VehicleDetail vehicle={vehicle} documents={documents || []} userId={user.id} />
}
