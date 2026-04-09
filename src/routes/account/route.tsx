import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Text, Title } from '@mantine/core'
import { ShieldCheck } from 'lucide-react'
import { Image } from '@mantine/core'

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
          <div className="flex flex-col items-center gap-3 mb-6">
            <Image
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah logo"
              radius="md"
              w={56}
              h={56}
              fit="cover"
            />
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
              <ShieldCheck size={17} />
              <Title order={4} className="tracking-tight">
                Your Account
              </Title>
            </div>
            <Text size="xs" c="dimmed" className="text-center -mt-1">
              Your information is encrypted and never shared with third parties.
            </Text>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-700 mb-6" />

          {/* Child route content */}
          <Outlet />

        </div>

      </div>
    </div>
  )
}