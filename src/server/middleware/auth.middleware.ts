import { createMiddleware } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { redirect } from "@tanstack/react-router"
import { article } from "@/db/schema/article.schema"
import {  getDbUser, getSupabaseUser } from "@/lib/supabase/utils"
import { db } from "@/db"


export const AuthenticatedMiddleware = createMiddleware()
    .server(async ({ next,request }) => {
        const supabaseUser = await getSupabaseUser()
        if (!supabaseUser) {
              const redirectTo = new URL(request.url).pathname
        throw redirect({
            to: "/account",
            search: { callbackUrl: redirectTo },
        })
        }
        return next({
            context: {
                superbaseUser: supabaseUser,
            },
        })
    })

    export const UserMiddleware = createMiddleware()
    .middleware([AuthenticatedMiddleware])
    .server(async ({ next,request,context }) => {
        const dbUserId=context?.superbaseUser.id
        const dbUser=await db.query.user.findFirst({where: (person, { eq }) => eq(person.id, dbUserId)})
        if (!dbUser) {
              const redirectTo = new URL(request.url).pathname
        throw redirect({
            to: "/account",
            search: { callbackUrl: redirectTo },
        })
        }

       const role=dbUser.role
        return next({
            context: {
                ...context,
                dbUser: dbUser,
                role,
            },
        })
    })


export const UserEditArticleMiddleware = createMiddleware()
    .middleware([UserMiddleware])
    .server(async ({ request, context, next }) => {
        const user = context.superbaseUser
        const url = new URL(request.url)
        const slug = url.pathname.split("/").filter(Boolean)[1]
        const redirectTo = encodeURIComponent(url.pathname + url.search)

        if (!user || !slug) {
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
    .middleware([UserMiddleware])
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
    async ({ next}) => {
        const dbUser = await getDbUser()

        return next({
            context: {
                dbUser
            }
        })
    }
)


