import { EditBlogMiddleware } from '@/server/middleware'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/$slug/edit')({
  server: {
    middleware: [EditBlogMiddleware]
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blogs/$id/edit"!</div>
}
