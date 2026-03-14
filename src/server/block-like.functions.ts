import { createServerFn } from "@tanstack/react-start"
import { AuthMiddleware } from "./middleware"
import { blogLike } from "@/db/blog-like.schema"
import { db } from "../db/index"
import { and, eq, sql } from "drizzle-orm"

export const toggleBlogLike = createServerFn()
    .middleware([AuthMiddleware])
    .inputValidator((data: { blogId: string }) => data)
    .handler(async ({ data, context }) => {
        const currentUserId = context.user?.id

        if (!currentUserId) {
            throw new Error("You must be logged in to like a blog")
        }

        // Check if the user has already liked this blog
        const existingLike = await db
            .select({ id: blogLike.id })
            .from(blogLike)
            .where(
                and(
                    eq(blogLike.blogId, data.blogId),
                    eq(blogLike.userId, currentUserId)
                )
            )
            .limit(1)

        const alreadyLiked = existingLike.length > 0

        if (alreadyLiked) {
            // Unlike: delete the existing like
            await db
                .delete(blogLike)
                .where(
                    and(
                        eq(blogLike.blogId, data.blogId),
                        eq(blogLike.userId, currentUserId)
                    )
                )
        } else {
            // Like: insert a new like
            await db.insert(blogLike).values({
                blogId: data.blogId,
                userId: currentUserId,
            })
        }

        // Return updated likes count and new liked status
        const likesResult = await db
            .select({ likes: sql<number>`count(*)` })
            .from(blogLike)
            .where(eq(blogLike.blogId, data.blogId))

        return {
            likes: Number(likesResult[0]?.likes ?? 0),
            likedByUser: !alreadyLiked,
        }
    })