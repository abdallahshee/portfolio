import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/$slug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blogs/$id/edit"!</div>
}
