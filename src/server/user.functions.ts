import { createServerFn } from "@tanstack/react-start"
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const getUserAndRole = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('User Role ', user?.user_metadata.role)
  const isAdmin = user?.user_metadata?.role == "admin"

  return { isAdmin, user }
})