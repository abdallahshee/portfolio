import { EditUserForm } from '@/components/EditUser'
import { getAuthUserByIdQueryOptions } from '@/db/queries/admin.queries'

import { Container } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/$userId/edit')({
  loader: async ({ context, params }) => {
    const userId = params.userId
    await context.queryClient.prefetchQuery(getAuthUserByIdQueryOptions(userId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()

  // ✅ Use the prefetched query directly — no useState/useEffect needed
  // since the loader already prefetched this data
  const { data: theUser,error } = useSuspenseQuery(getAuthUserByIdQueryOptions(userId))

  return (
    <Container size="sm" className="py-10">
      <EditUserForm
        userId={userId}
        targetUser={theUser}
        role="admin" // Admin route — always 'admin'
      />
    </Container>
  )
}