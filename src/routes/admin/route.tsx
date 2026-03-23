import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Home, LogOut, Users, FolderKanban, FileText,
  Tag, Sun, Moon, ArrowLeft, Briefcase, Menu, X,
} from 'lucide-react'
import {
  Avatar, Badge, Code, Drawer, Group,
  ScrollArea, Text, ThemeIcon, UnstyledButton,
} from '@mantine/core'
import { useRouter } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { hireStatusQueryOptions } from '@/db/queries/utils.queries'
import { toggleHireModeStatus } from '@/server/setting.functions'

const SETTING_ID = import.meta.env.VITE_HIRE_MODE_ID!

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

type ThemeMode = 'light' | 'dark'

const navItems = [
  { label: 'Overview', to: '/admin', icon: Home, color: 'indigo', description: 'Dashboard summary' },
  { label: 'Users', to: '/admin/users', icon: Users, color: 'blue', description: 'Manage user accounts' },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban, color: 'teal', description: 'Manage portfolio projects' },
  { label: 'Articles', to: '/admin/articles', icon: FileText, color: 'grape', description: 'Manage blog articles' },
  { label: 'Categories', to: '/admin/categories', icon: Tag, color: 'orange', description: 'Manage content categories' },
]

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'dark') return 'dark'
  return 'light'
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.style.colorScheme = mode
  root.setAttribute('data-mantine-color-scheme', mode)
  root.setAttribute('data-theme', mode)
}

