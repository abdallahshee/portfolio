import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createServerFn } from "@tanstack/react-start";
import slugify from 'slugify'
import z from "zod"



export const AuthenticatedMiddleware = createMiddleware()
  .server(async ({ next, request }) => {
    const supabase = getSupabaseServerClient()
    const { data: user } = await supabase.auth.getUser()

    console.log("USER ", JSON.stringify(user?.user))
    if (!user?.user) {
      const url = new URL(request.url)
      const redirectTo = url.pathname + url.search

      throw redirect({
        to: "/account",
        search: { callbackUrl: redirectTo },
        statusCode: 401,
      })
    }

    return next({
      context: {
        userId: user.user.id,
        role: user.user.user_metadata?.role,
        firstname: user.user.user_metadata?.firstname,
      },
    })
  })



export const uploadProjectImage = createServerFn({ method: 'POST' })
  .middleware([AuthenticatedMiddleware])
  .inputValidator(z.object({
    base64: z.string(),
    title: z.string(),
    mimeType: z.string(),
  }))
  .handler(async ({ data }) => {

    const supabase = getSupabaseServerClient()
    const slug = slugify(data.title, { lower: true, strict: true })
    const ext = data.mimeType.split('/')[1] ?? 'jpeg'
    const filePath = `${slug}/project.${ext}`

    const buffer = Buffer.from(data.base64.split(',')[1], 'base64')

    const { error } = await supabase.storage
      .from('project-images')
      .upload(filePath, buffer, {
        contentType: data.mimeType,
        upsert: true,
      })

    if (error) throw new Error(error.message)

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)
console.log('string url ',publicUrl)
    return publicUrl
  })
