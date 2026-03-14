import { createServerFn } from "@tanstack/react-start"
import { AuthMiddleware } from "./middleware"
import { blogLike } from "@/db/blog-like.schema"
import { db } from "../db/index"
import { and, eq, sql } from "drizzle-orm"

// ── helper to get fresh likes count ──────────────────────────────
const getLikesCount = async (blogId: string) => {
    const result = await db
        .select({ likes: sql<number>`count(*)` })
        .from(blogLike)
        .where(eq(blogLike.blogId, blogId))
    return Number(result[0]?.likes ?? 0)
}

// ── Like a blog ───────────────────────────────────────────────────
export const likeBlog = createServerFn()
    .middleware([AuthMiddleware])
    .inputValidator((data: { blogId: string }) => data)
    .handler(async ({ data, context }) => {
        const currentUserId = context.user?.id

        if (!currentUserId) {
            throw new Error("You must be logged in to like a blog")
        }

        // Check if already liked — prevent duplicates
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

        if (existingLike.length > 0) {
            throw new Error("You have already liked this blog")
        }

        await db.insert(blogLike).values({
            blogId: data.blogId,
            userId: currentUserId,
        })

        return {
            likes: await getLikesCount(data.blogId),
            likedByUser: true,
        }
    })

// ── Dislike (unlike) a blog ───────────────────────────────────────
export const dislikeBlog = createServerFn()
    .middleware([AuthMiddleware])
    .inputValidator((data: { blogId: string }) => data)
    .handler(async ({ data, context }) => {
        const currentUserId = context.user?.id

        if (!currentUserId) {
            throw new Error("You must be logged in to dislike a blog")
        }

        // Check if the like exists before trying to delete
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

        if (existingLike.length === 0) {
            throw new Error("You have not liked this blog yet")
        }

        await db
            .delete(blogLike)
            .where(
                and(
                    eq(blogLike.blogId, data.blogId),
                    eq(blogLike.userId, currentUserId)
                )
            )

        return {
            likes: await getLikesCount(data.blogId),
            likedByUser: false,
        }
    })