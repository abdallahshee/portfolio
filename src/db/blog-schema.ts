import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./user-schema";
import { comment } from "./comment-schema";
import { createInsertSchema, type CreateInsertSchema } from "drizzle-zod";


export const blogStatusEnum = pgEnum('blog_status', ['draft', 'pending', 'published'])
export const blog = pgTable("blog", {
  id: text("id").primaryKey().$default(() => nanoid(16)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  userId:text("userId").notNull().references(()=>user.id),
  content: text("content").notNull(), // markdown
  coverImage: text("cover_image").notNull(),
  status:blogStatusEnum("status").notNull().$default(()=>"draft"),
  tags: text("tags").array().notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const blogRelations=relations(blog,({one,many})=>({
    author:one(user,{
        fields:[blog.userId],
        references:[user.id]
    }),
    comments:many(comment)
 
}))
export type Blog=InferSelectModel<typeof blog>
export type BlogRequest=Omit<InferInsertModel< typeof blog>, "id"|"createdAt"|"updatedAt">
export const BlogSchema=createInsertSchema(blog).omit({id:true, createdAt:true,updatedAt:true})