// db/schema/articles.ts
import { pgTable, text, timestamp, uuid, boolean} from "drizzle-orm/pg-core";
import { SupportedArticleCategories } from "../utils";

export const article = pgTable("articles", {
  id:          uuid("id").primaryKey().defaultRandom(),
  title:       text("title").notNull(),
  content:     text("content").notNull(),
  excerpt:     text("excerpt"),
  coverImage:  text("cover_image"),
  slug:        text("slug").notNull().unique(),
  category:   text("category",{enum:SupportedArticleCategories}).notNull(),
  featured:    boolean("featured").notNull().default(false),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});