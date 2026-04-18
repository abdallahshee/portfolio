import { createSelectSchema } from "drizzle-zod";
import { testimonial } from "../schema/testimonial.schema";
import z from "zod"
import type { InferSelectModel } from "drizzle-orm";

export const TestimonialSchema = createSelectSchema(testimonial, {
    quote: z.string()
        .min(100, "Quote must be at least 100 characters")
        .max(200, "Quote must not exceed 200 characters"),
    authorFirstname: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(8, "First name must not exceed 8 characters"),
    authorLastname: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(8, "Last name must not exceed 8 characters"),
    authorTitle: z.string()
        .min(2, "Title must be at least 2 characters")
        .max(12, "Title must not exceed 12 characters"),
    company: z.string()
        .min(2, "Company must be at least 2 characters")
        .max(18, "Company must not exceed 18 characters"),
}).pick({ quote: true, authorFirstname: true, authorLastname: true, authorTitle: true, company: true })
export type Testimonial = InferSelectModel<typeof testimonial>
export type TestimonialRequest = z.infer<typeof TestimonialSchema>