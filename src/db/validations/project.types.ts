
import { project } from "../schema"
import z from "zod"
import { createSelectSchema } from "drizzle-zod"



export const ProjectSchema = createSelectSchema(project,{
    title: z.string().min(5, "Title out of range 3-40 characters").max(40, "Title out of range 3-40 characters"),
    description: z.string().min(100, "Description out of range 100-160 characters")
        .max(160, "Description out of range 00-160 characters"),
    imageUrl: z.string(),
    url: z.string().nonempty(),
    isPublic:z.boolean().default(false)
}).pick({
    title:true,description:true,imageUrl:true,url:true,isPublic:true
})

export type ProjectRequest =z.infer<typeof ProjectSchema>

export const UpdateProjectSchema = ProjectSchema.extend({
    projectId: z.string().nonempty()
})
export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>
