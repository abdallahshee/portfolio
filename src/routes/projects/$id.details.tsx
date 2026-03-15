import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$id/details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$id/details"!</div>
}
