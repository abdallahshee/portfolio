
import { GetUsersSchema } from "@/db/validations/user.types";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createServerFn } from "@tanstack/react-start";



export const getAllUsers = createServerFn({ method: "GET" })
  .inputValidator(GetUsersSchema)
  .handler(async ({ data }) => {
    try {
      const supabase = getSupabaseServerClient()
      const { page, pageSize, search } = data

      const { data: usersData, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: pageSize,
      })

      if (error) throw new Error(error.message)
console.log("USERS "+JSON.stringify(usersData.users))
      // ✅ filter by search on the full list
      const allUsers = usersData.users
      const filtered = search?.trim()
        ? allUsers.filter((u) =>
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.user_metadata?.full_name?.toLowerCase().includes(search.toLowerCase())
          )
        : allUsers

      return {
        users: filtered,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
        hasNextPage: page * pageSize < filtered.length,
        hasPrevPage: page > 1,
      }
    } catch (err: any) {
      console.error("Failed to get users:", err)
      throw new Error(err?.message ?? "Failed to fetch users")
    }
  })