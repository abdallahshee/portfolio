import { auth } from "@/lib/auth"
import { createMiddleware } from "@tanstack/react-start"

export const authMiddleware = createMiddleware()
    .server(async ({ request, next }) => {
        // Get the session from headers
        const session = await auth.api.getSession({
            headers: request.headers,
        })

        const user = session?.user ?? null

        // Stop the request if user is not logged in
        if (!user) {
            return new Response('Unauthorized', { status: 401 })
        }

        // Proceed with the request, attaching user to context
        return next({
            context: {
                user,
                session,
            },
        })
    })