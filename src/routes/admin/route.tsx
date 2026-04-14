import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

import { useState, useEffect } from 'react'
import {
  LogOut,
  ArrowLeft,
  Menu as MenuIcon,
  X,
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Tag,
  ChevronRight,
} from 'lucide-react'

import {
  Avatar,
  Badge,
  Drawer,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
  Menu,
} from '@mantine/core'

import { useRouter } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getStatsQueryOptions } from '@/db/queries/admin.queries'


export const Route = createFileRoute('/admin')({
 
  component: RouteComponent,
})

function RouteComponent() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const queryClient = useQueryClient()
  const { data: stats } = useQuery(getStatsQueryOptions)

  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session) => {
        setSession(session)
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await queryClient.invalidateQueries()
    await router.navigate({ to: '/' })
  }

  const handleBackToSite = async () => {
    await router.navigate({ to: '/' })
  }

  const navItems = [
    {
      label: 'Overview',
      to: '/admin',
      icon: LayoutDashboard,
      color: 'indigo',
      count: null,
    },
    {
      label: 'Users',
      to: '/admin/users',
      icon: Users,
      color: 'blue',
      count: stats?.users ?? null,
    },
    {
      label: 'Projects',
      to: '/admin/projects',
      icon: FolderKanban,
      color: 'teal',
      count: stats?.projects ?? null,
    },
    {
      label: 'Articles',
      to: '/admin/articles',
      icon: FileText,
      color: 'grape',
      count: stats?.articles ?? null,
    },
    {
      label: 'Categories',
      to: '/admin/categories',
      icon: Tag,
      color: 'orange',
      count: stats?.categories ?? null,
    },
  ]

  const isActive = (to: string) =>
    to === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(to)

  const SidebarContent = (
    <div className="flex h-full flex-col">

      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <LayoutDashboard size={16} color="white" />
        </div>
        <div className="min-w-0">
          <Text fw={700} size="sm" className="leading-tight">Admin Panel</Text>
          <Text size="xs" c="dimmed" className="leading-tight truncate">
            {user?.email ?? 'administrator'}
          </Text>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-4">
        <Text size="xs" fw={600} c="dimmed" className="mb-2 px-2 uppercase tracking-widest">
          Navigation
        </Text>

        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-all ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-950'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ThemeIcon
                  size={30}
                  radius="md"
                  variant={active ? 'filled' : 'light'}
                  color={active ? 'indigo' : item.color}
                >
                  <item.icon size={15} />
                </ThemeIcon>

                <span
                  className={`flex-1 text-sm ${
                    active
                      ? 'font-semibold text-indigo-700 dark:text-indigo-300'
                      : 'font-normal text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </span>

                {item.count !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      active
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* User + actions */}
      <div className="border-t border-slate-200 p-3 space-y-1 dark:border-slate-800">
        {/* User info */}
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5">
          <Avatar size={32} radius="md" color="indigo" className="shrink-0">
            {user?.user_metadata?.name?.[0] ?? 'A'}
          </Avatar>
          <div className="min-w-0 flex-1">
            <Text size="xs" fw={600} className="truncate leading-tight">
              {user?.user_metadata?.name ?? 'Admin'}
            </Text>
            <Badge variant="light" color="green" size="xs" radius="xl">
              Administrator
            </Badge>
          </div>
        </div>

        <button
          onClick={handleBackToSite}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ThemeIcon size={28} radius="md" variant="light" color="indigo">
            <ArrowLeft size={14} />
          </ThemeIcon>
          <span className="text-sm">Back to site</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
        >
          <ThemeIcon size={28} radius="md" variant="light" color="red">
            <LogOut size={14} />
          </ThemeIcon>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:flex sm:flex-col">
        {SidebarContent}
      </aside>

      {/* ── Mobile drawer ── */}
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        position="left"
        size={260}
        padding={0}
        withCloseButton={false}
      >
        <div className="h-full bg-white dark:bg-slate-900">
          {SidebarContent}
        </div>
      </Drawer>

      {/* ── Right side — topbar + content ── */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">

          {/* Mobile: burger + brand */}
          <Group gap="sm">
            <UnstyledButton
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 sm:hidden"
            >
              <MenuIcon size={16} className="text-slate-600 dark:text-slate-400" />
            </UnstyledButton>

            {/* Breadcrumb — current section */}
            <div className="hidden items-center gap-1.5 sm:flex">
              <Text size="xs" c="dimmed">Admin</Text>
              <ChevronRight size={12} className="text-slate-400" />
              <Text size="xs" fw={500}>
                {navItems.find((n) => isActive(n.to))?.label ?? 'Dashboard'}
              </Text>
            </div>

            {/* Mobile brand label */}
            <Text size="sm" fw={600} className="sm:hidden">
              {navItems.find((n) => isActive(n.to))?.label ?? 'Admin'}
            </Text>
          </Group>

          {/* Right — user dropdown */}
          <Menu shadow="md" width={200} position="bottom-end" withArrow>
            <Menu.Target>
              <UnstyledButton className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <Text size="xs" fw={500} className="hidden sm:inline">
                  {user?.user_metadata?.name ?? 'Admin'}
                </Text>
                <Avatar size={28} radius="md" color="indigo">
                  {user?.user_metadata?.name?.[0] ?? 'A'}
                </Avatar>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Session</Menu.Label>
              <Menu.Item
                leftSection={<ArrowLeft size={14} />}
                onClick={handleBackToSite}
              >
                Back to site
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<LogOut size={14} />}
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}