import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import ArticleEditor from "@/components/ArticleEditor"
import type { ArticleRequest } from "@/db/validations/article.types"
import { useArticleCreateMutation } from "@/db/mutations/article.mutations"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { AuthenticatedMiddleware } from "@/server/middleware/auth.middleware"

export const Route = createFileRoute("/articles/create")({
  server: { middleware: [AuthenticatedMiddleware] },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllCategoriesQueryOption())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const createBlogMutation = useArticleCreateMutation({ role: "user" })
  const { data: categories } = useQuery(getAllCategoriesQueryOption())

  return (
    <ArticleEditor
      mode="create"
      loading={loading}
      onSubmit={async (values: ArticleRequest, imageFile: File | null) => {
        try {
          setLoading(true)

          let coverImage =
            values.coverImage ||
            "https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg"

          // Upload the image here if a new file was selected
          // Example:
          // if (imageFile) {
          //   coverImage = await uploadImage(imageFile)
          // }

          await createBlogMutation.mutateAsync({
            title: values.title,
            tags: values.tags,
            content: values.content,
            coverImage,
            categoryId: values.categoryId,
            userId: values.userId,

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