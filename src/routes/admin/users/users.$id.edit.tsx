import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/users/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/users/users/$id/edit"!</div>
}
