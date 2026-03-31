import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { useArticleUpdateMutationOption } from "@/db/mutations/article.mutations"
import ArticleEditor from "@/components/ArticleEditor"
import type { ArticleRequest } from "@/db/validations/article.types"
import { UserEditArticleMiddleware } from "@/server/middleware/auth.middleware"
import { getArticleBySlugQueryOptions } from "@/db/queries/article.queries"

export const Route = createFileRoute("/articles/$userId/$slug/edit")({
  server: { middleware: [UserEditArticleMiddleware] },
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(
      getArticleBySlugQueryOptions(params.slug)
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const article = Route.useLoaderData()
  const { slug,userId } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const updateMutation = useArticleUpdateMutationOption({ role: "user" })

  return (
    <ArticleEditor
      mode="edit"
      initialValues={{
        title: article?.title!,
        content: article?.content!,
        userId:userId,
        tags: article?.tags!,
        coverImage: article?.coverImage!,
        categoryId: article?.id!,
        status:article?.status!,
        slug:slug!
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