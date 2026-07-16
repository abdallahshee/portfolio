// routes/projects/route.tsx
import { ProjectList } from "@/components/ProjectList"
import { getAllProjectsQueryOptions } from "@/db/queries/project.queries"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/projects")({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      getAllProjectsQueryOptions()
    )
    return data
  },
  component: ProjectsLayout,
})

function ProjectsLayout() {
  const { projects } = Route.useLoaderData()

  return (
    <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1.7fr_1fr] lg:items-start xl:grid-cols-[1.8fr_1fr] xl:gap-8">
      <ProjectList projects={projects} />
      <Outlet />
    </div>
  )
}