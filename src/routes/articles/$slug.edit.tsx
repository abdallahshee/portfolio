import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { getArticleBySlugForUpdateQueryOptions } from "@/db/queries/article.queries"
import { articleUpdateMutationOption } from "@/db/mutations/article.mutations"
import TurndownService from "turndown"
import { useRef } from "react"
import ArticleEditor from "@/components/ArticleEditor"
import { UserEditArticleMiddleware } from "@/server/middleware"
import type { ArticleRequest } from "@/db/validations/article.types"


export const Route = createFileRoute("/articles/$slug/edit")({
  server: { middleware: [UserEditArticleMiddleware] },
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(
      getArticleBySlugForUpdateQueryOptions(params.slug)
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const blog = Route.useLoaderData()
  const { slug } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const turndownService = useRef(new TurndownService())
  const updateMutation = articleUpdateMutationOption({role:"user"})

  return (
    <ArticleEditor
      mode="edit"
      initialValues={{
        title: blog?.title ?? "",
        content: blog?.content ?? "",
        tags: blog?.tags ?? [],
      }}
      existingCoverImage={blog?.coverImage}
      loading={loading}
      onSubmit={async (values:ArticleRequest, imageUrl) => {
        try {
          setLoading(true)
          const markdownContent = turndownService.current.turndown(values.content)
          await updateMutation.mutateAsync({ })
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }}
      onCancel={() => router.history.back()}
    />
  )
}