// src/components/ErrorComponent.tsx
import { Button, Container, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorComponentProps {
  error: Error
  reset?: () => void
}

export default function ErrorComponent({ reset }: ErrorComponentProps) {
  return (
    <Container size="sm" className="py-24">
      <Stack align="center" gap="lg" className="text-center">
        <ThemeIcon size={80} radius="xl" variant="light" color="red">
          <AlertTriangle size={32} />
        </ThemeIcon>

        <Stack gap="xs" align="center">
          <Title order={2}>Something went wrong</Title>
          <Text c="dimmed" size="md" className="max-w-md">
            An unexpected error occurred. Please try again or go back home.
          </Text>
        </Stack>

        <Stack gap="sm" align="center">
          {reset && (
            <Button
              radius="xl"
              leftSection={<RefreshCw size={16} />}
              onClick={reset}
            >
              Try Again
            </Button>
          )}
          <Button radius="xl" variant="subtle" component="a" href="/">
            Go Home
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}