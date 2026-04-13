// server/admin.functions.ts
import { createServerFn } from "@tanstack/react-start"
import { article, category, project, user } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import { db } from "@/db"
import { AdminMiddleware, AuthenticatedMiddleware } from "./middleware/auth.middleware"
import { PublishArticleSchema } from "@/db/validations/article.types"
import { getSupabaseAdmin } from "@/lib/supabase/server"
import { GetUsersSchema, AdminUserUpdateSchema } from "@/db/validations/admin.types"

// ── Dashboard stats ──
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([AuthenticatedMiddleware])
  .handler(async () => {
    const [projectCount, articleCount, userCount,categoryCount] = await Promise.all([
      db.select({ count: count() }).from(project),
      db.select({ count: count() }).from(article),
      db.select({ count: count() }).from(user),
      db.select({ count: count() }).from(category),
    ])
    return {
      projects: Number(projectCount[0].count),
      articles: Number(articleCount[0].count),
      users: Number(userCount[0].count),
      categories: Number(categoryCount[0].count),
    }
  })

// ── Admin projects ──

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((data: { projectId: string }) => data)
  .middleware([AuthenticatedMiddleware])
  .handler(async ({ data }) => {
    await db.delete(project).where(eq(project.id, data.projectId))
    return { success: true }
  })

// ── Admin blogs ──
export const deleteBlog = createServerFn({ method: "POST" })
  .inputValidator((data: { blogId: string }) => data)
  .middleware([AuthenticatedMiddleware])
  .handler(async ({ data }) => {
    await db.delete(article).where(eq(article.id, data.blogId))
    return { success: true }
  })

export const updateArticleStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { blogId: string; status: "draft" | "pending" | "published" }) => data)
  .middleware([AuthenticatedMiddleware])
  .handler(async ({ data }) => {
    await db
      .update(article)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(article.id, data.blogId))
    return { success: true }
  })

export const publishArticle = createServerFn({ method: "POST" })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(PublishArticleSchema)
  .handler(async ({ data }) => {
    try {
      const [theArticle] = await db.update(article).set({ status: data.status })
        .where(eq(article.id, data.id)).returning({ articleId: article.id, articleStatus: article.status })
      return theArticle
    } catch (err) {
      throw err
    }
  })


export const adminUpdateUserProfile = createServerFn({ method: "POST" })
  .middleware([AdminMiddleware])
  .inputValidator(AdminUserUpdateSchema)
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

export const getAllAuthUsers = createServerFn({ method: "GET" })
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

export const getAuthUserById = createServerFn({ method: "GET" })
  .inputValidator((data: { userId: string }) => data)
  .middleware([AdminMiddleware])
  .handler(async ({ data }) => {
    try {
      const supabase = getSupabaseAdmin()
      const { data: authUser, error } = await supabase.auth.admin.getUserById(data.userId)
      return authUser.user
    } catch (err) {
      throw err
    }
  })