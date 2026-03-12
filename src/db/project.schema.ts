
import {  relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp ,boolean} from "drizzle-orm/pg-core";
import { createInsertSchema} from 'drizzle-zod';
import { nanoid } from "nanoid";
import { projectRating } from "./project-rating.schema";

export const project = pgTable('project', {
    id: text("id").primaryKey().$default(() => nanoid(16)),
    title: text("title").notNull(),
    websiteUrl:text('website_url').notNull(),
    description: text("description").notNull().unique(),
    imageUrl: text("image_url"),
    isPublic:boolean('is_public').notNull(),
    githubUrl:text('github_url').notNull(),
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

export type Project=InferSelectModel<typeof project>
export type ProjectRequest=Omit<InferInsertModel<typeof project>, "id"|"createdAt"|"updatedAt">
export const ProjectSchema = createInsertSchema(project).omit({id:true, createdAt:true,updatedAt:true})




