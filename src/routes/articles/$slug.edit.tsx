import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { canEditBlogMiddleware } from "@/server/middleware"
import { getBlogBySlugForUpdateQueryOptions } from "@/db/queries/blog.queries"
import { blogUpdateMutationOption } from "@/db/mutations/blog.mutations"
import TurndownService from "turndown"
import { useRef } from "react"
import ArticleEditor from "@/components/ArticleEditor"
import type { BlogRequest } from "@/db/schema"

export const Route = createFileRoute("/articles/$slug/edit")({
  server: { middleware: [canEditBlogMiddleware] },
  loader: async ({ params, context }) => {
    return context.queryClient.ensureQueryData(
      getBlogBySlugForUpdateQueryOptions(params.slug)
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
  const updateMutation = blogUpdateMutationOption("user")

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
      onSubmit={async (values:BlogRequest, imageUrl) => {
        try {
          setLoading(true)
          const markdownContent = turndownService.current.turndown(values.content)
          await updateMutation.mutateAsync({
            blogSchema: {
              title: values.title,
              tags: values.tags,
              content: markdownContent,
              coverImage: imageUrl || blog?.coverImage || "",
            },
            slug,
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