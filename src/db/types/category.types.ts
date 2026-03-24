import type { InferSelectModel } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { category } from "../schema"
import z from "zod"


export type Category=InferSelectModel<typeof category>

export const categorySchema=createSelectSchema(category,{
  name:(schema)=>schema
  .min(5,"Category name should be at least 5 characters")
  .max(20,"Category name should not be more than 20 characters")
}).pick({name:true})

export type categoryRequest=z.infer<typeof categorySchema>