import { getProjectByIdQueryOptions } from '@/db/queries/project.queries'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/projects/$projectId')({
  loader:async({context,params})=>{
    await context.queryClient.prefetchQuery(getProjectByIdQueryOptions(params.projectId))
  },
  component: RouteComponent,
})
// To implement project edit link
function RouteComponent() {
  const params=Route.useParams()
  const {data:projects}=useQuery(getProjectByIdQueryOptions(params.projectId))
  return <div>Hello "/admin/projects/$projectId"!</div>
}
