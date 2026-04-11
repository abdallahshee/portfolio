import type { InferSelectModel } from "drizzle-orm"
import {createSelectSchema } from "drizzle-zod"
import z from "zod"
import { article } from "../schema/article.schema"

export const ArticleSchema = createSelectSchema(article, {
    title: (schema) => schema.min(20, "Too short Title").max(50, "Title is too long"),
    content: (schema) => schema.min(300, "Too short article")
})
.pick({ categoryId: true, title: true, 
    content: true, coverImage: true, 
 })

export const MyPaginatedArticlesSchema=z.object({
    // userId:z.string().nonempty(),
    page:z.number().nonnegative().default(1),
    limit:z.number().nonnegative().default(6)
})
export type MyPaginatedArticleRequest=z.infer<typeof MyPaginatedArticlesSchema>
export type ArticleRequest = Pick<InferSelectModel<typeof article>, "categoryId" | "title" | "content" | "coverImage" >
export const ArticleUpdateSchema=ArticleSchema
.extend({slug:z.string()})
export type ArticleUpdateRequest = z.infer<typeof ArticleUpdateSchema>

export const PublishArticleSchema=createSelectSchema(article).pick({id:true, status:true})