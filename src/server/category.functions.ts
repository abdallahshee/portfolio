import { createServerFn } from "@tanstack/react-start"
import { db } from "../db/index"
import { category } from "@/db/schema"
import { eq } from "drizzle-orm"
import { CategorySchema, EditCategorySchema } from "@/db/validations/category.types"
import { AdminMiddleware, AuthenticatedMiddleware } from "./middleware"

export const getAllCategories = createServerFn({ method: "GET" })
    .middleware([AuthenticatedMiddleware])
    .handler(async () => {
        const results = await db.select().from(category).orderBy(category.name)
        return results
    })

export const deleteCategory = createServerFn({ method: "POST" })
    .middleware([AdminMiddleware])
    .inputValidator((data: { categoryId: string }) => data)
    .handler(async ({ data }) => {
        await db.delete(category).where(eq(category.id, data.categoryId))
    })

export const createCategory = createServerFn({ method: "POST" })
    .middleware([AdminMiddleware])
    .inputValidator(CategorySchema)
    .handler(async ({ data }) => {
        try {
            const [newCategory] = await db
                .insert(category)
                .values({ name: data.name })
                .returning()  // ✅ missing this
            return newCategory
        } catch (err) {
            console.log(err)
            throw err
        }
    })

export const editCategory = createServerFn({ method: "POST" })
    .middleware([AdminMiddleware])
    .inputValidator(EditCategorySchema)
    .handler(async ({ data }) => {
        try {
            const [newCategory] = await db
                .update(category)
                .set({ name: data.name })
                .where(eq(category.id, data.categoryId))
                .returning()
            return newCategory
        } catch (err) {
            console.log(err)
            throw err
        }
    })