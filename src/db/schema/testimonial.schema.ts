import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const testimonial = pgTable('testimonial', {
  id: text("id").primaryKey().$default(() => nanoid(24)),
  quote: text('quote').notNull(),
  authorFirstname: text('author_firstname').notNull(),
  authorLastname: text('author_lasttname').notNull(),
  authorTitle: text("author_title").notNull(),
  company: text("company").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

})