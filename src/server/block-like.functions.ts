import { createServerFn } from "@tanstack/react-start"
import { AuthMiddleware } from "./middleware"
import { db } from "../db/index"
import { blogLike } from "@/db/blog-like.schema"
import { and, eq } from "drizzle-orm"


export const toggleBlogLike = createServerFn({ method: "POST" })
  .middleware([AuthMiddleware])
  .inputValidator((data: { blogId: string }) => data)
  .handler(async ({ data, context }) => {
    const userId = context.user!.id

    const existing = await db
      .select()
      .from(blogLike)
      .where(
        and(
          eq(blogLike.blogId, data.blogId),
          eq(blogLike.userId, userId)
        )
      )

    if (existing.length > 0) {
      // dislike (remove like)
      await db
        .delete(blogLike)
        .where(eq(blogLike.id, existing[0].id))

      return { liked: false }
    }

    await db.insert(blogLike).values({
      blogId: data.blogId,
      userId,
    })

    return { liked: true }
  })