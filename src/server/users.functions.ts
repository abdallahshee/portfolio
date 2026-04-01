
import { article, db, user } from "@/db";
import { GetUsersSchema } from "@/db/validations/user.types";
import { getSupabaseAdmin } from "@/lib/supabase/server";


import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";



export const getAllUsers = createServerFn({ method: "GET" })
  .inputValidator(GetUsersSchema)
  .handler(async ({ data }) => {
    try {
      const supabase = getSupabaseAdmin
      const { page, pageSize, search } = data

      const { data: usersData, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: pageSize,
      })

      if (error) throw new Error(error.message)

      // ✅ filter by search on the full list
      const allUsers = usersData.users
      const filtered = search?.trim()
        ? allUsers.filter((u) =>
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.user_metadata?.name?.toLowerCase().includes(search.toLowerCase())
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


export const getUserById = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const [theUser] = await db
        .select({
          userId: user.id,
          email: user.email,
          name: user.name,
          avatar: user.image,
          lastSignIn: user.lastSignInAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: user.role,
          articleCount: count(article.id),
        })
        .from(user)
        .leftJoin(article, eq(article.userId, user.id))
        .where(eq(user.id, data.userId))
        .groupBy(
          user.id,
          user.email,
          user.name,
          user.image,
          user.lastSignInAt,
          user.createdAt,
          user.updatedAt,
          user.role
        )

      return theUser ?? null
    } catch (err) {
      console.error("Failed to get user by id:", err)
      throw err
    }
  })