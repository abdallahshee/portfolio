import { createServerFn } from "@tanstack/react-start"
import { db } from "../db/index"
import { and, eq, sql } from "drizzle-orm"
import { articleLike } from "@/db/schema/article-like.schema"
import {  UserMiddleware } from "./middleware/auth.middleware"


// ── helper to get fresh likes count ──────────────────────────────
const getLikesCount = async (articleId: string) => {
    const result = await db
        .select({ likes: sql<number>`count(*)` })
        .from(articleLike)
        .where(eq(articleLike.articleId, articleId))
    return Number(result[0]?.likes ?? 0)
}

// ── Like a blog ───────────────────────────────────────────────────
export const likeBlog = createServerFn()
    .middleware([UserMiddleware])
    .inputValidator((data: { articleId: string }) => data)
    .handler(async ({ data, context }) => {
        const currentUserId = context.dbUser?.id

        if (!currentUserId) {
            throw new Error("You must be logged in to like a blog")
        }

        // Check if already liked — prevent duplicates
        const existingLike = await db
            .select({ id: articleLike.id })
            .from(articleLike)
            .where(
                and(
                    eq(articleLike.articleId, data.articleId),
                    eq(articleLike.userId, currentUserId)
                )
            )
            .limit(1)

        if (existingLike.length > 0) {
            throw new Error("You have already liked this blog")
        }

        await db.insert(articleLike).values({
            articleId: data.articleId,
            userId: currentUserId,
        })

        return {
            likes: await getLikesCount(data.articleId),
            likedByUser: true,
        }
    })

// ── Dislike (unlike) a blog ───────────────────────────────────────
export const dislikeArticle = createServerFn()
    .middleware([UserMiddleware])
    .inputValidator((data: { articleId: string }) => data)
    .handler(async ({ data, context }) => {
        const currentUserId = context.dbUser?.id

        if (!currentUserId) {
            throw new Error("You must be logged in to dislike a blog")
        }

        // Check if the like exists before trying to delete
        const existingLike = await db
            .select({ id: articleLike.id })
            .from(articleLike)
            .where(
                and(
                    eq(articleLike.articleId, data.articleId),
                    eq(articleLike.userId, currentUserId)
                )
            )
            .limit(1)

        if (existingLike.length === 0) {
            throw new Error("You have not liked this blog yet")
        }

        await db
            .delete(articleLike)
            .where(
                and(
                    eq(articleLike.articleId, data.articleId),
                    eq(articleLike.userId, currentUserId)
                )
            )

        return {
            likes: await getLikesCount(data.articleId),
            likedByUser: false,
        }
    })