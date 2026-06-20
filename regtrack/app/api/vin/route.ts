import { NextRequest, NextResponse } from 'next/server'
import { lookupVIN } from '@/lib/vin-lookup'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const vin = request.nextUrl.searchParams.get('vin')
  if (!vin) return NextResponse.json({ error: 'VIN is required' }, { status: 400 })

  const result = await lookupVIN(vin)
  return NextResponse.json(result)
}
