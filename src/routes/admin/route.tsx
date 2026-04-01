import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Home, LogOut, Users, FolderKanban, FileText,
  Tag, Sun, Moon, ArrowLeft, Menu, X,
} from 'lucide-react'
import {
  Avatar, Drawer, Group, ScrollArea, Text, ThemeIcon, UnstyledButton,
} from '@mantine/core'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'

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
  const supabase = getSupabaseBrowserClient()
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)

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
    await supabase.auth.signOut()
    await queryClient.invalidateQueries()
    await router.navigate({ to: '/' })
    setIsSigningOut(false)
  }

  return (
    <div className="flex min-h-screen flex-col selection:bg-[rgba(79,184,178,0.24)]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        {/* ── Row 1 — brand + theme toggle + user ── */}
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-3">

          {/* Left — brand + theme toggle in same row ✅ */}
          <Group gap="sm">
            <Text fw={700} size="sm" className="leading-tight">Admin Panel</Text>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            {/* ✅ theme toggle inline with Admin Panel text */}
            <UnstyledButton
              onClick={handleThemeChange}
              title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="flex items-center justify-center rounded-full p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {themeMode === 'dark'
                ? <Moon size={18} className="text-indigo-400" />
                : <Sun size={18} className="text-indigo-500" />
              }
            </UnstyledButton>
          </Group>

          {/* Right — user info + mobile menu */}
          <Group gap="sm">
            <Avatar
              size={32}
              radius="xl"
              src={user?.user_metadata?.avatar_url || null}
              color="indigo"
            >
              {user?.user_metadata?.full_name?.[0] ?? 'A'}
            </Avatar>
            <Text size="sm" fw={500} className="hidden sm:block">
              {user?.user_metadata?.full_name ?? user?.email}
            </Text>

            {/* Mobile menu button */}
            <UnstyledButton
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden"
            >
              <Menu size={20} className="text-slate-600 dark:text-slate-400" />
            </UnstyledButton>
          </Group>
        </div>

        {/* ── Row 2 — nav links ── */}
        <nav className="hidden sm:block border-t border-slate-100 dark:border-slate-800">
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

      {/* Mobile drawer */}
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
            <Text fw={700} size="sm">Menu</Text>
            <UnstyledButton
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} className="text-slate-500" />
            </UnstyledButton>
          </div>

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
                    <Text size="sm" fw={isActive ? 600 : 400}>
                      {item.label}
                    </Text>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>

          {/* Mobile drawer footer — back to site + logout */}
          <div className="space-y-1 border-t border-slate-100 p-3 dark:border-slate-800">
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
              <Text size="sm" c="indigo">{isLeaving ? 'Leaving…' : 'Back to Site'}</Text>
            </button>

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
              <Text size="sm" c="red">{signingOut ? 'Signing out…' : 'Logout'}</Text>
            </button>
          </div>
        </div>
      </Drawer>

      {/* Page content */}
      <main className="flex-1 p-6">
        <div className="max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ✅ Back to Site + Logout fixed to bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 hidden flex-col gap-2 sm:flex">
        <button
          onClick={handleBackToSite}
          disabled={isLeaving}
          className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 shadow-lg transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
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
          className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-lg transition hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {signingOut
            ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            : <LogOut size={14} />
          }
          {signingOut ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </div>
  )
}