import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Container, Stack, Text, Button, ThemeIcon, Paper } from '@mantine/core'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-10 dark:bg-slate-950">
      <Container size="sm">
        <Paper radius="2xl" withBorder shadow="sm" p="xl">
          <Stack align="center" gap="lg" py="xl">

            <ThemeIcon size={80} radius="md" variant="light" color="indigo">
              <FileQuestion size={40} />
            </ThemeIcon>

            <Stack align="center" gap="xs">
              <div className="title1 text-slate-900 dark:text-white">404</div>
              <div className="title2 text-slate-700 dark:text-slate-300">
                Page Not Found
              </div>
              <Text c="dimmed" ta="center" size="md" className="max-w-sm leading-7">
                The page you're looking for doesn't exist or may have been moved.
              </Text>
            </Stack>

            <Stack gap="sm" w="100%" maw={320}>
              <Button
                fullWidth
                radius="md"
                size="sm"
                color="indigo"
                leftSection={<Home size={16} />}
                onClick={() => navigate({ to: '/' })}
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
                onClick={() => window.history.back()}
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