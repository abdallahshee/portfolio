import type { InferInsertModel } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { project } from "../schema"
import z from "zod"

export type ProjectRequest = Omit<InferInsertModel<typeof project>, "id" | "createdAt" | "updatedAt">

export const ProjectSchema = createInsertSchema(project,{
  title:(schema)=>schema.min(5).max(30),
  description:(schema)=>schema.min(50),
  imageUrl:(schema)=>schema.nonempty("Please select an image"),
  url:(schema)=>schema.nonempty(),
  technologies:()=>z.array(
    z.string().min(3).max(20)
  ).min(1).max(5)
}).omit({ id: true, createdAt: true, updatedAt: true })

export const updateProjectSchema = z.object({
  projectId: z.string().nonempty(),
  projectShema: ProjectSchema
})
export type UpdateProject = z.infer<typeof updateProjectSchema>
