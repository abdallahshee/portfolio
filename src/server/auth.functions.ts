import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { queryOptions } from "@tanstack/react-query";
import { SendEmailWitHtmlSchema, type SendEmailRequest } from "@/db/validations/contact.types"
import { AuthMiddleware } from "./middleware";
import { Resend } from "resend";


export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session;
});


export const ensureSession = createServerFn({ method: "GET" })

  .handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) {
      throw new Error("Unauthorized");
    }
    return session;
  });

export const getSessionQueryOption = () => queryOptions({
  queryKey: ["theSession"],
  queryFn: () => getSession()
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
  .middleware([AuthMiddleware])
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
