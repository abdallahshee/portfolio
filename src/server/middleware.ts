import { auth } from "@/lib/auth"
import { createMiddleware } from "@tanstack/react-start"
import { db } from "../db/index"
import { eq } from "drizzle-orm"
import { blog } from "@/db/blog.schema"


export const AuthMiddleware = createMiddleware()
    .server(async ({ request, next }) => {
        // Get the session from headers

        const session = await auth.api.getSession({
            headers: request.headers,
        })

        const user = session?.user ?? null
        const role = session?.user.role ?? null
        // Stop the request if user is not logged in
        if (!user) {
            const redirectTo = encodeURIComponent(new URL(request.url).pathname)
            return Response.redirect(new URL(`/account?redirect=${redirectTo}`, request.url), 302)
        }
        // Proceed with the request, attaching user to context
        return next({
            context: {
                user,
                session,
                role
            },
        })
    })

export const EditBlogMiddleware = createMiddleware()
    .middleware([AuthMiddleware])
    .server(async ({ request, context, next }) => {
        const user = context.user
        const url = new URL(request.url)
        const slug = url.searchParams.get('slug')
        const isAdmin = user.role === "admin"
        const redirectTo = encodeURIComponent(url.pathname + url.search)

        if (!user || !slug || !isAdmin) {
            return Response.redirect(
                new URL(`/account?redirect=${redirectTo}`, request.url),
                302
            )
        }

        const foundBlog = (
            await db
                .select({ userId: blog.userId })
                .from(blog)
                .where(eq(blog.slug, slug))
                .limit(1)
        )[0]

        if (!foundBlog) {
            return new Response("Blog not found", { status: 404 })
        }

        if (foundBlog.userId !== user.id || !isAdmin) {
            return new Response("Forbidden", { status: 403 })
        }

        return next({
            context: {
                ...context,
            },
        })
    })


export const AdminMiddleware = createMiddleware()
    .middleware([AuthMiddleware])
    .server(async ({ context, request, next }) => {
        const isAdmin = context.role === "admin"
        const url = new URL(request.url)
        const redirectTo = encodeURIComponent(url.pathname + url.search)
        if (!isAdmin) {
            return Response.redirect(new URL(`/unauthorised?redirect=${redirectTo}`, request.url), 302)
        }
        return next({
            context: {
                ...context
            }
        })
    })

export const OptionalAuthMiddleware = createMiddleware().server(
    async ({ next, request }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        return next({
            context: {
                user: session?.user ?? null, // null if not logged in, no error thrown
            },
        })
    }
)