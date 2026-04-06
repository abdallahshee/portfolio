
import { article, db, user } from "@/db";
import {  GetUsersSchema, UserUpdateSchema } from "@/db/validations/user.types";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { AdminMiddleware, AuthenticatedMiddleware } from "./middleware/auth.middleware";




export const getAllUsers = createServerFn({ method: "GET" })
// .middleware([AdminMiddleware])
  .inputValidator(GetUsersSchema)
  .handler(async ({ data }) => {
    try {
      const supabase = getSupabaseAdmin()
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
// .middleware([AdminMiddleware])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    console.log("Get user by id method Started")
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
        console.log(JSON.stringify(theUser))
      return theUser ?? null
    } catch (err) {
      console.error("Failed to get user by id:", err)
      throw err
    }
  })


 export const UpdateUserProfile = createServerFn({ method: "POST" })
    .middleware([AuthenticatedMiddleware])
    .inputValidator(UserUpdateSchema)
    .handler(async ({ data }) => {
        try {
            const supabase = getSupabaseAdmin()
            // Updating auth.users — the SQL trigger will sync the public user table
            const { error: authError } = await supabase.auth.admin.updateUserById(
                data.userId,
                {
                    email: data.email,
                    user_metadata: {
                        avatar_url: data.image,
                        name: data.name,
                    }
                }
            )
            if (authError) {
                throw new Error(`Auth update failed: ${authError.message}`)
            }

            return { success: true }

        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to update user"
            throw err
        }
    })

export const getAuthUserById = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .middleware([AuthenticatedMiddleware])
  .handler(async ({ data }) => {
    try{
      const supabase=getSupabaseAdmin()
 const { data: result, error } = await supabase.auth.admin.getUserById(data.userId)

    if (error) throw new Error(error.message)
    if (!result.user) throw new Error("User not found")

    const { user } = result
    console.log("Auth User is found "+JSON.stringify(user))
  return user
   
    }catch(err){
      throw err
    }
   
  })

 