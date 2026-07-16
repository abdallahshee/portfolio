import { Button, Paper, ThemeIcon } from '@mantine/core'
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface ErrorPageProps {
  error?: Error
  reset?: () => void
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8 sm:px-6">
      <Paper
        radius="xl"
        withBorder
        shadow="sm"
        className="
          w-full
          max-w-2xl
          border-slate-200/70
          bg-linear-to-br
          from-white
          via-red-50
          to-orange-50
          p-6
          sm:p-8
          md:p-10
          dark:border-slate-700
          dark:from-slate-900
          dark:via-slate-900
          dark:to-slate-800
        "
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <ThemeIcon
            size={84}
            radius="xl"
            color="red"
            variant="light"
          >
            <AlertTriangle size={42} />
          </ThemeIcon>

          {/* Content */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Something went wrong
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
              An unexpected error occurred while loading this page.
              You can try refreshing the page, return home, or go back to the
              previous screen.
            </p>

            {error?.message && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left dark:border-red-900/50 dark:bg-red-950/20">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                  Error Details
                </p>

                <p className="break-words font-mono text-sm text-red-700 dark:text-red-300">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            {reset && (
              <div className="w-full sm:flex-1">
                <Button
                  fullWidth
                  color="red"
                  radius="md"
                  leftSection={<RefreshCw size={16} />}
                  onClick={reset}
                >
                  Try Again
                </Button>
              </div>
            )}

            <div className="w-full sm:flex-1">
              <Button
                fullWidth
                variant="outline"
                color="gray"
                radius="md"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => router.history.back()}
              >
                Go Back
              </Button>
            </div>

            <div className="w-full sm:flex-1">
              <Button
                fullWidth
                color="indigo"
                radius="md"
                leftSection={<Home size={16} />}
                onClick={() => router.navigate({ to: '/' })}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  )
}