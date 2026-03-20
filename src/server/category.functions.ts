import { createServerFn } from "@tanstack/react-start"
import { db } from "../db/index"
import { category, categorySchema } from "@/db/schema"
import { AdminMiddleware } from "./middleware"
import { eq } from "drizzle-orm"

export const getAllCategories = createServerFn({ method: "GET" })
    .handler(async () => {
        const results= await db.select().from(category).orderBy(category.name)
        return results
    })

export const deleteCategory = createServerFn({ method: "POST" })
    .middleware([AdminMiddleware])
    .inputValidator((data: { categoryId: number }) => data)
    .handler(async ({ data }) => {
        await db.delete(category).where(eq(category.id, data.categoryId))
    })

export const createCategory = createServerFn({ method: "POST" })
    .middleware([AdminMiddleware])
    .inputValidator(categorySchema)
    .handler(async ({ data }) => {
        try {
            const newCategory = await db
                .insert(category)
                .values({ name: data.name })
                .returning()  // ✅ missing this
            return newCategory[0]
        } catch (err) {
            console.log(err)
            throw err
        }
    })