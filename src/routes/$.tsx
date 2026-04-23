import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Container, Stack, Text, Button, ThemeIcon, Paper } from '@mantine/core'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container size="sm" className="w-full">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"

          className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <Stack align="center" gap="lg" py="xl">

            <ThemeIcon size={80} radius="md" variant="light" color="indigo">
              <FileQuestion size={40} />
            </ThemeIcon>

            <Stack align="center" gap="xs">
              <div className="title2 text-slate-900 dark:text-white">404</div>
              <div className="title2 text-slate-700 dark:text-slate-300">
                Page Not Found
              </div>
              <Text c="dimmed" ta="center" size="md" className="max-w-sm leading-7" >
                The page you're looking for doesn't exist.
              </Text>
            </Stack>

            <Stack gap="sm" w="100%" maw={320}>
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
            </Stack>

          </Stack>
        </Paper>
      </Container>
    </div>
  )
}