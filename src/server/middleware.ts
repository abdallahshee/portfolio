import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const AuthenticatedMiddleware = createMiddleware()
  .server(async ({ next, request }) => {
    const supabase = getSupabaseServerClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      const url = new URL(request.url)
      // include search params in callbackUrl too
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
        role: user.user.user_metadata.role,
      },
    })
  })

