import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./auth-schema";

export const BlogStatus = pgEnum('blog_status', ['draft', 'pending', 'published'])
export const blog = pgTable("blog", {
  id: text("id").primaryKey().$default(() => nanoid(16)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  userId:text("userId").notNull().references(()=>user.id),
  content: text("content").notNull(), // markdown
  coverImage: text("cover_image"),
  status:BlogStatus("status").notNull().$default(()=>"draft"),
  tags: text("tags").array(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

