import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Container, Stack, Title, Text, Button, ThemeIcon, Paper } from '@mantine/core'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import z from 'zod'

const SearchSchema = z.object({
    redirectTo: z.string().optional(),
})

export const Route = createFileRoute('/unauthorized')({
    validateSearch: SearchSchema,
    component: RouteComponent,
})

function RouteComponent() {
    const { redirectTo } = Route.useSearch()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-10">
            <Container size="sm">
                <Paper radius="2xl" withBorder shadow="sm" p="xl">
                    <Stack align="center" gap="lg" py="xl">

                        <ThemeIcon size={80} radius="xl" variant="light" color="red" className="animate-pulse">
                            <ShieldX size={40} />
                        </ThemeIcon>

                        <Stack align="center" gap="xs">
                            <Title order={1} className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                401
                            </Title>
                            <Title order={2} className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                Unauthorized
                            </Title>
                            <Text c="dimmed" ta="center" size="md" className="max-w-sm leading-7">
                                You don't have permission to access this page. Please sign in
                                with an account that has the required permissions.
                            </Text>
                        </Stack>

                        <Stack gap="sm" w="100%" maw={320}>
                            <Link
                                to="/account"
                                search={{ callbackUrl: redirectTo ?? '/' }}
                            >
                                <Button fullWidth radius="xl" color="indigo" leftSection={<ArrowLeft size={16} />}>
                                    Back to Sign In
                                </Button>
                            </Link>

                            <Button
                                fullWidth
                                radius="xl"
                                variant="outline"
                                color="gray"
                                leftSection={<Home size={16} />}
                                onClick={() => navigate({ to: '/' })}
                            >
                                Go to Home
                            </Button>
                        </Stack>

                    </Stack>
                </Paper>
            </Container>
        </div>
    )
}