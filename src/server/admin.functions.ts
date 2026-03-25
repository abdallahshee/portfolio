// server/admin.functions.ts
import { createServerFn } from "@tanstack/react-start"
import { AdminMiddleware } from "@/server/middleware"

import { article, project, user, session } from "@/db/schema"
import { eq, desc, sql, count } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "../db/index"

// ── Dashboard stats ──
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([AdminMiddleware])
  .handler(async () => {
    const [projectCount, blogCount, userCount] = await Promise.all([
      db.select({ count: count() }).from(project),
      db.select({ count: count() }).from(article),
      db.select({ count: count() }).from(user),
    ])
    return {
      projects: Number(projectCount[0].count),
      blogs: Number(blogCount[0].count),
      users: Number(userCount[0].count),
    }
  })

// ── Admin projects ──
export const getAdminProjects = createServerFn({ method: "GET" })
  .middleware([AdminMiddleware])
  .handler(async () => {
    const projects = await db.select().from(project).orderBy(desc(project.createdAt))
    return projects
  })

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((data: { projectId: string }) => data)
  .middleware([AdminMiddleware])
  .handler(async ({ data }) => {
    await db.delete(project).where(eq(project.id, data.projectId))
    return { success: true }
  })

// ── Admin blogs ──
export const getAdminBlogs = createServerFn({ method: "GET" })
  .middleware([AdminMiddleware])
  .handler(async () => {
    const blogs = await db
      .select({
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        userId: article.userId,
        authorName: user.name,
        authorImage: user.image,
        authorEmail: user.email,
        likes: sql<number>`COUNT(DISTINCT blog_like.id)`,
        comments: sql<number>`COUNT(DISTINCT comment.id)`,
      })
      .from(article)
      .leftJoin(user, eq(article.userId, user.id))
      .leftJoin(sql`blog_like`, sql`blog.id = blog_like.blog_id`)
      .leftJoin(sql`comment`, sql`blog.id = comment.blog_id`)
      .groupBy(article.id, user.name, user.image, user.email)
      .orderBy(desc(article.createdAt))
    return blogs
  })

export const deleteBlog = createServerFn({ method: "POST" })
  .inputValidator((data: { blogId: string }) => data)
  .middleware([AdminMiddleware])
  .handler(async ({ data }) => {
    await db.delete(article).where(eq(article.id, data.blogId))
    return { success: true }
  })

export const updateBlogStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { blogId: string; status: "draft" | "pending" | "published" }) => data)
  .middleware([AdminMiddleware])
  .handler(async ({ data }) => {
    await db
      .update(article)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(article.id, data.blogId))
    return { success: true }
  })

// ── Admin users ──
export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([AdminMiddleware])
  .handler(async () => {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        blogCount: sql<number>`COUNT(DISTINCT ${article.id})`,
        lastSignIn: sql<Date>`MAX(${session.createdAt})`,
      })
      .from(user)
      .leftJoin(article, eq(user.id, article.userId))
      .leftJoin(session, eq(user.id, session.userId))
      .groupBy(user.id)
      .orderBy(desc(user.createdAt))
    return users
  })

// export const impersonateUser = createServerFn({ method: "POST" })
//   .inputValidator((data: { userId: string }) => data)
//   .middleware([AdminMiddleware])
//   .handler(async ({ data, context }) => {
//     const impersonated = await auth.api.impersonateUser({
//       body: { userId: data.userId },
//       headers: context.request?.headers ?? new Headers(),
//     })
//     return impersonated
//   })