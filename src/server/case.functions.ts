import { createServerFn } from "@tanstack/react-start";
import { CaseSchema } from "@/db/validations/case.types";
import { db } from "@/db";
import { caseStudy } from "@/db/schema/project-case.schema";
import { eq } from "drizzle-orm";
import { AuthenticatedMiddleware } from "./middleware";


export const createProjectCase = createServerFn({ method: "POST" })
    .middleware([AuthenticatedMiddleware])
    .inputValidator(CaseSchema)
    .handler(async ({ data }) => {
        try {
            const [theCaseStudy] = await db.insert(caseStudy).values(data).returning()
            return theCaseStudy
        } catch (err) {
            throw err
        }
    })


export const getCaseStudyByProjectId = createServerFn({ method: "GET" })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await db.query.caseStudy.findFirst({where:eq(caseStudy.projectId,data.projectId)}) 
       return result ?? null    
    } catch (err) {
      console.error("Failed to fetch case study:", err)
      throw err
    }
  })