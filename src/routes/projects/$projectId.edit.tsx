import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/edit"!</div>
}
