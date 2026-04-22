import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Container, Paper } from '@mantine/core'

export const Route = createFileRoute('/account')({

  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container size="xs" className="py-10 sm:py-16">
      <Paper withBorder  radius="md" className="p-6 shadow-sm sm:p-8">
      <Outlet />
      </Paper>
    </Container>
  )
}