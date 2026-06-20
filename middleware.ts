import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isDashboardRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/applications') || 
    request.nextUrl.pathname.startsWith('/analytics') || 
    request.nextUrl.pathname.startsWith('/settings')

  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!isDashboardRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
