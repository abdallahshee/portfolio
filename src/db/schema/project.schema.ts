import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const project = pgTable(
  'project',
  {
    id: text("id").primaryKey().$default(() => nanoid(24)),
    title: text("title"),
    slug: text("slug").unique(),
    description: text("description").unique(),
    imageUrl: text("image_url"),
    githubUrl: text('github_url'),
    liveUrl: text('live_url'),
    isFeatured: boolean('is_featured'),
    technologies: text("technologies").array().notNull().default([]),
    roles: text("roles").array().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isContributor: boolean('is_contributor').default(false),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_slug_idx").on(table.slug),
    index("project_title_idx").on(table.title),
    index("project_is_featured_idx").on(table.isFeatured),
  ]
)