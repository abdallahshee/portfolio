
import {  type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp ,boolean,integer} from "drizzle-orm/pg-core";
import { createInsertSchema} from 'drizzle-zod';
import { nanoid } from "nanoid";

export const project = pgTable('project', {
    id: text("id").primaryKey().$default(() => nanoid(16)),
    title: text("title").notNull(),
    websiteUrl:text('website_url').notNull(),
    description: text("description").notNull().unique(),
    imageUrl: text("image_url"),
    isPublic:boolean('is_public').notNull(),
    githubUrl:text('github_url').notNull(),
    rate:integer("rate").notNull(),
    technologies: text('technologies').array().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export type Project=InferSelectModel<typeof project>
export type ProjectRequest=Omit<InferInsertModel<typeof project>, "id"|"createdAt"|"updatedAt">
export const ProjectSchema = createInsertSchema(project).omit({id:true, createdAt:true,updatedAt:true})




