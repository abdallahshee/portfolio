// src/features/auth/get-current-user.ts
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { db, user } from '@/db/index'
import type { DbUser, SupabaseUser } from '@/db/validations/user.types'
import type { Session } from '@supabase/supabase-js'

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
  const supabase = getSupabaseServerClient({
    getAll() {
      const cookieHeader = request.headers.get('cookie') ?? ''
      return parseCookieHeader(cookieHeader)
    },
    setAll() {},
  })

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  // ✅ return null instead of throwing — missing session is not an error
  if (authError || !authUser) {
    return null
  }

  return authUser
}

// export async function getDbUser(): Promise<DbUser | null> {
//   const request = getRequest()
//   const supabase = getSupabaseServerClient({
//     getAll() {
//       const cookieHeader = request.headers.get('cookie') ?? ''
//       return parseCookieHeader(cookieHeader)
//     },
//     setAll() {
//       // no-op here; for many read-only auth checks this is enough
//     },
//   })
//   const {
//     data: { user: authUser },
//     error: authError,
//   } = await supabase.auth.getUser()
//   if (authError) {
//     throw new Error(authError.message)
//   }
//   if (!authUser) {
//     return null
//   }
//   const dbUser = await db.query.user.findFirst({
//     where: eq(user.id, authUser.id),
//   })
//   if (!dbUser) {
//     return null
//   }
//   return dbUser
// }



// export async function getServerSession(): Promise<Session | null> {
//   const request = getRequest()
//   const supabase = getSupabaseServerClient({
//     getAll() {
//       const cookieHeader = request.headers.get('cookie') ?? ''
//       return parseCookieHeader(cookieHeader)
//     },
//     setAll() {},
//   })

//   const { data: { session }, error } = await supabase.auth.getSession()

//   if (error) {
//     throw new Error(error.message)
//   }

//   return session
// }