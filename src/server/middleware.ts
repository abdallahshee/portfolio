import { createMiddleware } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const AuthenticatedMiddleware = createMiddleware()
    .server(async ({ next, request }) => {
        const supabase = getSupabaseServerClient()
        const { data: user, error } = await supabase.auth.getUser()
        const role = user.user?.user_metadata.role
        if (!user.user) {
            const redirectTo = new URL(request.url).pathname
            throw redirect({
                to: "/account",
                search: { callbackUrl: redirectTo },
                 statusCode: 401,
            })
        }
        return next({
            context: {
                userId: user?.user?.id,
                role: role,

            },
        })
    })

export const AdminMiddleware = createMiddleware()
    .middleware([AuthenticatedMiddleware])
    .server(async ({ context, request, next }) => {
        const isAdmin = context.role === "admin"
        const url = new URL(request.url)
        const redirectTo = encodeURIComponent(url.pathname + url.search)
        if (!isAdmin) {
            throw redirect({
                to: "/unauthorized",
                search: { redirectTo },
                statusCode: 403,
            })
        }
        return next({
            context: {
                ...context
            }
        })
    })

export const OptionalAuthMiddleware = createMiddleware().server(
    async ({ next }) => {
        const supabase = getSupabaseServerClient()
        const { data: user, error } = await supabase.auth.getUser()
        return next({
            context: {
                userId: user.user?.id
            }
        })
    }
)


