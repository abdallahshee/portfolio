import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, } from "drizzle-orm/pg-core";
import { account, session } from "./auth.schema";
import { comment } from "./comment.schema";
import { article } from "./article.schema";
import { articleLike } from "./article-like.schema";
import { projectRating } from "./project-rating.schema";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role",{enum:["user", "admin"]}).$default(() => "user").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  comments: many(comment),
  articles: many(article),
  articleLikes: many(articleLike),
  projectRatings: many(projectRating),
}));



