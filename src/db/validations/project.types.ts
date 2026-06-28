
import { project } from "../schema"
import z from "zod"
import { createSelectSchema } from "drizzle-zod"
import type { InferSelectModel } from "drizzle-orm"

const ProjectSchema = createSelectSchema(project, {
  progress: z.number(),
  title: z.string().min(5, "Title out of range 3-50 characters").max(50, "Title out of range 3-50 characters"),
  description: z.string()
    .min(100, "Description out of range 100-800 characters")
    .max(800, "Description out of range 100-800 characters"),
  imageUrl: z.string(),
  isFeatured: z.boolean(),
  liveUrl: z.string(),   // 👈 matches table column name now
  githubUrl: z.string(),
  technologies: z.array(z.string()).default([]), // 👈 must be here
  roles: z.array(z.string()).default([]), // 👈 must be here
  isContributor:z.boolean(),
  nextSteps: z.array(z.string()).default([]),
})

export const CreateProjectSchema = ProjectSchema.pick({
    title: true,
    description: true,
    imageUrl: true,
    isFeatured:true,
    liveUrl: true,
    githubUrl: true,
    progress: true,
    technologies:true,
    roles:true,
    nextSteps:true,
    isContributor:true
})
export type ProjectRequest = z.infer<typeof CreateProjectSchema>

export const UpdateProjectSchema = CreateProjectSchema.extend({
    slug: z.string().nonempty()
})
export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>
export type Project = InferSelectModel<typeof project>
