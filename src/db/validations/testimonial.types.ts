import { createSelectSchema } from "drizzle-zod";
import { testimonial } from "../schema/testimonial.schema";
import z from "zod"

export const TestimonialSchema=createSelectSchema(testimonial,{
    quote:z.string().min(20,"content out of range 20-80")
    .max(80,"content out of range 20-80"),
    authorName:z.string().min(3,"content out of range 3-20")
    .max(20,"content out of range 3-20"),
    authorTitle:z.string().min(2,"content out of range 2-20")
    .max(20,"content out of range 2-20"),
    company:z.string().min(2,"content out of range 2-20")
    .max(20,"content out of range 2-20"),

}).pick({quote:true, authorName:true,authorTitle:true,company:true})

export type TestimonialRequest=z.infer<typeof TestimonialSchema>