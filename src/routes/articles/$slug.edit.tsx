import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { getArticleBySlugForUpdateQueryOptions } from "@/db/queries/article.queries"
import { useArticleUpdateMutationOption } from "@/db/mutations/article.mutations"
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
  const article = Route.useLoaderData()
  const { slug } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const updateMutation = useArticleUpdateMutationOption({ role: "user" })

  return (
    <ArticleEditor
      mode="edit"
      initialValues={{
        title: article?.title!,
        content: article?.content!,
        tags: article?.tags!,
        coverImage: article?.coverImage!,
        categoryId: article?.id!,
        slug, // ← passed so onSubmit can send it to the server fn
      }}
      loading={loading}
      onSubmit={async (values: ArticleRequest, imageUrl: string) => {
        try {
          setLoading(true)
          await updateMutation.mutateAsync({
            ...values,
            coverImage: imageUrl || values.coverImage, // prefer freshly uploaded url
            slug, // ← required by ArticleUpdateSchema
          })
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