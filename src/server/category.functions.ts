import { createServerFn } from "@tanstack/react-start"
import { db } from "../db/index"
import { category} from "@/db/schema"
import { AdminMiddleware } from "./middleware"
import { eq } from "drizzle-orm"
import { categorySchema } from "@/db/validations/category.types"

export const getAllCategories = createServerFn({ method: "GET" })
.middleware([AdminMiddleware])
    .handler(async () => {
        const results= await db.select().from(category).orderBy(category.name)
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