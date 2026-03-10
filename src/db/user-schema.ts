import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum } from "drizzle-orm/pg-core";
import { account, session } from "./auth-schema";
import { comment} from "./comment-schema";
import { blog } from "./blog-schema";

export const roleEnum = pgEnum("role", ["user", "admin"])
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").$default(() => "user"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  comments:many(comment),
  blogs:many(blog)
}));


export type User=InferSelectModel<typeof user>
export type NewUser=InferInsertModel<typeof user>

