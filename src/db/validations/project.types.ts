
import { project } from "../schema"
import z from "zod"
import { createSelectSchema } from "drizzle-zod"
import type { InferSelectModel } from "drizzle-orm"

const ProjectSchema = createSelectSchema(project, {
    progress: z.number(),
    title: z.string().min(5, "Title out of range 3-50 characters").max(50, "Title out of range 3-50 characters"),
    description: z.string().min(100, "Description out of range 100-500 characters")
        .max(500, "Description out of range 00-500 characters"),
    imageUrl: z.string(),
    url: z.string().nonempty(),
    isPublic: z.boolean().default(false),
    githubUrl: z.string(),
})

export const CreateProjectSchema = ProjectSchema.pick({
    title: true,
    description: true,
    imageUrl: true,
    url: true,
    isPublic: true,
    githubUrl: true,
    progress: true
})
export type ProjectRequest = z.infer<typeof CreateProjectSchema>

export const UpdateProjectSchema = CreateProjectSchema.extend({
    slug: z.string().nonempty()
})
export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>
export type Project = InferSelectModel<typeof project>
