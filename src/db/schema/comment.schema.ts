import { pgTable, text, timestamp, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { article } from './article.schema';
import { user } from './user.schema';
import { relations} from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const comment = pgTable("comment", {
  id: text("id").primaryKey().$default(()=>nanoid()),

  articleId: text("article_id")
    .notNull()
    .references(() => article.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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
  article: one(article, {
    fields: [comment.articleId],
    references: [article.id],
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

