// src/features/auth/get-current-user.ts
import { getRequest } from '@tanstack/react-start/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

import type { SupabaseUser } from '@/db/validations/user.types'


export function parseCookieHeader(cookieHeader: string) {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf('=')
      const name = index >= 0 ? part.slice(0, index) : part
      const value = index >= 0 ? decodeURIComponent(part.slice(index + 1)) : ''
      return { name, value }
    })
}

export async function getSupabaseUser(): Promise<SupabaseUser | null> {
  const request = getRequest()
  // const supabase = getSupabaseServerClient({
  //   getAll() {
  //     const cookieHeader = request.headers.get('cookie') ?? ''
  //     return parseCookieHeader(cookieHeader)
  //   },
  //   setAll() {},

  const supabase=getSupabaseServerClient()
  // })
// const { data: { user: authUser }, error: authErro } = await supabase.auth.
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  // ✅ return null instead of throwing — missing session is not an error
  if (authError || !authUser) {
    return null
  }

  return authUser
}




