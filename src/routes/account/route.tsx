import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Container, Paper } from '@mantine/core'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container size="xs" className="py-10 sm:py-16">
      <Paper withBorder  radius="lg"  className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Outlet />
      </Paper>
    </Container>
  )
}