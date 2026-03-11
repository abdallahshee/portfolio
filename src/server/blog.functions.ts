import { blog, BlogSchema } from "@/db/blog-schema";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { authMiddleware } from "./middleware";
import { eq } from "drizzle-orm";

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
            const blogs = await db.select().from(blog)
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