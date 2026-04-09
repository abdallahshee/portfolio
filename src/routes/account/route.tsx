import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Avatar, Text } from '@mantine/core'

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

        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-200/40 via-transparent to-purple-200/40 blur-xl opacity-50 pointer-events-none" />

        {/* Unified card */}
        <div className="relative rounded-2xl border border-slate-200 bg-white px-8 pt-8 pb-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">

          {/* Logo + brand header inside the card */}
          <div className="flex flex-row items-center gap-3 mb-2">
            <Avatar
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah logo"
              size={30}

            />
            <Text size='sm' c="dimmed">Abdallah's Portfolio Website & Blog</Text>
          </div>

          {/* Divider */}
          <div className="border-t-2  border-blue-400 dark:border-white mb-6" />

          {/* Child route content */}
          <Outlet />

        </div>

      </div>
    </div>
  )
}