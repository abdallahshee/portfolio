import { pgTable, boolean, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const setting = pgTable("site_setting", {
  id: text("id").primaryKey().$default(() => nanoid(24)),

  settings: boolean("settings")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
})