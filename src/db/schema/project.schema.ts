
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { caseStudy } from "./case.schema";

export const project = pgTable('project', {
  id: text("id").primaryKey().$default(() => nanoid(24)),
  title: text("title"),
  slug: text("slug").unique(),
  description: text("description").unique(),
  imageUrl: text("image_url"),
  isPublic: boolean('is_public'),
  status: text({ enum: ["progress", "completed"] }),
  url: text('url').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})


// Project relations
export const projectRelations = relations(project, ({ one }) => ({
  case: one(caseStudy, {
    fields: [project.slug],
    references: [caseStudy.slug]
  })
  //  case: one(caseStudy)
}));


