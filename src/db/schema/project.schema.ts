import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer, check } from "drizzle-orm/pg-core";
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

  // NEW FIELD: project progress (0 - 100)
  progress: integer("progress").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
},  (table) => ({
    progressRange: check(
      "progress_range_check",
      sql`${table.progress} >= 0 AND ${table.progress} <= 100`
    ),
  })
)