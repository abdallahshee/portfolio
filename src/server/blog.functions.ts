import { blog, BlogSchema } from "@/db/blog.schema";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { authMiddleware } from "./middleware";
import { desc, eq, sql } from "drizzle-orm";
import { blogLike } from "@/db/blog-like.schema";
import { comment } from "@/db/comment.schema";
import { user } from "@/db/user.schema";

export const createBlog = createServerFn({ method: "POST" })
    .inputValidator(BlogSchema).middleware([authMiddleware])
    .handler(async ({ data, context }) => {
        try {
            const newData = { ...data, userId: context.user?.id! }
            await db.insert(blog).values({ ...newData })

        } catch (err) {
            console.log(err)
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

export const getBlogBySlug = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    try {
      // Blog
      const blogResult = await db
        .select({
          id: blog.id,
          title: blog.title,
          tags: blog.tags,
          content: blog.content,
          coverImage: blog.coverImage,

          authorId: user.id,
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

      // Likes
      const likesResult = await db
        .select({
          likes: sql<number>`count(*)`,
        })
        .from(blogLike)
        .where(eq(blogLike.blogId, blogData.id))

      const likes = Number(likesResult[0]?.likes ?? 0)

      return {
        ...blogData,
        likes,
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
                    slug:blog.slug,
                    coverImage:blog.coverImage,
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