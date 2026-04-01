import {  getUserByIdQueryOptions } from '@/db/queries/user.queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/$id')({
  loader: async ({ context,params }) => {
    await context.queryClient.prefetchQuery(getUserByIdQueryOptions(params.id))
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/users/users/$id"!</div>
}
