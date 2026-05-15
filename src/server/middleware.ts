import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { getSupabaseServerClient } from "@/lib/supabase/server";



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

// export const AuthenticatedMiddleware = createMiddleware()
// .server(async({request,next})=>{
//    // Debug 1 — check raw cookie header
//     const cookieHeader = request.headers.get("cookie")
//     console.log("RAW COOKIE HEADER:", cookieHeader)

//     // Debug 2 — check getCookies
//     const cookies = getCookies()
//     console.log("GET COOKIES:", Object.keys(cookies))

//     const supabase = getSupabaseServerClient()
//     const { data: { user }, error } = await supabase.auth.getUser()
//     console.log("USER:", user)
//     console.log("ERROR:", error)
//     return next({})
// })

