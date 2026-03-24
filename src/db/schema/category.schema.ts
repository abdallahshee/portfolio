
import { relations, type InferSelectModel } from "drizzle-orm"
import {  pgTable, text } from "drizzle-orm/pg-core"
import { blog } from "./blog.schema"
import { createSelectSchema } from "drizzle-zod"
import z from "zod"
import { nanoid } from "nanoid"

export const category = pgTable('category', {
  id: text('id').primaryKey().$default(()=>nanoid(5)),
  name: text('name').notNull().unique(),
})

export const categoryRelations = relations(category, ({ many }) => ({
  blogs: many(blog),
}))

