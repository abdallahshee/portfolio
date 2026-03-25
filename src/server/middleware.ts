import { auth } from "@/lib/auth"
import { createMiddleware } from "@tanstack/react-start"
import { db } from "../db/index"
import { eq } from "drizzle-orm"
import { redirect } from "@tanstack/react-router"
import { article } from "@/db/schema/article.schema"

export const AuthMiddleware = createMiddleware()
    .server(async ({ request, next }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        const user = session?.user ?? null
        const role = session?.user?.role ?? null

        if (!user) {
            const redirectTo = new URL(request.url).pathname
            throw redirect({
                to: "/account",
                search: { callbackUrl: redirectTo },
            })
        }

        return next({
            context: {
                user,
                session,
                role,
            },
        })
    })


export const UserEditArticleMiddleware = createMiddleware()
    .middleware([AuthMiddleware])
    .server(async ({ request, context, next }) => {
        const user = context.user
        const url = new URL(request.url)
        // const slug = url.searchParams.get('slug')
         const slug = url.pathname.split("/").filter(Boolean)[1]
        const redirectTo = encodeURIComponent(url.pathname + url.search)

        if (!user || !slug ) {
            return Response.redirect(
                new URL(`/account?redirect=${redirectTo}`, request.url),
                302
            )
        }

        const foundBlog = (
            await db
                .select({ userId: article.userId })
                .from(article)
                .where(eq(article.slug, slug))
                .limit(1)
        )[0]

        if (!foundBlog) {
            return new Response("Blog not found", { status: 404 })
        }

        if (foundBlog.userId !== user.id) {
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

