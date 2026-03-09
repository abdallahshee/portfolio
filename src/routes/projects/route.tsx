import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Projects Section</h1>
      <Outlet /> {/* Renders nested child routes */}
    </div>
  )
}