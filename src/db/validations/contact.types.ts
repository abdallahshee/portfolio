import { createSelectSchema } from "drizzle-zod";
import { user } from "../schema";
import z from "zod"

export const SendEmailWitHtmlSchema = createSelectSchema(user, {
  email: z.string().regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Must be a valid email address"
  ),
  name: z.string().nonempty("Username is required"),
}).pick({ email: true, name: true })
  .extend({
    subject: z.string()
      .min(3, "Please insert a subject matter")
      .max(25, "Subject should not exceed 25 characters"),
    message: z.string()
      .min(25, "Message out of range 25-500 characters")
      .max(500, "Message out of range 25-500 characters"),
    html: z.string().nonempty("HTML body is required"), // ← required
  })

export const EmailTemplateSchema=SendEmailWitHtmlSchema.omit({html:true})

export type SendEmailRequest=z.infer<typeof SendEmailWitHtmlSchema>

export type EmailTemplateRequest=z.infer<typeof EmailTemplateSchema>

