import { createServerFn } from "@tanstack/react-start";
import { AuthenticatedMiddleware } from "./middleware";
import { TestimonialSchema } from "@/db/validations/testimonial.types";
import { db } from "@/db";
import { testimonial } from "@/db/schema/testimonial.schema";

export const createTestimonial = createServerFn({ method: "POST" })
    .middleware([AuthenticatedMiddleware])
    .inputValidator(TestimonialSchema)
    .handler(async ({ data }) => {
        try {
            const [testiMonial] = await db.insert(testimonial).values({ ...data }).returning()
            return testiMonial
        } catch (err) {
            throw err
        }
    })

export const getTestimonials = createServerFn({ method: "GET" })
    .handler(async () => {
        try {
            const testimonials = await db.select().from(testimonial)
            return testimonials
        } catch (err) {
            throw err
        }
    })