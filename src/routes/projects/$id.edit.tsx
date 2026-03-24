import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$id/edit"!</div>
}
