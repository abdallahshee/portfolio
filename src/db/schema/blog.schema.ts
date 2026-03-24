import { relations } from "drizzle-orm";
import { pgTable, text, timestamp} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./user.schema";
import { comment } from "./comment.schema";

import { blogLike } from "./blog-like.schema";

import { category } from "./category.schema";

export const blog = pgTable("blog", {
  id: text("id").primaryKey().$default(() => nanoid(16)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  content: text("content").notNull(), // markdown
  coverImage: text("cover_image"),
  status: text("status", { enum: ['draft', 'pending', 'published'] }),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  categoryId: text('category_id').references(() => category.id, { onDelete: 'set null' }),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const blogRelations = relations(blog, ({ one, many }) => ({
  author: one(user, {
    fields: [blog.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [blog.categoryId],
    references: [category.id],
  }),
  comments: many(comment),

  likes: many(blogLike),
}))




