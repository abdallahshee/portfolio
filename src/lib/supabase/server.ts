import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { getCookies,setCookie } from '@tanstack/react-start/server'



export function getSupabaseServerClient() {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // ✅ convert object { name: value } to array [{ name, value }]
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value: value ?? '',
          }))
        },
        setAll(cookiesToSet) {
          // ✅ iterate and set each cookie individually
          cookiesToSet.forEach(({ name, value, options }) =>
            setCookie(name, value, options as any)
          )
        },
      },
    }
  )
}


export function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}


