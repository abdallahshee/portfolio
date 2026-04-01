import { getAllUsersQueryOptions } from '@/db/queries/user.queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/users/$id')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllUsersQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/users/users/$id"!</div>
}
