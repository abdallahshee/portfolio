import { db } from "../db/index";
import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { project } from "@/db/schema";
import { CreateProjectSchema, UpdateProjectSchema } from "@/db/validations/project.types";
import { AuthenticatedMiddleware } from "./middleware";
import slugify from "slugify"

export const createProject = createServerFn({ method: 'POST' })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(CreateProjectSchema)
  .handler(async ({ data }) => {
    try {
    
      console.log('SERVER FUNCTION HIT ',)
      const slug = slugify(data.title,{lower:true,strict:true})
      const [theSlug] = await db
        .insert(project)
        .values({ ...data, slug })
        .returning({ slug: project.slug });

      return { success: true, slug: theSlug };
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, projectId: null };
    }
  });


export const getProjectBySlugName = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    try {
      const [theProject] = await db
        .select({
          id: project.id,
          title: project.title,
          slug: project.slug,
          githubUrl:project.githubUrl,
          description: project.description,
          imageUrl: project.imageUrl,
          liveUrl: project.liveUrl,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })
        .from(project)
        .where(eq(project.slug, data.slug));

      if (!theProject) return null;

      return theProject;
    } catch (err) {
      console.error(err);
      return null;
    }
  });


export const getProjectById = createServerFn({ method: "GET" })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const [theProject] = await db
        .select({
          id: project.id,
          title: project.title,
          slug: project.slug,
          description: project.description,
          imageUrl: project.imageUrl,
          // url: project.url,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })
        .from(project)
        .where(eq(project.id, data.projectId));

      if (!theProject) return null;

      return theProject;
    } catch (err) {
      console.error(err);
      return null;
    }
  });

export const getPaginatedProjects = createServerFn({ method: "GET" })
  .inputValidator((data: { page: number; pageSize: number }) => data)
  .handler(async ({ data }) => {
    const { page, pageSize } = data  // ← move destructure outside try/catch

    try {
      const offset = (page - 1) * pageSize

      const [projectRows, totalResult] = await Promise.all([
        db
          .select({
            id: project.id,
            githubUrl:project.githubUrl,
            title: project.title,
            progress:project.progress,
            slug: project.slug,
            description: project.description,
            imageUrl: project.imageUrl,
            liveUrl: project.liveUrl,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          })
          .from(project)
          .orderBy(desc(project.createdAt))
          .limit(pageSize)
          .offset(offset),

        db
          .select({ count: sql<number>`count(*)` })
          .from(project),
      ])

      const total = Number(totalResult[0].count)

      return {
        projects: projectRows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPrevPage: page > 1,
      }
    } catch (err) {
      console.error("Error fetching paginated projects:", err)
      return {
        projects: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    }
  })
export const updateProject = createServerFn({ method: "POST" })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(UpdateProjectSchema)
  .handler(async ({ data }) => {
    try {
      const [updatedProject] = await db
        .update(project)
        .set({ ...data })
        .where(eq(project.id, data.slug))
        .returning();

      if (!updatedProject) return null;

      return updatedProject;
    } catch (err) {
      console.error(err);
      return null;
    }
  });


export const getTopProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const topProjects = await db
        .select({
          id: project.id,
          slug: project.slug,
          title: project.title,
          imageUrl: project.imageUrl,
          createdAt: project.createdAt
        })
        .from(project)
        .limit(5);

      return topProjects;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });


export const searchProjects = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string; page: number; pageSize: number }) => data)
  .handler(async ({ data: { query, page, pageSize } }) => {
    try {
      const offset = (page - 1) * pageSize
      const search = `%${query}%`

      const whereClause = query.trim()
        ? or(
          ilike(project.title, search),
          ilike(project.description, search),
        )
        : undefined

      const [projectRows, totalResult] = await Promise.all([
        db
          .select({
            id: project.id,
            progress:project.progress,
            githubUrl:project.githubUrl,
            title: project.title,
            slug: project.slug,
            description: project.description,
            imageUrl: project.imageUrl,
            liveUrl: project.liveUrl,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          })
          .from(project)
          .where(whereClause)
          .orderBy(desc(project.createdAt))
          .limit(pageSize)
          .offset(offset),

        db
          .select({ count: sql<number>`count(*)` })
          .from(project)
          .where(whereClause),
      ])

      const total = Number(totalResult[0].count)

      return {
        projects: projectRows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPrevPage: page > 1,
      }
    } catch (err) {
      console.error("Error searching projects:", err)
      throw err
    }
  })