import type { InferSelectModel } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { blog } from "../schema"
import z from "zod"

export type BlogRequest = Pick<InferSelectModel<typeof blog>, "categoryId" | "title" | "content" | "coverImage" | "tags">
export const BlogSchema = createInsertSchema(blog, {
  tags: z.array(
    z.string()
      .min(3, "Each tag must be at least 3 characters")
      .max(20, "Each tag must not exceed 20 characters")
  ).min(1, "At least one tag is required")
    .max(5, "You can not add more than 10 tags"),
  title: (schema) => schema.min(20, "Too short Title").max(50, "Title is too long"),
  content: (schema) => schema.min(300, "Too short article")
}).pick({ categoryId: true, title: true, content: true, coverImage: true, tags: true })

export const BlogUpdateSchema = z.object({
  blogSchema: BlogSchema,
  slug: z.string(),
})

export type BlogUpdateForm = z.infer<typeof BlogUpdateSchema>

export type Role = "admin" | "user"
