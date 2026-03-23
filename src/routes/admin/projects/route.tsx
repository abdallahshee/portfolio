import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Outlet/>
  </div>
}
