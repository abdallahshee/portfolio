import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articles/$userId/$slug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/articles/$userId/$slug/edit"!</div>
}
