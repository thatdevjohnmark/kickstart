import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => 
            supabaseResponse = NextResponse.next({
              request,
              cookies: {
                ...request.cookies,
                // This is a simplified version; in a real app you'd use the response object
              }
            })
          )
        },
      },
    }
  )

  // Refresh session if expired - This is required for Supabase Auth to work in Next.js
  await supabase.auth.getUser()

  return supabaseResponse
}
