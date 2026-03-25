
import { relations } from "drizzle-orm"
import {  pgTable, text } from "drizzle-orm/pg-core"
import { article } from "./article.schema"
import { nanoid } from "nanoid"

export const category = pgTable('category', {
  id: text('id').primaryKey().$default(()=>nanoid(5)),
  name: text('name').notNull().unique(),
})

export const categoryRelations = relations(category, ({ many }) => ({
  articles: many(article),
}))

