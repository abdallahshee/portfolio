import { createServerFn } from "@tanstack/react-start"
import { getSupabaseServerClient } from "@/lib/supabase/server"


export const getCurrentUser = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabase = getSupabaseServerClient()

      const { data, error } = await supabase.auth.getUser()

      // ❗ IMPORTANT: do NOT throw if no user
      if (error || !data.user?.id) {
        return null
      }
      return data.user
    } catch (err) {
      console.error("Error getting current user:", err)

      // ❗ NEVER throw → UI depends on this
      return null
    }
  })