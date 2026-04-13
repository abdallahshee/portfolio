import { getPaginatedProjectsQueryOptions } from '@/db/queries/project.queries'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/admin/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      getPaginatedProjectsQueryOptions(1, 6)
    )
  },
  component: RouteComponent,
})
// Implementing projects list, and modal for deleting a project, link to project edit page
// The table should be scrollable
function RouteComponent() {
  const { data: projects } = useQuery(
    getPaginatedProjectsQueryOptions(1, 6)
  )
  return (
    <div>
      <h1 className="text-lg font-semibold">Projects</h1>
      {projects?.projects.map((project: any) => (
        <div key={project.id}>
          {project.name}
        </div>
      ))}
    </div>
  )
}