import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";
import { user } from "./user.schema";
import { article } from "./article.schema";
import { uuid } from "drizzle-orm/pg-core";

export const articleLike = pgTable(
  "article_like",
  {
    id: text("id").primaryKey().$default(() => nanoid(16)),
    articleId: text("article_id")
      .notNull()
      .references(() => article.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },

  (table) => [
    unique("article_like_unique").on(table.articleId, table.userId),
  ]
)

export const articleLikeRelations = relations(articleLike, ({ one }) => ({
  article: one(article, {
    fields: [articleLike.articleId],
    references: [article.id],
  }),

  user: one(user, {
    fields: [articleLike.userId],
    references: [user.id],
  }),
}))