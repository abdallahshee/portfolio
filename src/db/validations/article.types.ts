import type { InferSelectModel } from "drizzle-orm"
import {createSelectSchema } from "drizzle-zod"
import z from "zod"
import { article } from "../schema/article.schema"

export const ArticleSchema = createSelectSchema(article, {
    tags: z.array(
        z.string()
            .min(3, "Each tag must be at least 3 characters")
            .max(16, "Each tag must not exceed 16 characters")
    ).min(1, "At least one tag is required")
        .max(4, "You can not add more than 4 tags"),
    title: z.string().min(30, "Title out of range 100-200").max(60, "Title out of range 100-200"),
    content: z.string().min(1500, "Content out of range 1500-6000").max(6000,"Content out of range 1500-5000"),
    excerpt:z.string().min(120, "Excerpt out of range 120-200").max(200, "Excerpt out range 120-200")
})
.pick({ categoryId: true, title: true, excerpt:true,
    content: true, coverImage: true, tags:true
 })

export const MyPaginatedArticlesSchema=z.object({
    page:z.number().nonnegative().default(1),
    limit:z.number().nonnegative().default(6)
})
export type MyPaginatedArticleRequest=z.infer<typeof MyPaginatedArticlesSchema>
export type ArticleRequest = Pick<InferSelectModel<typeof article>,"excerpt"|"tags"|"categoryId" | "title" | "content" | "coverImage" >
export const ArticleUpdateSchema=ArticleSchema
.extend({slug:z.string()})
export type ArticleUpdateRequest = z.infer<typeof ArticleUpdateSchema>

export const PublishArticleSchema=createSelectSchema(article).pick({id:true, status:true})