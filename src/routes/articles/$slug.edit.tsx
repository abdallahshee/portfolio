import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles/$slug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/articles/$slug/edit"!</div>
}
