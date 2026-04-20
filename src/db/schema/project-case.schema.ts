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
    title: text("title").unique(),
    overview: text("overview"), // short summary
    problem: text("problem"),
    solution: text("solution"),
    implementation: text("implementation"),
    startDate: timestamp("start_date", { mode: "string" }),
    endDate: timestamp("end_date", { mode: "string" }), //
    technologies: text("technologies").array(), // optional override
    outcomes: text("outcome").notNull(),
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