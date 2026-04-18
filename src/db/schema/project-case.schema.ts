import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { project } from "./project.schema";

export const caseStudy = pgTable('case_study', {
    id: text("id").primaryKey().$default(() => nanoid(24)),
    projectId: text("project_id")
        .notNull()
        .unique() // ✅ ensures 1:1 relationship
        .references(() => project.id, { onDelete: "cascade" }),
    title:text("title").notNull().unique(),
    overview: text("overview"), // short summary
    problem: text("problem").notNull(),
    solution: text("solution").notNull(),
    implementation: text("implementation").notNull(),
    startDate: timestamp("start_date",{mode:"string"}).notNull(),
    endDate: timestamp("end_date",{mode:"string"}).notNull(), //
    technologies: text("technologies").array(), // optional override
    outcomes:text("outcome").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const caseStudyRelations = relations(caseStudy, ({ one }) => ({
    project: one(project, {
        fields: [caseStudy.projectId],
        references: [project.id],
    }),

}))