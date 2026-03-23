import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Home, LogOut, Users, FolderKanban, FileText,
  Tag, Sun, Moon, ArrowLeft, Briefcase,
} from 'lucide-react'
import {
  Avatar, Badge, Burger, Code, Drawer, Group,
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
  { label: 'Overview',   to: '/admin',           icon: Home,         color: 'indigo', description: 'Dashboard summary' },
  { label: 'Users',      to: '/admin/users',      icon: Users,        color: 'blue',   description: 'Manage user accounts' },
  { label: 'Projects',   to: '/admin/projects',   icon: FolderKanban, color: 'teal',   description: 'Manage portfolio projects' },
  { label: 'Articles',   to: '/admin/articles',   icon: FileText,     color: 'grape',  description: 'Manage blog articles' },
  { label: 'Categories', to: '/admin/categories', icon: Tag,          color: 'orange', description: 'Manage content categories' },
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

// ✅ NavLinks is pure — just renders links, no business logic
function NavLinks({ onSelect }: { onSelect?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="space-y-1 p-3">
      {navItems.map((item) => {
        const isActive =
          pathname === item.to ||
          (item.to !== '/admin' && pathname.startsWith(item.to))

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onSelect}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-all ${
              isActive
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
            <div className="min-w-0 flex-1">
              <Text size="sm" fw={isActive ? 600 : 400} truncate>
                {item.label}
              </Text>
            </div>
            {isActive && (
              <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
            )}
          </Link>
        )
      })}
    </div>
  )
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

  const activeNav =
    navItems.find(
      (i) => pathname === i.to || (i.to !== '/admin' && pathname.startsWith(i.to))
    ) ?? navItems[0]

  // ✅ Hire mode state — lives here, used in top bar
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

  // Theme
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

  // Navigation
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
      className="flex items-center justify-center rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {themeMode === 'dark'
        ? <Moon size={18} className="text-indigo-400" />
        : <Sun size={18} className="text-indigo-500" />
      }
    </UnstyledButton>
  )

  const sidebar = (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">

      {/* Sidebar header */}
      <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-800">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size={32} radius="lg" variant="filled" color="indigo">
              <Home size={16} />
            </ThemeIcon>
            <Text fw={700} size="sm">Admin Panel</Text>
          </Group>
          <Code fw={600} color="indigo">v1.0</Code>
        </Group>
      </div>

      {/* Nav links */}
      <ScrollArea className="flex-1">
        <NavLinks onSelect={() => setMobileOpen(false)} />
      </ScrollArea>

      {/* Sidebar footer */}
      <div className="space-y-1 border-t border-slate-100 p-3 dark:border-slate-800">

        {/* Back to site */}
        <button
          onClick={handleBackToSite}
          disabled={isLeaving}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 disabled:opacity-50"
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
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
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
  )

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 md:flex">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        size={280}
        padding={0}
        withCloseButton={false}
      >
        {sidebar}
      </Drawer>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <Group gap="sm">
            <Burger
              opened={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              size="sm"
              className="md:hidden"
            />
            <div>
              <Text fw={600} size="sm">{activeNav.label}</Text>
              <Text size="xs" c="dimmed">{activeNav.description}</Text>
            </div>
          </Group>

          <Group gap="sm">
            {ThemeButton}

            {/* ✅ Hire mode toggle — now lives here */}
            <button
              onClick={handleHireToggle}
              disabled={toggleLoading}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition disabled:opacity-50 ${
                hireOpen
                  ? 'border-red-300 bg-red-100 text-red-700 hover:bg-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'border-green-300 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-700 dark:bg-green-900 dark:text-green-300'
              }`}
            >
              {toggleLoading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Briefcase size={14} />
              )}
              {toggleLoading ? 'Updating…' : hireOpen ? 'Disable Hire Mode' : 'Enable Hire Mode'}
            </button>

            <Badge variant="light" color="green" radius="xl">Admin</Badge>
            <Avatar
              size={32}
              radius="xl"
              src={user?.image || null}
              color="indigo"
            >
              {user?.name?.[0] ?? 'A'}
            </Avatar>
          </Group>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}