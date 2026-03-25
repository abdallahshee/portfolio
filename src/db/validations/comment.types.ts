import type { InferSelectModel } from "drizzle-orm"
import { comment } from "../schema"
import { createInsertSchema } from "drizzle-zod"

export type CommentRequest = Omit<InferSelectModel<typeof comment>, "id" | "createdAt" | "updatedAt">
export const CommentSchema = createInsertSchema(comment, {
    content: (schema) => schema.max(500, "Too long for a comment")
}).pick({ articleId: true, content: true, parentId: true })