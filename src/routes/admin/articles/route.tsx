import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles')({
  component: RouteComponent,
})

function RouteComponent() {

  return <div><Outlet/></div>
}
