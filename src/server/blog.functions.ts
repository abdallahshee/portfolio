import { blog, BlogSchema } from "@/db/blog.schema";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { authMiddleware } from "./middleware";
import {  desc, eq, sql } from "drizzle-orm";
import { blogLike } from "@/db/blog-like.schema";
import { comment } from "@/db/comment.schema";

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
                    likes: sql<number>`COUNT(DISTINCT ${blogLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(blog)
                .leftJoin(blogLike, eq(blog.id, blogLike.blogId))
                .leftJoin(comment, eq(blog.id, comment.blogId))
                .groupBy(blog.id)
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
            const blogBySlug = await db.select().from(blog).where(eq(blog.slug, data.slug))
            return blogBySlug
        } catch (err) {
            console.log(err)
        }
    })



export const getTopBlogs = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const topBlogs = await db
                .select({
                    id: blog.id,
                    title: blog.title,
                    likes: sql<number>`COUNT(DISTINCT ${blogLike.id})`,
                    comments: sql<number>`COUNT(DISTINCT ${comment.id})`,
                })
                .from(blog)
                .leftJoin(blogLike, eq(blog.id, blogLike.blogId))
                .leftJoin(comment, eq(blog.id, comment.blogId))
                .groupBy(blog.id)
                .orderBy(desc(sql`COUNT(DISTINCT ${blogLike.id})`))
                .limit(5)

            return topBlogs
        } catch (err) {
            console.log(err)
            throw err
        }
    })