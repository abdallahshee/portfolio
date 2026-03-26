import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { queryOptions } from "@tanstack/react-query";
import { SendEmailWitHtmlSchema } from "@/db/validations/contact.types"
import { sendEmail } from "./utils";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    return session;
});


export const ensureSession = createServerFn({ method: "GET" }).handler(async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
});

export const getSessionQueryOption=()=>queryOptions({
    queryKey:["theSession"],
    queryFn:()=>getSession()
})


// src/server/contact.functions.ts
export const sendEmailFn = createServerFn({ method: "POST" })
  .inputValidator(SendEmailWitHtmlSchema)
  .handler(async ({ data }) => {
    console.log("Below is the complete messsage "+JSON.stringify(data))
    try {
      await sendEmail({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        html:data.html
      })
      return { success: true }
    } catch (err) {
      console.error("Resend error:", err)
      throw new Error("Failed to send message. Please try again.")
    }
  })
