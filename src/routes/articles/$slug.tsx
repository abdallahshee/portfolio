import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getBlogBySlugQueryOptions } from '@/db/queries/blog.queries'
import { getSessionQueryOptions } from '@/db/queries/utils.queries'
import { OptionalAuthMiddleware } from '@/server/middleware'
import ArticleDetails from '@/components/ArticleDetails'

export const Route = createFileRoute('/articles/$slug')({
  server: { middleware: [OptionalAuthMiddleware] },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getBlogBySlugQueryOptions(params.slug)
    )
    return context.queryClient.fetchQuery(getSessionQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const { data } = useSuspenseQuery(getBlogBySlugQueryOptions(slug))
  const userData = Route.useLoaderData()?.user

  return <ArticleDetails slug={slug} data={data} userData={userData} />
}