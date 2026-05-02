import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const project = pgTable('project', {
  id: text("id").primaryKey().$default(() => nanoid(24)),
  title: text("title"),
  slug: text("slug").unique(),
  description: text("description").unique(),
  imageUrl: text("image_url"),
  isPublic: boolean('is_public'),
  githubUrl: text('github_url'),
  url: text('url'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})





