import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const testimonial = pgTable('testimonial', {
  id: text("id").primaryKey().$default(() => nanoid(24)),
  quote: text('quote').notNull(),
  authorName: text('author_name').notNull(),
  authorTitle: text("author_title").notNull(),
  company: text("company").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

})