function RouteComponent() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const [isLeaving, setIsLeaving] = useState(false)
  const [signingOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const session = authClient.useSession()
  const user = session.data?.user
  const queryClient = useQueryClient()

  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const { data: hireData } = useQuery(hireStatusQueryOptions(SETTING_ID))
  const [hireOpen, setHireOpen] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)

  useEffect(() => {
    if (hireData?.isOpenForHire !== undefined) {
      setHireOpen(hireData.isOpenForHire)
    }
  }, [hireData?.isOpenForHire])

  const handleHireToggle = async () => {
    try {
      setToggleLoading(true)
      const result = await toggleHireModeStatus({ data: { settingId: SETTING_ID } })
      setHireOpen(result.isOpenForHire)
      queryClient.setQueryData(hireStatusQueryOptions(SETTING_ID).queryKey, {
        isOpenForHire: result.isOpenForHire,
      })
    } finally {
      setToggleLoading(false)
    }
  }

  useEffect(() => {
    const initial = getInitialMode()
    setThemeMode(initial)
    applyThemeMode(initial)
    const timeout = setTimeout(() => applyThemeMode(initial), 50)
    return () => clearTimeout(timeout)
  }, [])

  const handleThemeChange = () => {
    const next: ThemeMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(next)
    applyThemeMode(next)
    window.localStorage.setItem('theme', next)
  }

  const handleBackToSite = async () => {
    setIsLeaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await router.navigate({ to: '/' })
  }

  const handleLogout = async () => {
    setIsSigningOut(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await authClient.signOut()
    await router.navigate({ to: '/' })
  }

  const ThemeButton = (
    <UnstyledButton
      onClick={handleThemeChange}
      title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className="flex items-center justify-center rounded-full px-5 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {themeMode === 'dark'
        ? <Moon size={28} className="text-indigo-400" />
        : <Sun size={28} className="text-indigo-500" />
      }
    </UnstyledButton>
  )

  return (
    <div className="flex min-h-screen flex-col selection:bg-[rgba(79,184,178,0.24)]">
<header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

  {/* Row 1 — brand + user centered */}
  <div className="">
    <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-8 px-6 py-3">

      {/* Admin Panel brand */}
      <Group gap="xl">
        {/* <ThemeIcon size={32} radius="lg" variant="filled" color="indigo">
          <Home size={16} />
        </ThemeIcon> */}
        <div>
          <Text fw={700} size="sm" className="leading-tight">Admin Panel</Text>
          {/* <Code fw={600} color="indigo" className="text-xs">v1.0</Code> */}
        </div>
      </Group>

      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

      {/* User info */}
      <Group gap="xl">
        <Avatar size={32} radius="xl" src={user?.image || null} color="indigo">
          {user?.name?.[0] ?? 'A'}
        </Avatar>
        <Text size="sm" fw={500} className="hidden sm:block">
          {user?.name}
        </Text>
     
      </Group>

      {/* Mobile menu button — far right on mobile */}
      <UnstyledButton
        onClick={() => setMobileOpen(true)}
        className="absolute right-4 flex items-center justify-center rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden"
      >
        <Menu size={20} className="text-slate-600 dark:text-slate-400" />
      </UnstyledButton>

    </div>
  </div>

  {/* Row 2 — action buttons centered */}
  <div className="border-b border-slate-100 dark:border-slate-800">
    <div className="max-w-[1280px] mx-auto hidden items-center justify-center gap-3 px-6 py-2 sm:flex">

      {ThemeButton}

      <button
        onClick={handleHireToggle}
        disabled={toggleLoading}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition disabled:opacity-50 ${
          hireOpen
            ? 'border-red-300 bg-red-100 text-red-700 hover:bg-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-300'
            : 'border-green-300 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-700 dark:bg-green-900 dark:text-green-300'
        }`}
      >
        {toggleLoading
          ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          : <Briefcase size={14} />
        }
        {toggleLoading ? 'Updating…' : hireOpen ? 'Disable Hire Mode' : 'Enable Hire Mode'}
      </button>

      <button
        onClick={handleBackToSite}
        disabled={isLeaving}
        className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
      >
        {isLeaving
          ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          : <ArrowLeft size={14} />
        }
        {isLeaving ? 'Leaving…' : 'Back to Site'}
      </button>

      <button
        onClick={handleLogout}
        disabled={signingOut}
        className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
      >
        {signingOut
          ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          : <LogOut size={14} />
        }
        {signingOut ? 'Signing out…' : 'Logout'}
      </button>

    </div>
  </div>

  {/* Row 3 — nav links centered */}
  <nav className="hidden sm:block">
    <div className="max-w-[1280px] mx-auto flex justify-center overflow-x-auto px-6">
      {navItems.map((item) => {
        const isActive =
          pathname === item.to ||
          (item.to !== '/admin' && pathname.startsWith(item.to))

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium no-underline transition-colors ${
              isActive
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        )
      })}
    </div>
  </nav>

</header>

      {/* ── Mobile drawer ── */}
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        size={300}
        padding={0}
        withCloseButton={false}
        position="right"
      >
        <div className="flex h-full flex-col bg-white dark:bg-slate-900">

          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
            <Text fw={700} size="sm">Menu</Text>
            <UnstyledButton
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} className="text-slate-500" />
            </UnstyledButton>
          </div>

          {/* Nav links */}
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-3">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.to ||
                  (item.to !== '/admin' && pathname.startsWith(item.to))

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-all ${isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                  >
                    <ThemeIcon
                      size={32}
                      radius="lg"
                      variant={isActive ? 'filled' : 'light'}
                      color={isActive ? 'indigo' : item.color}
                    >
                      <item.icon size={16} />
                    </ThemeIcon>
                    <Text size="sm" fw={isActive ? 600 : 400}>
                      {item.label}
                    </Text>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>

          {/* Drawer footer */}
          <div className="space-y-1 border-t border-slate-100 p-3 dark:border-slate-800">

            {/* Hire mode */}
            <button
              onClick={handleHireToggle}
              disabled={toggleLoading}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition disabled:opacity-50 ${hireOpen
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950'
                  : 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950'
                }`}
            >
              <ThemeIcon size={32} radius="lg" variant="light" color={hireOpen ? 'red' : 'green'}>
                {toggleLoading
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <Briefcase size={16} />
                }
              </ThemeIcon>
              <Text size="sm" c={hireOpen ? 'red' : 'green'}>
                {toggleLoading ? 'Updating…' : hireOpen ? 'Disable Hire Mode' : 'Enable Hire Mode'}
              </Text>
            </button>

            {/* Back to site */}
            <button
              onClick={handleBackToSite}
              disabled={isLeaving}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
            >
              <ThemeIcon size={32} radius="lg" variant="light" color="indigo">
                {isLeaving
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <ArrowLeft size={16} />
                }
              </ThemeIcon>
              <Text size="sm" c="indigo">
                {isLeaving ? 'Leaving…' : 'Back to Site'}
              </Text>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
            >
              <ThemeIcon size={32} radius="lg" variant="light" color="red">
                {signingOut
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <LogOut size={16} />
                }
              </ThemeIcon>
              <Text size="sm" c="red">
                {signingOut ? 'Signing out…' : 'Logout'}
              </Text>
            </button>
          </div>
        </div>
      </Drawer>

      {/* ── Page content ── */}
      <main className="flex-1 p-6">
        <div className="max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}