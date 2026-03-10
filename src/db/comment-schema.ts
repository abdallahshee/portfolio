import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { blog } from './blog-schema';
import { user } from './user-schema';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';



export const comment = pgTable('comments', {
  id: text('id').primaryKey(), // unique comment ID
  blogId: text('blog_id')
    .notNull()
    .references(() => blog.id), // foreign key to blogs
  userId: text('user_id')
    .notNull()
    .references(() => user.id), // foreign key to users
  content: text('content').notNull(), // the comment content
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const commentsRelations=relations(comment,({one})=>({
    user:one(user,{
        fields:[comment.userId],
        references:[user.id]
    }),
    blog:one(blog,{
        fields:[comment.blogId],
        references:[blog.id]
    })
}))

export type Comment=InferSelectModel<typeof comment>
export type CommentRequest=Omit<InferInsertModel< typeof comment>,"id"|"createdAt"|"updatedAt">
export const CommentSchema=createInsertSchema(comment).omit({id:true, createdAt:true,updatedAt:true})