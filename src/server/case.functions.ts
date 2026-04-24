import { createServerFn } from "@tanstack/react-start";
import { CaseSchema } from "@/db/validations/case.types";
import { db, project } from "@/db";
import { caseStudy } from "@/db/schema/case.schema";
import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { AuthenticatedMiddleware } from "./middleware";
import { slugify } from "./project.functions";


export const createCase = createServerFn({ method: "POST" })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(CaseSchema)
  .handler(async ({ data }) => {
    const theproject = await db.query.project.findFirst({
      where: eq(project.slug, data.slug), // ✅ use project.id, not caseStudy.projectId
    });

    if (!theproject) return null;
    const slug = slugify(theproject.title!);
    const [theCaseStudy] = await db
      .insert(caseStudy)
      .values({ ...data, slug,title:theproject.title })
      .returning();

    return theCaseStudy;
  });


// export const getCaseStudyByProjectId = createServerFn({ method: "GET" })
//   .inputValidator((data: { projectId: string }) => data)
//   .handler(async ({ data }) => {
//     try {
//       const result = await db.query.caseStudy.findFirst({ where: eq(caseStudy.projectId, data.projectId) })
//       return result ?? null
//     } catch (err) {
//       console.error("Failed to fetch case study:", err)
//       throw err
//     }
//   })

// export const getCaseStudyById = createServerFn({ method: "GET" })
//   .inputValidator((data: { caseId: string }) => data)
//   .handler(async ({ data }) => {
//     try {
//       const result = await db.query.caseStudy.findFirst({ where: eq(caseStudy.id, data.caseId) })
//       return result ?? null
//     } catch (err) {
//       console.error("Failed to fetch case study:", err)
//       throw err
//     }
//   })


  export const getCaseBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await db.query.caseStudy.findFirst({ where: eq(caseStudy.slug, data.slug) })
      return result ?? null
    } catch (err) {
      console.error("Failed to fetch case study:", err)
      throw err
    }
  })

// server/case.functions.ts
export const getPaginatedCases = createServerFn({ method: "GET" })
  .inputValidator((data: { page: number; pageSize: number; query?: string }) => data)
  .handler(async ({ data: { page, pageSize, query } }) => {
    try {
      const offset = (page - 1) * pageSize
      const search = `%${query ?? ''}%`

      const whereClause = query?.trim()
        ? or(
          ilike(caseStudy.title, search),
          ilike(caseStudy.slug, search),
        )
        : undefined

      const [rows, totalResult] = await Promise.all([
        db
          .select({
            id: caseStudy.id,
            title: caseStudy.title,
            slug:caseStudy.slug,
            overview: caseStudy.overview,
            problem:caseStudy.problem,
            solution:caseStudy.solution,
            implementation:caseStudy.implementation,
            technologies: caseStudy.technologies,
            startDate: caseStudy.startDate,
            endDate: caseStudy.endDate,
            createdAt: caseStudy.createdAt,
          })
          .from(caseStudy)
          .where(whereClause)
          .orderBy(desc(caseStudy.createdAt))
          .limit(pageSize)
          .offset(offset),

        db
          .select({ count: sql<number>`count(*)` })
          .from(caseStudy)
          .where(whereClause),
      ])

      const total = Number(totalResult[0].count)

      return {
        cases: rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page < Math.ceil(total / pageSize),
        hasPrevPage: page > 1,
      }
    } catch (err) {
      console.error("Error fetching paginated case studies:", err)
      return {
        cases: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    }
  })

export const updateCase = createServerFn({ method: "POST" })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(CaseSchema)
  .handler(async ({ data }) => {
    try {
      const [updated] = await db
        .update(caseStudy)
        .set({
          problem: data.problem,
          solution: data.solution,
          implementation: data.implementation,
          outcomes: data.outcomes,
          technologies: data.technologies,
          startDate: data.startDate,
          endDate: data.endDate,
        })
        .where(eq(caseStudy.slug, data.slug))
        .returning()

      if (!updated) return { success: false, data: null }

      return { success: true, data: updated }
    } catch (err) {
      console.error("Error updating case study:", err)
      throw err
    }
  })