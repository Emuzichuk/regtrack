import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { vehicle_id, driver_name } = await request.json()
  if (!vehicle_id) return NextResponse.json({ error: 'vehicle_id required' }, { status: 400 })

  const { error } = await supabase
    .from('vehicles')
    .update({ driver_name: driver_name || null })
    .eq('id', vehicle_id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
