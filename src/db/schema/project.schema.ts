
import { relations} from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { projectRating } from "./project-rating.schema";

export const project = pgTable('project', {
  id: text("id").primaryKey().$default(() => nanoid(16)),
  title: text("title").notNull(),
  description: text("description").notNull().unique(),
  imageUrl: text("image_url"),
  isPublic: boolean('is_public').notNull(),
  url: text('url').notNull(),
  technologies: text('technologies').array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})


// Project relations
export const projectRelations = relations(project, ({ many }) => ({
  ratings: many(projectRating), // all ratings associated with this project
}));


