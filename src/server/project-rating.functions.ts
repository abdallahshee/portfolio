import { createServerFn } from "@tanstack/react-start"
import { and, avg, count, eq } from "drizzle-orm"
import { z } from "zod"
import { AuthMiddleware } from "@/server/middleware"
import { db } from "../db/index"
import { projectRating } from "@/db/schema"


const RateProjectSchema = z.object({
  projectId: z.string(),
  rating: z.number().int().min(1).max(10),
})

// export const rateProject = createServerFn({ method: "POST" })
//   .inputValidator(RateProjectSchema)
//   .middleware([AuthMiddleware])
//   .handler(async ({ data, context }) => {
//     const userId = context.user?.id

//     if (!userId) {
//       throw new Error("Unauthorized")
//     }

//     const existingRows = await db
//       .select()
//       .from(projectRating)
//       .where(
//         and(
//           eq(projectRating.projectId, data.projectId),
//           eq(projectRating.userId, userId)
//         )
//       )

//     const existing = existingRows[0]

//     if (existing) {
//       const updated = await db
//         .update(projectRating)
//         .set({
//           rating: data.rating,
//         })
//         .where(eq(projectRating.id, existing.id))
//         .returning()

//       return {
//         message: "Rating updated successfully",
//         rating: updated[0],
//       }
//     }

//     const inserted = await db
//       .insert(projectRating)
//       .values({
//         projectId: data.projectId,
//         userId,
//         rating: data.rating,
//       })
//       .returning()

//     return {
//       message: "Rating added successfully",
//       rating: inserted[0],
//     }
//   })



export const rateProject = createServerFn({ method: "POST" })
  .inputValidator(RateProjectSchema)
  .middleware([AuthMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.user!.id

    const existing = await db.query.projectRating.findFirst({
      where: and(
        eq(projectRating.projectId, data.projectId),
        eq(projectRating.userId, userId)
      ),
    })

    if (existing) {
      const updated = await db
        .update(projectRating)
        .set({ rating: data.rating, updatedAt: new Date() })
        .where(eq(projectRating.id, existing.id))
        .returning()

      return {
        message: "Rating updated successfully",
        rating: updated[0],
      }
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