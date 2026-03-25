import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { useRef } from "react"
import TurndownService from "turndown"
import { AuthMiddleware } from "@/server/middleware"
import { useBlogCreateMutation } from "@/db/mutations/article.mutations"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { useQuery } from "@tanstack/react-query"

import ArticleEditor from "@/components/ArticleEditor"
import type { ArticleRequest } from "@/db/validations/article.types"


export const Route = createFileRoute("/articles/create")({
  server: { middleware: [AuthMiddleware] },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllCategoriesQueryOption())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const turndownService = useRef(new TurndownService())
  const createBlogMutation = useBlogCreateMutation({role:"user"})
  const { data: categories } = useQuery(getAllCategoriesQueryOption())

  return (
    <ArticleEditor
      mode="create"
      categories={categories ?? []}
      loading={loading}
      onSubmit={async (values:ArticleRequest, imageUrl:string) => {
        try {
          setLoading(true)
          const markdownContent = turndownService.current.turndown(values.content)
          await createBlogMutation.mutateAsync({
            title: values.title,
            tags: values.tags,
            content: markdownContent,
            coverImage: imageUrl || "https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg",
            categoryId: values.categoryId,
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