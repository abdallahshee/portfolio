import { createSelectSchema } from "drizzle-zod";
import { article } from "../schema";
import z from "zod"
import { SupportedArticleCategories } from "../utils";
// title:       text("title").notNull(),
//   content:     text("content").notNull(),
//   excerpt:     text("excerpt"),
//   coverImage:  text("cover_image"),
//   slug:        text("slug").notNull().unique(),
//   category:   text("category",{enum:SupportedArticleCategories}).notNull(),
//   featured:    boolean("featured").notNull().default(false),

const ArticleSchema = createSelectSchema(article, {
    title: z.string(),
    content: z.string(),
    excerpt: z.string(),
    coverImage: z.string(),
    category: z.enum(SupportedArticleCategories),
    featured: z.boolean()
})

export const ArticleCreateSchema = ArticleSchema.pick({
    title: true,
    content: true,
    excerpt: true,
    coverImage: true,
    category: true,
    featured: true
})

export type ArticleRequest=z.infer<typeof ArticleCreateSchema>