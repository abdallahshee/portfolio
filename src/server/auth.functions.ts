import { createServerFn } from "@tanstack/react-start";
import { SendEmailWitHtmlSchema, type SendEmailRequest } from "@/db/validations/contact.types"
import { Resend } from "resend";
import { UserMiddleware } from "./middleware/auth.middleware";
import { getServerSession } from "@/lib/supabase/server";


export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
 const session=await getServerSession()
  if (!session) {
    return null
  }
  return session
})



const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendEmail = async (data: SendEmailRequest) => {
  const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.CONTACT_RECEIVER_EMAIL!,
    replyTo: data.email,
    subject: `[Portfolio Contact] ${data.subject}`,
    html: data.html,
  })

  console.log("Resend result:", result) // ← log the result to see if it succeeded
  return result
}
// src/server/contact.functions.ts
export const sendEmailFn = createServerFn({ method: "POST" })
  .middleware([UserMiddleware])
  .inputValidator(SendEmailWitHtmlSchema)
  .handler(async ({ data }) => {
    try {
      await sendEmail(data)
      return { success: true }
    } catch (err) {
      console.error("Resend error:", err)
      throw new Error("Failed to send message. Please try again.")
    }
  })
