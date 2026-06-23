import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // Handle PKCE flow (code) - used for password reset
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Always go to next param if provided, otherwise check session type
      if (next !== '/dashboard') {
        return NextResponse.redirect(`${origin}${next}`)
      }
      // Check if this was a recovery session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.recovery_sent_at || type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Handle token_hash flow
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?message=auth-error`)
}
