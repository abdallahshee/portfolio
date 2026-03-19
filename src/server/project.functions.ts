
import { db } from "../db/index";
import { and, avg, count, desc, eq, sql, inArray, ilike, or } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { AdminMiddleware, OptionalAuthMiddleware } from "./middleware";
import { project, projectRating, ProjectSchema, updateProjectSchema } from "@/db/schema";

export const getAllProjects = createServerFn({ method: "GET" })
  .inputValidator((data: { page: number; pageSize: number }) => data)
  .handler(async ({ data }) => {
    try {
      const { page, pageSize } = data
      const offset = (page - 1) * pageSize

      const [projectRows, totalResult] = await Promise.all([
        db.select().from(project).limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(project),
      ])

      // Fetch ratings for all projects in the current page in one query
      const projectIds = projectRows.map((p) => p.id)

      const ratingsResult = projectIds.length
        ? await db
          .select({
            projectId: projectRating.projectId,
            averageRating: avg(projectRating.rating),
            totalRatings: count(projectRating.id),
          })
          .from(projectRating)
          .where(inArray(projectRating.projectId, projectIds))
          .groupBy(projectRating.projectId)
        : []

      // Map ratings by projectId for O(1) lookup
      const ratingsMap = new Map(
        ratingsResult.map((r) => [
          r.projectId,
          {
            averageRating: r.averageRating
              ? Number(Number(r.averageRating).toFixed(1))
              : 0,
            totalRatings: r.totalRatings ?? 0,
          },
        ])
      )

      const projects = projectRows.map((p) => ({
        ...p,
        averageRating: ratingsMap.get(p.id)?.averageRating ?? 0,
        totalRatings: ratingsMap.get(p.id)?.totalRatings ?? 0,
      }))

      const total = Number(totalResult[0].count)

      return {
        projects,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    } catch (err) {
      console.error("Error fetching projects:", err)
      return { projects: [], total: 0, page: 1, pageSize: 6, totalPages: 0 }
    }
  })

export const createProject = createServerFn({ method: 'POST' })
  .middleware([AdminMiddleware])
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
  .middleware([OptionalAuthMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const userId = context.user?.id

      const [projectResult, ratingResult, userRatingResult] = await Promise.all([
        db.select().from(project).where(eq(project.id, data.projectId)),

        db
          .select({
            averageRating: avg(projectRating.rating),
            totalRatings: count(projectRating.id),
          })
          .from(projectRating)
          .where(eq(projectRating.projectId, data.projectId)),

        userId
          ? db
            .select({
              rating: projectRating.rating,
            })
            .from(projectRating)
            .where(
              and(
                eq(projectRating.projectId, data.projectId),
                eq(projectRating.userId, userId)
              )
            )
          : Promise.resolve([]),
      ])

      const theProject = projectResult[0]
      const rating = ratingResult[0]
      const userRating = userRatingResult[0]

      if (!theProject) return null

      return {
        ...theProject,
        averageRating: rating?.averageRating
          ? Number(Number(rating.averageRating).toFixed(1))
          : 0,
        totalRatings: rating?.totalRatings ?? 0,
        userRating: userRating?.rating ?? null,
      }
    } catch (err) {
      console.error(err)
      return null
    }
  })



export const updateProject = createServerFn({ method: "POST" })
  .middleware([AdminMiddleware])
  .inputValidator(updateProjectSchema)
  .handler(async ({ data }) => {
    try {
      await db
        .update(project)
        .set({ ...data.projectShema })
        .where(eq(project.id, data.projectId))

      // Fetch and return the updated project in the same shape as getProjectById
      const [projectResult, ratingResult] = await Promise.all([
        db.select().from(project).where(eq(project.id, data.projectId)),
        db
          .select({
            averageRating: avg(projectRating.rating),
            totalRatings: count(projectRating.id),
          })
          .from(projectRating)
          .where(eq(projectRating.projectId, data.projectId)),
      ])

      const theProject = projectResult[0]
      const rating = ratingResult[0]

      if (!theProject) return null

      return {
        ...theProject,
        averageRating: rating?.averageRating
          ? Number(Number(rating.averageRating).toFixed(1))
          : 0,
        totalRatings: rating?.totalRatings ?? 0,
        userRating: null, // admin context has no user rating
      }
    } catch (err) {
      console.error(err)
      return null
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
          isPublic: project.isPublic,
          url: project.url,
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


// server/project.functions.ts
export const searchProjects = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string; page: number; pageSize: number }) => data)
  .handler(async ({ data }) => {
    try {
      const { query, page, pageSize } = data
      const offset = (page - 1) * pageSize
      const search = `%${query}%`

      const whereClause = query.trim()
        ? or(
          ilike(project.title, search),
          ilike(project.description, search),
          sql`${project.technologies}::text ilike ${search}`
        )
        : undefined

      const [projectRows, totalResult] = await Promise.all([
        db.select().from(project).where(whereClause).limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(project).where(whereClause),
      ])

      const projectIds = projectRows.map((p) => p.id)

      const ratingsResult = projectIds.length
        ? await db
          .select({
            projectId: projectRating.projectId,
            averageRating: avg(projectRating.rating),
            totalRatings: count(projectRating.id),
          })
          .from(projectRating)
          .where(inArray(projectRating.projectId, projectIds))
          .groupBy(projectRating.projectId)
        : []

      const ratingsMap = new Map(
        ratingsResult.map((r) => [
          r.projectId,
          {
            averageRating: r.averageRating
              ? Number(Number(r.averageRating).toFixed(1))
              : 0,
            totalRatings: r.totalRatings ?? 0,
          },
        ])
      )

      const projects = projectRows.map((p) => ({
        ...p,
        averageRating: ratingsMap.get(p.id)?.averageRating ?? 0,
        totalRatings: ratingsMap.get(p.id)?.totalRatings ?? 0,
      }))

      const total = Number(totalResult[0].count)

      return {
        projects,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    } catch (err) {
      console.error("Error searching projects:", err)
      return { projects: [], total: 0, page: 1, pageSize: 6, totalPages: 0 }
    }
  })