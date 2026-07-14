import { pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

// Reference auth.users
const authUsers = authSchema.table("users", {
    id: uuid("id").primaryKey(),
});

// export const profile = pgTable("profile", {
//     id: uuid("id")
//         .primaryKey()
//         .notNull()
//         .references(() => authUsers.id, { onDelete: "cascade" }),
//     email: text("email"),
//     // phone: text("phone"),
//     role: text("role").notNull(),
//     firstname: text("first_name"),
//     lastname: text("last_name"),
//     createdAt:timestamp("created_at",{mode:"string"},).notNull().defaultNow(),
//     updatedAt:timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

