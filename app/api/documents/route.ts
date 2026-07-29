import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const vehicleId = request.nextUrl.searchParams.get('vehicle_id')
  if (!vehicleId) return NextResponse.json({ error: 'vehicle_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('vehicle_documents')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ documents: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const vehicleId = formData.get('vehicle_id') as string
  const name = formData.get('name') as string

  if (!file || !vehicleId) return NextResponse.json({ error: 'Missing file or vehicle_id' }, { status: 400 })

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop()
  const filePath = `${user.id}/${vehicleId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('vehicle-documents')
    .upload(filePath, file, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  // Save to database
  const { data, error } = await supabase.from('vehicle_documents').insert({
    vehicle_id: vehicleId,
    user_id: user.id,
    name: name || file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ document: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, file_path } = await request.json()

  // Delete from storage
  await supabase.storage.from('vehicle-documents').remove([file_path])

  // Delete from database
  const { error } = await supabase.from('vehicle_documents').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
