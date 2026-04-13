import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  LogOut, Users, FolderKanban, FileText,
  Tag, Sun, Moon, ArrowLeft, Menu, X,
  LayoutDashboard, Plus,
} from 'lucide-react'
import {
  Avatar, Badge, Card, Drawer, Group, Paper,
  ScrollArea, SimpleGrid, Stack, Text, ThemeIcon, UnstyledButton,
} from '@mantine/core'
import { useRouter } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getStatsQueryOptions } from '@/db/queries/admin.queries'

export const Route = createFileRoute('/admin')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getStatsQueryOptions)
  },
  component: RouteComponent,
})

type ThemeMode = 'light' | 'dark'

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
  const supabase = getSupabaseBrowserClient()
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const { data: stats } = useQuery(getStatsQueryOptions)

  const navItems = [
    {
      label: 'Users',
      to: '/admin/users',
      icon: Users,
      disabled: false,
      color: 'blue',
      count: stats?.users ?? 0,
      quickAction: { label: 'Add user', to: '/admin/users/create' },
    },
    {
      label: 'Projects',
      to: '/admin/projects',
      icon: FolderKanban,
      disabled: false,
      color: 'teal',
      count: stats?.projects ?? 0,
      quickAction: { label: 'Add project', to: '/admin/projects/create' },
    },
    {
      label: 'Articles',
      to: '/admin/articles',
      icon: FileText,
      disabled: true,
      color: 'grape',
      count: stats?.articles ?? 0,
      quickAction: { label: 'Write article', to: '/articles/create' },
    },
    {
      label: 'Categories',
      to: '/admin/categories',
      icon: Tag,
      disabled: true,
      color: 'orange',
      count: stats?.categories ?? 0,
      quickAction: { label: 'Add category', to: '/admin/categories/create' },
    },
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data?.session ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isRoot = pathname === '/admin'

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
    await new Promise((resolve) => setTimeout(resolve, 400))
    await router.navigate({ to: '/' })
  }

  const handleLogout = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    await queryClient.invalidateQueries()
    await router.navigate({ to: '/' })
    setIsSigningOut(false)
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        {/* Row 1 — brand + user */}
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6">
          <Group gap="sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <LayoutDashboard size={14} color="white" />
            </div>
            <Text fw={600} size="sm" className="text-slate-900 dark:text-slate-50">
              Admin
            </Text>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <UnstyledButton
              onClick={handleThemeChange}
              className="flex items-center justify-center rounded-full p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {themeMode === 'dark'
                ? <Moon size={16} className="text-indigo-400" />
                : <Sun size={16} className="text-indigo-500" />
              }
            </UnstyledButton>
          </Group>

          <Group gap="sm">
            <Group gap="xs" className="hidden sm:flex">
              <Avatar
                size={28}
                radius="md"
                src={user?.user_metadata?.avatar || null}
                color="indigo"
              >
                {user?.user_metadata?.name?.[0] ?? 'A'}
              </Avatar>
              <div>
                <Text size="xs" fw={500} className="leading-tight text-slate-800 dark:text-slate-100">
                  {user?.user_metadata?.name ?? 'Admin'}
                </Text>
              </div>
            </Group>
            {/* Back + Logout — desktop */}
            <Group gap="xs" className="hidden sm:flex">
              <button
                onClick={handleBackToSite}
                disabled={isLeaving}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {isLeaving
                  ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <ArrowLeft size={12} />
                }
                {isLeaving ? 'Leaving…' : 'Back to site'}
              </button>
            </Group>
            {/* Mobile menu */}
            <UnstyledButton
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 sm:hidden"
            >
              <Menu size={18} className="text-slate-600 dark:text-slate-400" />
            </UnstyledButton>
          </Group>
        </div>

        {/* Row 2 — nav tabs */}
        <nav className="hidden border-t border-slate-100 dark:border-slate-800 sm:block">
          <div className="mx-auto flex max-w-[1280px] overflow-x-auto px-4 sm:px-6">
            {/* Dashboard home tab */}
            <Link
              to="/admin"
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium no-underline transition-colors ${pathname === '/admin'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <LayoutDashboard size={14} />
              Overview
            </Link>

            {navItems.map((item) => {
              const isActive =
                pathname === item.to ||
                (item.to !== '/admin' && pathname.startsWith(item.to))

              return (
                <Link
                  key={item.to}
                  to={item.to}

                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium no-underline transition-colors ${isActive
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        size={300}
        padding={0}
        withCloseButton={false}
        position="right"
      >
        <div className="flex h-full flex-col bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
            <Group gap="xs">
              <Avatar size={28} radius="md" src={user?.user_metadata?.avatar || null} color="indigo">
                {user?.user_metadata?.name?.[0]}
              </Avatar>
              <div>
                <Text size="xs" fw={500}>{user?.user_metadata?.name ?? 'Admin'}</Text>
                <Text size="xs" c="dimmed">Administrator</Text>
              </div>
            </Group>
            <UnstyledButton
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={16} className="text-slate-500" />
            </UnstyledButton>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-3">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-all ${pathname === '/admin'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
              >
                <ThemeIcon size={32} radius="md" variant={pathname === '/admin' ? 'filled' : 'light'} color="indigo">
                  <LayoutDashboard size={16} />
                </ThemeIcon>
                <span className="flex-1 text-sm font-medium">Overview</span>
              </Link>

              {navItems.map((item) => {
                const isActive = pathname === item.to || pathname.startsWith(item.to)
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
                    <ThemeIcon size={32} radius="md" variant={isActive ? 'filled' : 'light'} color={isActive ? 'indigo' : item.color}>
                      <item.icon size={16} />
                    </ThemeIcon>
                    <span className={`flex-1 text-sm ${isActive ? 'font-semibold' : 'font-normal'}`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>

          <div className="mt-auto space-y-1 border-t border-slate-100 p-3 dark:border-slate-800">
            <button
              onClick={handleBackToSite}
              disabled={isLeaving}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-indigo-50 disabled:opacity-50 dark:hover:bg-indigo-950"
            >
              <ThemeIcon size={32} radius="md" variant="light" color="indigo">
                {isLeaving
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <ArrowLeft size={16} />
                }
              </ThemeIcon>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {isLeaving ? 'Leaving…' : 'Back to site'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 
             bg-red-50 text-red-600 
             hover:bg-blue-500 hover:text-white 
             transition-colors duration-200 
             disabled:opacity-50 
             dark:bg-red-950 dark:text-red-300 dark:hover:bg-blue-600"
            >
              <ThemeIcon
                size={32}
                radius="md"
                variant="light"
                className="bg-red-100 text-red-600 
               group-hover:bg-white group-hover:text-blue-600"
              >
                {signingOut
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <LogOut size={16} />
                }
              </ThemeIcon>

              <span className="text-sm font-medium">
                {signingOut ? 'Signing out…' : 'Logout'}
              </span>
            </button>
          </div>
        </div>
      </Drawer>

      {/* Main content */}
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 sm:px-6">

        {/* ── Dashboard overview — only shown at /admin root ── */}
        {isRoot && (
          <Stack gap="xl">

            {/* Greeting */}
            <div>
              <Text size="xl" fw={600} className="text-slate-900 dark:text-slate-50">
                Welcome back, {user?.user_metadata?.name?.split(' ')[0] ?? 'Admin'}
              </Text>
              <Text size="md" c="dimmed">
                Here's a summary of your portfolio site.
              </Text>
            </div>

            {/* Stat cards */}


            {/* Management cards */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {navItems.map((item) => (
                <Paper
                  key={item.to}
                  withBorder
                  radius="lg"
                  p="lg"
                  className="dark:border-slate-700 dark:bg-slate-900"
                >
                  <Group justify="space-between" mb="md">
                    <Group gap="sm">
                      <ThemeIcon variant="light" color={item.color} radius="md" size={34}>
                        <item.icon size={16} />
                      </ThemeIcon>
                      <div>
                        <Text size="md" fw={500}>{item.label}</Text>

                      </div>
                    </Group>
                    <Text variant="light" color={item.color} size="lg">
                      {item.count}
                    </Text>
                  </Group>

                  <Group gap="sm" className="w-full">

                    {/* 2 parts */}
                    <Link to={item.to} className="no-underline flex-[2]">
                      <button className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                        {item.label}
                      </button>
                    </Link>

                    {/* 1 part */}
                    <Link to={item.quickAction.to} hidden={item.disabled} className="no-underline flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700">
                        <Plus size={24} />

                      </button>
                    </Link>

                  </Group>
                </Paper>
              ))}
            </SimpleGrid>

            {/* System info */}
            <Paper withBorder radius="lg" p="lg" className="dark:border-slate-700 dark:bg-slate-900">
              <Text size="sm" fw={600} mb="md">Session info</Text>
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" mb={2}>Signed in as</Text>
                  <Text size="sm" fw={500}>{user?.email ?? '—'}</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={2}>Role</Text>
                  <Badge variant="light" color="green" radius="xl" size="sm">Administrator</Badge>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={2}>Status</Text>
                  <Group gap={6}>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <Text size="sm">Active session</Text>
                  </Group>
                </div>
              </SimpleGrid>
            </Paper>
          </Stack>
        )}

        {/* Child routes render here */}
        {!isRoot && <Outlet />}
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={handleLogout}
            disabled={signingOut}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 
             bg-red-50 text-red-600 
             hover:bg-blue-500 hover:text-white 
             transition-all duration-200 
             disabled:opacity-50 
             dark:bg-red-950 dark:text-red-300 dark:hover:bg-blue-600"
          >
            <ThemeIcon
              size={32}
              radius="md"
              variant="light"
              className="bg-red-100 text-red-600 transition-colors px-3
               group-hover:bg-white group-hover:text-blue-600"
            >
              {signingOut
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                : <LogOut size={16} />
              }
            </ThemeIcon>

            <span className="text-sm font-medium">
              {signingOut ? 'Signing out…' : 'Logout'}
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}