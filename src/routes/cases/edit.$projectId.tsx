import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cases/edit/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cases/edit/$projectId"!</div>
}
