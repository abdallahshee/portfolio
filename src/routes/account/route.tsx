import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Text, Title } from '@mantine/core'
import { ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.07) 0%, transparent 50%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10" />
      <div className="relative w-full max-w-lg">
        <div className="text-center mb-3 space-y-1">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white-50 px-8 py-2 text-blue-600 dark:text-red-300">
              <ShieldCheck size={26} />
              <Title order={2} className="tracking-tight">
                Account Management
              </Title>
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-200/40 via-transparent to-purple-200/40 blur-xl opacity-50 pointer-events-none" />

        {/* Card outlet */}
        <div className="relative">
          <Outlet />
        </div>

        <div className="text-center mt-2">
          <Text size="md" c="dimmed">
            Secure authentication powered for a seamless experience.
          </Text>
        </div>
      </div>
    </div>
  )
}