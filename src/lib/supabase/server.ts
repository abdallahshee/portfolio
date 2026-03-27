// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import type { Session } from '@supabase/supabase-js'
import { getRequest } from '@tanstack/react-start/server'
import { parseCookieHeader } from './utils'

export type CookieItem = {
  name: string
  value: string
}

export type CookieToSet = {
  name: string
  value: string
  options?: Record<string, unknown>
}

export type CookieAdapter = {
  getAll: () => CookieItem[]
  setAll: (cookies: CookieToSet[]) => void
}

export function getSupabaseServerClient(cookies: CookieAdapter) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies.getAll() 
        },
        setAll(cookiesToSet) {
          cookies.setAll(cookiesToSet)
        },
      },
    }
  )
}


export async function getServerSession(): Promise<Session | null> {
  const request = getRequest()
  const supabase = getSupabaseServerClient({
    getAll() {
      const cookieHeader = request.headers.get('cookie') ?? ''
      return parseCookieHeader(cookieHeader)
    },
    setAll() {},
  })
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    throw new Error(error.message)
  }

  return session
}