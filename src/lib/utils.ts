import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Resend } from "resend"
import type { SendEmailRequest } from '@/db/validations/contact.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// src/lib/utils.ts
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Image upload failed')

  const data = await res.json()
  return data.url // the URL of the uploaded image
}

// src/lib/auth-errors.ts
 const BETTER_AUTH_ERRORS: Record<string, string> = {
  // credentials
  INVALID_EMAIL_OR_PASSWORD: "The email or password you entered is incorrect.",
  INVALID_PASSWORD: "The password you entered is incorrect.",
  INVALID_EMAIL: "Please enter a valid email address.",

  // account status
  USER_NOT_FOUND: "No account found with this email address.",
  USER_BANNED: "Your account has been suspended. Please contact support.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",

  // session
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",

  // rate limiting
  TOO_MANY_REQUESTS: "Too many attempts. Please try again later.",

  // origin
  INVALID_ORIGIN: "Request origin not allowed. Please refresh the page.",
}

export const getAuthError = (
  code?: string,
  fallbackMessage?: string
): string => {
  return (
    BETTER_AUTH_ERRORS[code ?? ""] ??
    fallbackMessage ??
    "Something went wrong. Please try again."
  )
}


const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (data: SendEmailRequest) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.CONTACT_RECEIVER_EMAIL!,
    replyTo: data.email,
    subject: `[Portfolio Contact] ${data.subject}`,
    html: data.html, // ← from the schema
  })
}