import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer, check } from "drizzle-orm/pg-core";
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
    // progress: integer("progress").default(0).notNull(),
    technologies: text("technologies").array().notNull().default([]),
    roles: text("roles").array().default([]), 
    nextSteps: text("next-steps").array().default([]),  // 👈 new field — what you did on this project
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isContributor: boolean('is_contributor').default(false),  
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [

  ]
)