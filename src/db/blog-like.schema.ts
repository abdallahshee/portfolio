import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";
import { user } from "./user.schema";
import { blog } from "./blog.schema";

export const blogLike = pgTable(
  "blog_like",
  {
    id: text("id").primaryKey().$default(() => nanoid(16)),

    blogId: text("blog_id")
      .notNull()
      .references(() => blog.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  
  (table) => [
    unique("blog_like_unique").on(table.blogId, table.userId),
  ]
)

export const blogLikeRelations = relations(blogLike, ({ one }) => ({
  blog: one(blog, {
    fields: [blogLike.blogId],
    references: [blog.id],
  }),

  user: one(user, {
    fields: [blogLike.userId],
    references: [user.id],
  }),
}))