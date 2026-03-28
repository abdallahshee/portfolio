import { createServerFn } from '@tanstack/react-start'
import { eq, and } from 'drizzle-orm'
import { db } from '../db/index'
import { CommentSchema } from '@/db/validations/comment.types'
import { article } from '@/db/schema/article.schema'
import { comment } from '@/db/schema'
import { UserMiddleware } from './middleware/auth.middleware'

export const createComment = createServerFn({ method: 'POST' })
    .middleware([UserMiddleware])
    .inputValidator(CommentSchema)
    .handler(async ({ data, context }) => {
        try {
            if (!context.userId) {
                throw new Error('Unauthorized')
            }
            const existingBlog = await db
                .select({ id: article.id })
                .from(article)
                .where(eq(article.id, data.articleId))

            if (!existingBlog[0]) {
                throw new Error('Article not found')
            }

            const normalizedParentId = data.parentId ?? null

            if (normalizedParentId) {
                const existingParent = await db
                    .select({
                        id: comment.id,
                        articleId: comment.articleId,
                    })
                    .from(comment)
                    .where(
                        and(
                            eq(comment.id, normalizedParentId),
                            eq(comment.articleId, data.articleId)
                        )
                    )

                if (!existingParent[0]) {
                    throw new Error('Parent comment not found')
                }
            }

            const inserted = await db
                .insert(comment)
                .values({
                    // id: nanoid(16),
                    articleId: data.articleId,
                    userId: context.user.id,
                    parentId: normalizedParentId,
                    content: data.content.trim(),
                })
                .returning({
                    id: comment.id,
                    articleId: comment.articleId,
                    userId: comment.userId,
                    parentId: comment.parentId,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                })

            return inserted[0]
        } catch (err) {
            console.log(err)
            throw err
        }
    })

