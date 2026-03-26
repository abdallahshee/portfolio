import type { EmailTemplateRequest } from "@/db/validations/contact.types";

export const ContactMeEmailTemplate = (data: EmailTemplateRequest): string => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #4f46e5; margin-bottom: 16px;">New Contact Message</h2>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; width: 80px;">From</td>
        <td style="padding: 8px 0; font-weight: 600;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Email</td>
        <td style="padding: 8px 0;">${data.email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Subject</td>
        <td style="padding: 8px 0;">${data.subject}</td>
      </tr>
    </table>

    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #64748b; margin: 0 0 8px;">Message</p>
      <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
    </div>

    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
      Sent from your portfolio contact form
    </p>
  </div>
`