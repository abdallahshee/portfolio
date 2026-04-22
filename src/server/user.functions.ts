import { createServerFn } from "@tanstack/react-start"

import { createServerClient } from "@supabase/ssr"
import { json } from "zod";
import { AuthenticatedMiddleware } from "./middleware";
import { getSupabaseServerClient } from "@/lib/supabase/server";




// export const getCurrentUser = createServerFn({ method: "GET" })
//   .handler(async () => {
//     try {
//       const supabase = getSupabaseServerClient()

//       const { data, error } = await supabase.auth.getUser()

//       // ❗ IMPORTANT: do NOT throw if no user
//       if (error || !data.user?.id) {
//         return null
//       }
//       console.log('LOGGED IN USER '+JSON.stringify(data.user))
//       return data.user
//     } catch (err) {
//       console.error("Error getting current user:", err)

//       // ❗ NEVER throw → UI depends on this
//       return null
//     }
//   })

export const getCurrentUser = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log("USER:", JSON.stringify(user))
  return user
})

export const getUserRole = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('metadata ',user?.user_metadata)
const isAdmin= user?.user_metadata?.role=="admin"
const role= user?.user_metadata?.role=="admin"
console.log('Admin ',isAdmin)
  return isAdmin
})

export const getUserAndRole = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('metadata ',user?.user_metadata)
const isAdmin= user?.user_metadata?.role=="admin"
const role= user?.user_metadata?.role=="admin"
console.log('Admin ',isAdmin)
  return {isAdmin, user}
})