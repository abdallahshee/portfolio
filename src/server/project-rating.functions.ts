import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db/index"
import { projectRating } from "@/db/schema"
import { AuthenticatedMiddleware } from "./middleware/auth.middleware"


const RateProjectSchema = z.object({
  projectId: z.string(),
  rating: z.number().int().min(1).max(10),
  userId:z.string()
})

export const rateProject = createServerFn({ method: "POST" })
  .inputValidator(RateProjectSchema)
  .middleware([AuthenticatedMiddleware])
  .handler(async ({ data }) => {
 
const userId=data.userId
    // Block if already rated
    const existing = await db.query.projectRating.findFirst({
      where: and(
        eq(projectRating.projectId, data.projectId),
        eq(projectRating.userId, userId)
      ),
    })

    if (existing) {
      throw new Error("You have already rated this project")
    }

    const inserted = await db
      .insert(projectRating)
      .values({
        projectId: data.projectId,
        userId,
        rating: data.rating,
      })
      .returning()

    return {
      message: "Rating added successfully",
      rating: inserted[0],
    }
  })