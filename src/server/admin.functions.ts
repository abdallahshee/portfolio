// server/admin.functions.ts
import { createServerFn } from "@tanstack/react-start"
import { article, project, user} from "@/db/schema"
import { eq, desc, sql, count } from "drizzle-orm"
import { db } from "@/db"
import {  AuthenticatedMiddleware } from "./middleware/auth.middleware"
import { PublishArticleSchema } from "@/db/validations/article.types"

// ── Dashboard stats ──
export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([AuthenticatedMiddleware])
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
  .middleware([AuthenticatedMiddleware])
  .handler(async () => {
    const projects = await db.select().from(project).orderBy(desc(project.createdAt))
    return projects
  })

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
                .where(eq(article.id, data.id)).returning({articleId:article.id,articleStatus:article.status})
            return theArticle
        } catch (err) {
            throw err
        }
    })