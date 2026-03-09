import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { project, ProjectRequestSchema, type NewProject, type Project } from "@/db/project-schema";
import {nanoid} from "nanoid"


export const getAllProjects = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const projects: Project[] = await db.select().from(project);
            return projects;
        } catch (err) {
            console.error("Error fetching projects:", err);
            // Return an empty array or throw a meaningful error
            return [];

        }
    });

// export const createProject=createServerFn({method:"POST"})
// .inputValidator(NewProjectSchema)
// .handler(async({data})=>{
//     await db.insert(project).values(data)
// })

export const createProject = createServerFn({ method: 'POST' })
  .inputValidator(ProjectRequestSchema) // validates incoming data using Zod
  .handler(async ({ data }) => {
    try {
        const newproject:NewProject={
          id:nanoid(8),
            ...data
        }
      // Insert the project into the database
      await db.insert(project).values(newproject);

      return { success: true, message: 'Project created successfully' };
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, message: 'Failed to create project' };
    }
  });