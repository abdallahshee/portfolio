
import { article, db, user } from "@/db";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { AuthenticatedMiddleware } from "./middleware";
import { UserUpdateProfileSchema } from "@/db/validations/user.types";

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
          avatar: user.avatar,
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
          user.avatar,
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

export const getAuthUser = createServerFn({ method: "GET" })
  .middleware([AuthenticatedMiddleware])
  .handler(async () => {
    try {
      const supabase = getSupabaseServerClient()
      const { data: result, error } = await supabase.auth.getUser()
      if (error) throw new Error(error.message)
      if (!result.user) throw new Error("User not found")
      const { user } = result
      return user
    } catch (err) {
      throw err
    }
  })

export const userUpdateProfile = createServerFn({ method: 'POST' })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(UserUpdateProfileSchema)
  .handler(async ({ data }) => {
    try {
      const supabase = getSupabaseServerClient()
      const nextName = data.name.trim()
      const nextImage = data.avatar.trim()
      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: {
          name: nextName,
          avatar: nextImage,
        },
      })
      if (error) {
        throw new Error(error.message)
      }
      return {
        user: updatedUser.user,
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to update profile.'
      )
    }
  })


export const getCurrentUser = createServerFn({ method: 'GET' })
  .middleware([AuthenticatedMiddleware])
  .handler(async () => {
    try {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        throw new Error(error.message)
      }
      if (!data.user?.id) {
        return null
      }
      const theUser = await db.query.user.findFirst({
        where: eq(user.id, data.user.id),
      })
      return theUser
    } catch (err) {
      console.error('Error getting current user:', err)
      throw err
    }
  })

