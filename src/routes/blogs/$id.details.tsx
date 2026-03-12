import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/$id/details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blogs/$id/details"!</div>
}
