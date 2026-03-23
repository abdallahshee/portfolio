import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles/$lug/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/articles/$lug/edit"!</div>
}
