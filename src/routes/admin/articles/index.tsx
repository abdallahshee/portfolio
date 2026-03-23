import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/articles/"!</div>
}
