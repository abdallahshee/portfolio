import type { InferSelectModel } from "drizzle-orm"
import {createSelectSchema } from "drizzle-zod"
import z from "zod"
import { article } from "../schema/article.schema"


export const ArticleSchema = createSelectSchema(article, {
    tags: z.array(
        z.string()
            .min(3, "Each tag must be at least 3 characters")
            .max(20, "Each tag must not exceed 20 characters")
    ).min(1, "At least one tag is required")
        .max(5, "You can not add more than 10 tags"),
    title: (schema) => schema.min(20, "Too short Title").max(50, "Title is too long"),
    content: (schema) => schema.min(300, "Too short article")
}).pick({ categoryId: true, title: true, content: true, coverImage: true, tags: true })


export type ArticleRequest = Pick<InferSelectModel<typeof article>, "categoryId" | "title" | "content" | "coverImage" | "tags">
export const ArticleUpdateSchema=ArticleSchema
.extend({slug:z.string()})
export type ArticleUpdateRequest = z.infer<typeof ArticleUpdateSchema>

export const PublishArticleSchema=createSelectSchema(article).pick({id:true, status:true})