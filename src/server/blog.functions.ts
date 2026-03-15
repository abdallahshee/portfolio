import { blog, BlogSchema, BlogUpdateSchema } from "@/db/blog.schema";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { AuthMiddleware, OptionalAuthMiddleware } from "./middleware";
import { and, desc, eq, sql } from "drizzle-orm";
import { blogLike } from "@/db/blog-like.schema";
import { comment } from "@/db/comment.schema";
import { user } from "@/db/user.schema";
import zod, { z } from "zod"

function createSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-") // replace spaces with -
        .replace(/-+/g, "-") // remove duplicate -
}

function createExcerpt(content: string, maxLength = 160) {
    const plainText = content.replace(/[#_*>\-\n`]/g, " ").trim()
    return plainText.length > maxLength
        ? plainText.slice(0, maxLength).trim() + "..."
        : plainText
}

export const createBlog = createServerFn({ method: "POST" })
    .inputValidator(BlogSchema)
    .middleware([AuthMiddleware])
    .handler(async ({ data, context }) => {
        try {
            const slug = createSlug(data.title)
            const excerpt = createExcerpt(data.content)
            console.log("User in context " + context.user)
            const newData = {
                ...data,
                slug,
                excerpt,
                userId: context.user?.id!,
            }

            const result = await db.insert(blog).values(newData).returning()
            return result
        } catch (err) {
            console.error("Create blog failed:", err)
            throw err
        }
    })

export const getAllBlogs = createServerFn()
    .handler(async () => {
        try {
            const blogs = await db
                .select({
                    id: blog.id,
                    title: blog.title,
                    authorImage: user.image,
                    tags: blog.tags,
                    content: blog.content,
                    coverImage: blog.coverImage,
                    slug: blog.slug,
                    createdAt: blog.createdAt,
                    updatedAt: blog.updatedAt,
                    likes: sql<number>`COUNT(DISTINCT ${blogLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(blog)
                .leftJoin(user, eq(blog.userId, user.id))
                .leftJoin(blogLike, eq(blog.id, blogLike.blogId))
                .leftJoin(comment, eq(blog.id, comment.blogId))
                .groupBy(blog.id, user.image)
                .orderBy(desc(sql`COUNT(DISTINCT ${blogLike.id})`))

            return blogs
        } catch (err) {
            console.log(err)
        }
    })

export const getBlogBySlugdForUpdate = createServerFn()
    .middleware([AuthMiddleware])
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data}) => {
        try {
            // Blog
            const blogResult = await db
                .select({
                    id:blog.id,
                    title: blog.title,
                    tags: blog.tags,
                    content: blog.content,
                    coverImage: blog.coverImage,
                })
                .from(blog)
                .where(eq(blog.slug, data.slug))
            const blogData = blogResult[0]
            if (!blogData) return null
            return {
                ...blogData,
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const getBlogBySlug = createServerFn()
    .middleware([OptionalAuthMiddleware])
    .inputValidator((data: { slug: string }) => data)
    .handler(async ({ data, context }) => {
        try {
            const currentUserId = context.user?.id ?? null

            // Blog
            const blogResult = await db
                .select({
                    id: blog.id,
                    title: blog.title,
                    tags: blog.tags,
                    content: blog.content,
                    coverImage: blog.coverImage,
                    userId: blog.userId,
                    authorId: user.id,
                    slug: blog.slug,
                    authorName: user.name,
                    authorImage: user.image,

                    createdAt: blog.createdAt,
                    updatedAt: blog.updatedAt,
                })
                .from(blog)
                .leftJoin(user, eq(blog.userId, user.id))
                .where(eq(blog.slug, data.slug))

            const blogData = blogResult[0]

            if (!blogData) return null

            // Comments
            const comments = await db
                .select({
                    id: comment.id,
                    parentId: comment.parentId,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    authorId: user.id,
                    authorName: user.name,
                    authorImage: user.image,
                })
                .from(comment)
                .leftJoin(user, eq(comment.userId, user.id))
                .where(eq(comment.blogId, blogData.id))
                .orderBy(desc(comment.createdAt))

            // Likes count
            const likesResult = await db
                .select({
                    likes: sql<number>`count(*)`,
                })
                .from(blogLike)
                .where(eq(blogLike.blogId, blogData.id))

            const likes = Number(likesResult[0]?.likes ?? 0)

            // Whether current user has liked this blog
            let likedByUser = false

            if (currentUserId) {
                const likedResult = await db
                    .select({ id: blogLike.id })
                    .from(blogLike)
                    .where(
                        and(
                            eq(blogLike.blogId, blogData.id),
                            eq(blogLike.userId, currentUserId)
                        )
                    )
                    .limit(1)

                likedByUser = likedResult.length > 0
            }

            return {
                ...blogData,
                likes,
                likedByUser,
                comments,
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const getPaginatedBlogs = createServerFn({ method: 'GET' })
    .inputValidator((data: { page?: number; limit?: number }) => ({
        page: data.page && data.page > 0 ? data.page : 1,
        limit: data.limit && data.limit > 0 ? data.limit : 6,
    }))
    .handler(async ({ data }) => {
        try {
            const page = data.page ?? 1
            const limit = data.limit ?? 6
            const offset = (page - 1) * limit

            const blogs = await db
                .select({
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt,
                    coverImage: blog.coverImage,
                    createdAt: blog.createdAt,
                    authorImage: user.image,
                    likes: sql<number>`COUNT(DISTINCT ${blogLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(blog)
                .leftJoin(user, eq(blog.userId, user.id))
                .leftJoin(blogLike, eq(blog.id, blogLike.blogId))
                .leftJoin(comment, eq(blog.id, comment.blogId))
                .groupBy(
                    blog.id,
                    blog.title,
                    blog.slug,
                    blog.excerpt,
                    blog.coverImage,
                    blog.createdAt,
                    user.image
                )
                .orderBy(desc(blog.createdAt))
                .limit(limit)
                .offset(offset)

            const totalResult = await db
                .select({
                    count: sql<number>`COUNT(*)`,
                })
                .from(blog)

            const total = Number(totalResult[0]?.count ?? 0)
            const totalPages = Math.ceil(total / limit)

            return {
                blogs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })


export const getTopBlogs = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const topBlogs = await db
                .select({
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    coverImage: blog.coverImage,
                    authorImage: user.image,
                    likes: sql<number>`COUNT(DISTINCT ${blogLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(blog)
                .leftJoin(user, eq(blog.userId, user.id))
                .leftJoin(blogLike, eq(blog.id, blogLike.blogId))
                .leftJoin(comment, eq(blog.id, comment.blogId))
                .groupBy(blog.id, user.image)
                .orderBy(desc(sql`COUNT(DISTINCT ${blogLike.id})`))
                .limit(5)

            return topBlogs
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const updateBlog = createServerFn({ method: "POST" })
  .inputValidator(BlogUpdateSchema)
  .middleware([AuthMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const updated = await db
        .update(blog)
        .set({
          title: data.blogSchema.title,
          content: data.blogSchema.content,
          coverImage: data.blogSchema.coverImage ?? null,
          tags: data.blogSchema.tags,
        })
        .where(
          and(
            eq(blog.slug, data.slug),
            eq(blog.userId, context.user?.id!)
          )
        )
        .returning()

      if (!updated.length) {
        throw new Error("Blog not found or you do not have permission to edit it")
      }

      return updated[0]
    } catch (err) {
      console.error("Update blog failed:", err)
      throw err
    }
  })