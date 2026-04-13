import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/users/new"!</div>
}
