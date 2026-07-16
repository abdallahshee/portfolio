import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button, ThemeIcon, Paper } from '@mantine/core'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Paper
        radius="24px"
        withBorder
        shadow="sm"
        className="relative w-full max-w-md overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-6 py-10 sm:px-10 sm:py-12 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
        <div className="flex flex-col items-center gap-6">
          <ThemeIcon size={80} radius="md" variant="light" color="red">
            <ShieldX size={40} />
          </ThemeIcon>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="title2 text-slate-900 dark:text-white">401</p>
            <p className="title2 text-slate-700 dark:text-slate-300">Unauthorized</p>
            <p className="mt-1 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              You don't have permission to access this page.
            </p>
          </div>

          <div className="flex w-full max-w-[320px] flex-col gap-3">
            <Button
              fullWidth
              radius="md"
              size="sm"
              color="indigo"
              leftSection={<Home size={16} />}
              onClick={() => router.navigate({ to: '/' })}
            >
              Go to Home
            </Button>
            <Button
              fullWidth
              radius="md"
              size="sm"
              variant="outline"
              color="gray"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => router.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  )
}