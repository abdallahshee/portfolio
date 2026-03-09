import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import { project, ProjectSchema, type ProjectRequest } from "@/db/project-schema";
import { nanoid } from "nanoid"
import { id } from "zod/v4/locales";
import { eq } from "drizzle-orm";


export const getAllProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const projects = await db.select().from(project);
      console.log(`Here are the projects ${JSON.stringify(projects, null, 2)}`)
      return projects;
    } catch (err) {
      console.error("Error fetching projects:", err);
      // Return an empty array or throw a meaningful error
      return [];

    }
  });

export const createProject = createServerFn({ method: 'POST' })
  .inputValidator(ProjectSchema) // validates incoming data using Zod
  .handler(async ({ data }) => {
    try {
      // Insert the project into the database
      await db.insert(project).values({...data});

      return { success: true, message: 'Project created successfully' };
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, message: 'Failed to create project' };
    }
  });

export const getProjectById = createServerFn()
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const theProject = await db.select().from(project).where(eq(project.id, data.projectId));
      return theProject[0]
    } catch (err) {
      console.log(err)
    }
  })