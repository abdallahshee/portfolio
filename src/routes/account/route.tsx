import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Container, Paper } from '@mantine/core'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container size="2xl" className="py-10 sm:py-16">
      <div className="flex w-full justify-center">
        <Paper
          withBorder
          radius="lg"
          className="
            w-full
            max-w-4xl
            overflow-hidden
            border border-slate-200/70
            bg-linear-to-br
            from-white
            via-indigo-50
            to-blue-50
            p-8
            sm:p-12
            dark:border-slate-700
            dark:from-slate-900
            dark:via-slate-900
            dark:to-slate-800
          "
        >
          <Outlet />
        </Paper>
      </div>
    </Container>
  )
}