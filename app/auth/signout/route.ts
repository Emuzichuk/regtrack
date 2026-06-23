import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  const response = NextResponse.redirect(new URL('/', request.url))
  return response
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  const response = NextResponse.redirect(new URL('/', request.url))
  return response
}
