import { pgTable, text, timestamp, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { blog } from './blog-schema';
import { user } from './user-schema';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';



export const comment = pgTable("comment", {
  id: text("id").primaryKey(),

  blogId: text("blog_id")
    .notNull()
    .references(() => blog.id, { onDelete: "cascade" }),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // 👇 self reference for replies
//   parentId: text("parent_id").references(() => comment.id, {
//     onDelete: "cascade",
//   }),

    parentId: text("parent_id").references(
    (): AnyPgColumn => comment.id,
    { onDelete: "cascade" }
  ),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const commentRelations = relations(comment, ({ one, many }) => ({
  blog: one(blog, {
    fields: [comment.blogId],
    references: [blog.id],
  }),

  author: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),

  // parent comment
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
  }),

  // child replies
  replies: many(comment),
}));

export type Comment=InferSelectModel<typeof comment>
export type CommentRequest=Omit<InferInsertModel< typeof comment>,"id"|"createdAt"|"updatedAt">
export const CommentSchema=createInsertSchema(comment).omit({id:true, createdAt:true,updatedAt:true})