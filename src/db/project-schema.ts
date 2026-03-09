import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp ,boolean,uuid} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const project = pgTable('project', {
    id: uuid("id").primaryKey(),
    title: text("name").notNull(),
    websiteUrl:text('url').notNull(),
    description: text("description").notNull().unique(),
    imageUrl: text("imageUrl"),
    isPublic:boolean('isPublic').notNull(),
    githubUrl:text('githubUrl').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export type Project=InferSelectModel<typeof project>

export type ProjectRequest=Omit<InferInsertModel<typeof project>, "id"|"createdAt"|"updatedAt">
export type NewProject=Omit<InferInsertModel<typeof project>, "createdAt"|"updatedAt">

export const ProjectRequestSchema = createInsertSchema(project).omit({id:true, createdAt:true,updatedAt:true})
// export const NewProjectSchema = createInsertSchema()
// .omit({id:true,createdAt:true, updatedAt:true})



