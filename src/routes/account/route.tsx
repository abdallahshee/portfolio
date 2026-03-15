import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { Lock } from "lucide-react"
export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

 function RouteComponent() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 md:py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <Paper
            radius="2xl"
            p="xl"
            withBorder
            className="hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl lg:flex"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <Group gap="sm" mb="lg">
                  <ThemeIcon
                    variant="white"
                    color="rgba(255,255,255,0.15)"
                    radius="xl"
                  >
                    <Lock size={18} />
                  </ThemeIcon>
                  <Text fw={700} className="text-white">
                    Portfolio Access
                  </Text>
                </Group>

                <Title
                  order={1}
                  className="mb-4 text-4xl leading-tight text-white"
                >
                  Welcome
                </Title>

                <Text className="max-w-md text-base leading-7 text-white/85">
                  Access your portfolio account to manage projects, blogs, and
                  other protected features.
                </Text>
              </div>

              <div className="mt-10 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <Text fw={600} className="mb-2 text-white">
                  What you can do
                </Text>
                <Stack gap="xs">
                  <Text size="sm" className="text-white/80">
                    • Sign in securely with email or OAuth
                  </Text>
                  <Text size="sm" className="text-white/80">
                    • Manage projects and portfolio content
                  </Text>
                  <Text size="sm" className="text-white/80">
                    • Access your account from one place
                  </Text>
                </Stack>
              </div>
            </div>
          </Paper>

          <div className="flex items-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}