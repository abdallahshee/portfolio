import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles/$slug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/articles/$slug/edit"!</div>
}
