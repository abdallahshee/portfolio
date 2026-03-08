import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp ,boolean} from "drizzle-orm/pg-core";


export const project = pgTable('project', {
    id: text("id").primaryKey(),
    title: text("name").notNull(),
    url:text('url').notNull(),
    description: text("description").notNull().unique(),
    image: text("image"),
    isPublic:boolean('isPublic').notNull(),
    githubUrl:text('githubUrl').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

