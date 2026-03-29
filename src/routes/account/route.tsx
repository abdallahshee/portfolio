import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'radial-gradient(ellipse at 60% 20%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,0.07) 0%, transparent 50%)',
      }}
    >
      {/* subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10"
        // style={{
        //   backgroundImage: `linear-gradient(var(--mantine-color-gray-2) 1px, transparent 1px),
        //                     linear-gradient(90deg, var(--mantine-color-gray-2) 1px, transparent 1px)`,
        //   backgroundSize: '32px 32px',
        // }}
      />

      <div className="relative w-full max-w-lg">
        {/* glow behind the card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br  opacity- pointer-events-none" />
        <Outlet />
      </div>
    </div>
  )
}