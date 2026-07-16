// routes/projects/route.tsx
import { ProjectList } from "@/components/ProjectList"
import { getPaginatedProjectsQueryOptions } from "@/db/queries/project.queries"
import { Paper } from "@mantine/core"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/projects")({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      getPaginatedProjectsQueryOptions(1)
    )
    return data
  },
  component: ProjectsLayout,
})

function ProjectsLayout() {
  const { projects } = Route.useLoaderData()

  return (
    <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1.7fr_1fr] lg:items-start xl:grid-cols-[1.8fr_1fr] xl:gap-8">
      {/* LEFT — all projects, always mounted, larger share of the row */}
      <ProjectList projects={projects} />

      {/* RIGHT — Featured (index) or Details ($slug) */}
      <Paper radius="lg" withBorder p="md">
        <Outlet />
      </Paper>
    </div>
  )
}