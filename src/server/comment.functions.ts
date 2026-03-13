import { createServerFn } from '@tanstack/react-start'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { blog } from '@/db/blog.schema'
import { comment, createCommentSchema } from '@/db/comment.schema'
import { authMiddleware } from './middleware'
import { db } from '../db/index'


export const createComment = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(createCommentSchema)
  .handler(async ({ data, context }) => {
    try {
      if (!context.user?.id) {
        throw new Error('Unauthorized')
      }

      const existingBlog = await db
        .select({ id: blog.id })
        .from(blog)
        .where(eq(blog.id, data.blogId))

      if (!existingBlog[0]) {
        throw new Error('Blog not found')
      }

      const normalizedParentId = data.parentId ?? null

      if (normalizedParentId) {
        const existingParent = await db
          .select({
            id: comment.id,
            blogId: comment.blogId,
          })
          .from(comment)
          .where(
            and(
              eq(comment.id, normalizedParentId),
              eq(comment.blogId, data.blogId)
            )
          )

        if (!existingParent[0]) {
          throw new Error('Parent comment not found')
        }
      }

      const inserted = await db
        .insert(comment)
        .values({
          id: nanoid(16),
          blogId: data.blogId,
          userId: context.user.id,
          parentId: normalizedParentId,
          content: data.content.trim(),
        })
        .returning({
          id: comment.id,
          blogId: comment.blogId,
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