import { relations } from "drizzle-orm";
import { pgTable, text, timestamp} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./user.schema";
import { comment } from "./comment.schema";
import { articleLike } from "./article-like.schema";
import { category } from "./category.schema";
import { uuid } from "drizzle-orm/pg-core";

export const article = pgTable("article", {
  id: text("id").primaryKey().$default(() => nanoid(16)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  userId: uuid("userId").notNull().references(() => user.id),
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

export const articleRelations = relations(article, ({ one, many }) => ({
  author: one(user, {
    fields: [article.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [article.categoryId],
    references: [category.id],
  }),
  comments: many(comment),
  likes: many(articleLike),
}))




