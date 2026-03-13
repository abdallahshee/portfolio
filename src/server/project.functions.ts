
import { db } from "../db/index";
import { project, ProjectSchema} from "@/db/project.schema";
import zod from "zod"
import { avg, desc, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { projectRating } from "@/db/project-rating.schema";
import { EditProjectMiddleware } from "./middleware";

export const getAllProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const projects = await db.select().from(project);
    
      return projects;
    } catch (err) {
      console.error("Error fetching projects:", err);
      // Return an empty array or throw a meaningful error
      return [];
    }
  });

export const createProject = createServerFn({ method: 'POST' })
.middleware([EditProjectMiddleware])
  .inputValidator(ProjectSchema) // validates incoming data using Zod
  .handler(async ({ data }) => {
    try {
      // Insert the project into the database
      await db.insert(project).values({ ...data });
      return { success: true, message: 'Project created successfully' };
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, message: 'Failed to create project' };
    }
  });

export const getProjectById = createServerFn({ method: "GET" })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const theProject = await db.select().from(project).where(eq(project.id, data.projectId));
      return theProject[0]
    } catch (err) {
      console.log(err)
    }
  })

export const updateProjectSchema = zod.object({
  projectId: zod.string().nonempty(),
  projectShema: ProjectSchema
})

export const updateProject = createServerFn({ method: "POST" })
.middleware([EditProjectMiddleware])
  .inputValidator(updateProjectSchema)
  .handler(async ({ data }) => {
    try {
      await db.update(project)
        .set({ ...data.projectShema })
        .where(eq(project.id, data.projectId));
    } catch (err) {
      console.log(err)
    }
  })



export const getTopProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const topProjects = await db
        .select({
          id: project.id,
          title: project.title,
          imageUrl: project.imageUrl,
          websiteUrl: project.websiteUrl,
          githubUrl: project.githubUrl,
          avgRating: avg(projectRating.rating), // calculate average rating
        })
        .from(project)
        .leftJoin(projectRating, eq(project.id, projectRating.projectId))
        .groupBy(project.id)
        .orderBy(desc(avg(projectRating.rating)))
        .limit(5); // top 5 projects

      return topProjects;
    } catch (err) {
      console.log(err);
      throw err;
    }
  });