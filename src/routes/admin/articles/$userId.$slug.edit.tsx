import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import ArticleEditor from "@/components/ArticleEditor"
import type { ArticleRequest } from "@/db/validations/article.types"
import { getArticleBySlugQueryOptions } from "@/db/queries/article.queries"
import { useArticleUpdateMutationOption } from "@/db/mutations/article.mutations"
import { AdminMiddleware } from "@/server/middleware/auth.middleware"

export const Route = createFileRoute("/admin/articles/$userId/$slug/edit")({
  server: { middleware: [AdminMiddleware] },
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
  const { slug, userId } = Route.useParams()
  const [loading, setLoading] = useState(false)

  const updateMutation = useArticleUpdateMutationOption({ role: "user" })

  return (
    <ArticleEditor
      mode="edit"
      initialData={{
        title: article?.title,
        content: article?.content,
        userId,
        tags: article?.tags ?? [],
        coverImage: article?.coverImage ?? null,
        categoryId: article?.categoryId ?? null,
      }}
      loading={loading}
      onSubmit={async (values: ArticleRequest, imageFile: File | null) => {
        try {
          setLoading(true)

          let coverImage = values.coverImage

          if (imageFile) {
            // 👇 upload the file
            // coverImage = await uploadImage(imageFile)
          }

          await updateMutation.mutateAsync({
            ...values,
            coverImage,
            slug,
          })

          router.history.back()
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