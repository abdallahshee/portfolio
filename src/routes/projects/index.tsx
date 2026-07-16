// routes/projects/index.tsx
import { ProjectsOverviewPanel } from '@/components/ProjectsOverview'
import { getProjectStatsQueryOptions } from '@/db/queries/project.queries'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from '@mantine/core'

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      getProjectStatsQueryOptions()
    )
    return data
  },
  pendingComponent: () => <Skeleton height={400} radius="lg" />,
  pendingMs: 200,
  component: RouteComponent,
})

function RouteComponent() {
  const stats = Route.useLoaderData()
  return <ProjectsOverviewPanel stats={stats} />
}