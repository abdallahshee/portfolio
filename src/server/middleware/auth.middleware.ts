import { createMiddleware } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { redirect } from "@tanstack/react-router"
import { article } from "@/db/schema/article.schema"
import { db } from "@/db"
import { getSupabaseServerClient } from "@/lib/supabase/server"


export const AuthenticatedMiddleware = createMiddleware()
    .server(async ({ next,request }) => {
        const supabase = getSupabaseServerClient()
        const {data:user,error}=await supabase.auth.getUser()
        const role=user.user?.user_metadata.role
        if (!user) {
              const redirectTo = new URL(request.url).pathname
        throw redirect({
            to: "/account",
            search: { callbackUrl: redirectTo },
        })
        }
        return next({
            context: {
                userId:user?.user?.id,
                role:role
               
            },
        })
    })

    // export const UserMiddleware = createMiddleware()
    // .middleware([AuthenticatedMiddleware])
    // .server(async ({ next,request,context }) => {
    //     const dbUserId=context?.userId
    //     const dbUser=await db.query.user.findFirst({where: (person, { eq }) => eq(person.id, dbUserId)})
    //     if (!dbUser) {
    //           const redirectTo = new URL(request.url).pathname
    //     throw redirect({
    //         to: "/account",
    //         search: { callbackUrl: redirectTo },
    //     })
    //     }

    //    const role=dbUser.role
    //     return next({
    //         context: {
    //             ...context,
             
    //             role,
    //         },
    //     })
    // })


export const UserEditArticleMiddleware = createMiddleware()
    .middleware( [AuthenticatedMiddleware])
    .server(async ({ request, context, next }) => {
        const userId = context.userId
        const url = new URL(request.url)
        const slug = url.pathname.split("/").filter(Boolean)[1]
        const redirectTo = encodeURIComponent(url.pathname + url.search)

        if (!userId || !slug) {
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

        if (foundBlog.userId !== userId) {
            return new Response("Forbidden", { status: 403 })
        }

        return next({
            context: {
                ...context,
            },
        })
    })


export const AdminMiddleware = createMiddleware()
    .middleware([AuthenticatedMiddleware])
    .server(async ({ context, request, next }) => {
        const isAdmin = context.role==="admin"
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
       const supabase=getSupabaseServerClient()
       const {data:user,error}=await supabase.auth.getUser()

        return next({
            context: {
                userId:user.user?.id
            }
        })
    }
)


