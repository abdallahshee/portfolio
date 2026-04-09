import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getArticleBySlugQueryOptions } from '@/db/queries/article.queries'
import ArticleDetails from '@/components/ArticleDetails'
import { OptionalAuthMiddleware } from '@/server/middleware/auth.middleware'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export const Route = createFileRoute('/articles/$slug')({
  server: { middleware: [OptionalAuthMiddleware] },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getArticleBySlugQueryOptions(params.slug)
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const { data } = useSuspenseQuery(getArticleBySlugQueryOptions(slug))
  const supabase = getSupabaseBrowserClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true) // ✅ true until session resolves

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData }: { data: { session: Session | null } }) => {
      setSession(sessionData?.session ?? null)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setIsLoading(false)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return <ArticleDetails slug={slug} data={data} isAdmin={false} />
}