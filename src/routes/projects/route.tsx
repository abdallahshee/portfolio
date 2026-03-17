import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">

      <Outlet /> {/* Renders nested child routes */}
    </div>
  )
}