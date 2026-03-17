import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./user.schema";
import { comment } from "./comment.schema";
import { createInsertSchema } from "drizzle-zod";
import { blogLike } from "./blog-like.schema";
import z from "zod";


export const blogStatusEnum = pgEnum('blog_status', ['draft', 'pending', 'published'])
export const blog = pgTable("blog", {
  id: text("id").primaryKey().$default(() => nanoid(16)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  content: text("content").notNull(), // markdown
  coverImage: text("cover_image"),
  status: blogStatusEnum("status").notNull().$default(() => "draft"),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

  comments: many(comment),

  likes: many(blogLike),
}))


export type Blog = InferSelectModel<typeof blog>
export type BlogRequest = Pick<InferInsertModel<typeof blog>, "title" | "content" | "coverImage" | "tags">
export const BlogSchema = createInsertSchema(blog).pick({ title: true, content: true, coverImage: true, tags: true })

export const BlogUpdateSchema = z.object({
  blogSchema: BlogSchema,
  slug: z.string(),
})

export type BlogUpdateForm = z.infer<typeof BlogUpdateSchema>