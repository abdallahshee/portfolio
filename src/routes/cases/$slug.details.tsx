import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cases/$slug/details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cases/$slug"!</div>
}
