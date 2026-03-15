import { pgTable, text, integer, timestamp, unique } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { project } from "./project.schema"
import { user } from "./user.schema"
import { relations } from "drizzle-orm"

export const projectRating = pgTable(
  "project_rating",
  {
    id: text("id").primaryKey().$default(() => nanoid(16)),

    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    rating: integer("rating").notNull(), // rating from 1 to 10

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userProjectUnique: unique("project_rating_user_project_unique").on(
      table.projectId,
      table.userId
    ),
  })
)

// Define relations for projectRating
export const projectRatingRelations = relations(projectRating, ({ one }) => ({
  project: one(project, {
    fields: [projectRating.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [projectRating.userId],
    references: [user.id],
  }),
}))