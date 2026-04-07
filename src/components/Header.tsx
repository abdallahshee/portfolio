import { useState, useEffect } from "react"
import {
  Burger, Drawer, ScrollArea, Button, Avatar,
  Text, Menu, UnstyledButton, Group, Skeleton,
} from "@mantine/core"
import { Link, useRouter, useRouterState } from "@tanstack/react-router"
import { ChevronDown, LogOut, Sun, Moon, LayoutDashboard, Settings } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Session, AuthChangeEvent } from "@supabase/supabase-js"

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

function hasStoredSession(): boolean {
  if (typeof window === 'undefined') return false
  return Object.keys(localStorage).some(
    (k) => k.startsWith('sb-') && k.endsWith('-auth-token')
  )
}

export default function Header() {
  const [opened, setOpened] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(() => hasStoredSession())

  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data?.session ?? null)
      setIsSessionLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setIsSessionLoading(false)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const isAdmin = user?.user_metadata?.role === "admin"

  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

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

const handleLogout = async () => {
  setOpened(false)
  await supabase.auth.signOut()
  await router.navigate({ to: "/account", search: { callbackUrl: "/" } })
}

const handleLogin = async () => {
  setOpened(false)
  await router.navigate({ to: "/account", search: { callbackUrl: "/" } })
}

const handleSignup = async () => {
  setOpened(false)
  await router.navigate({ to: "/account/register", search: { callbackUrl: "/" } })
}

  const handleSettings = async (userId: string) => {
    if (isAdmin) {
      setOpened(false)
      await router.navigate({ to: "/admin/users/$userId/edit", params: { userId } })
      return
    }

    await router.navigate({ to: "/$userId/edit", params: { userId } })
  }



  const links = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/articles" },
    { label: "Contact", to: "/contact" },
  ]

  const ThemeButton = (
    <UnstyledButton
      onClick={handleThemeChange}
      title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className="flex items-center justify-center rounded-full px-4 pt-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {themeMode === 'dark'
        ? <Moon size={24} className="text-indigo-400" />
        : <Sun size={24} className="text-indigo-500" />
      }
    </UnstyledButton>
  )

  const UserMenu = (
    <Menu shadow="md" width={220} position="bottom-end" radius="md" zIndex={9999}>
      <Menu.Target>
        <UnstyledButton className="ml-4 flex-shrink-0 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <Group gap="sm" className="px-2 py-1.5">
            <Avatar
              src={user?.user_metadata?.avatar_url}
              alt={user?.user_metadata?.name}
              radius="xl"
              size="sm"
            />
            <Text size="sm" fw={600} className="whitespace-nowrap leading-tight">
              {user?.user_metadata?.name}
            </Text>
            <ChevronDown size={16} className="text-slate-500" />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>

        {isAdmin && (
          <>
            <Menu.Item
              leftSection={<LayoutDashboard size={16} className="text-blue-600" />}
              onClick={() => router.navigate({ to: "/admin" })}
            >
              Admin Dashboard
            </Menu.Item>
            <Menu.Divider />
          </>
        )}

        <Menu.Divider />

        <Menu.Item
          leftSection={<Settings size={16} className="text-blue-600" />}
          onClick={() => handleSettings(user?.id!)}
        >
          Edit Profile
        </Menu.Item>

        <Menu.Item
          leftSection={<LogOut size={16} className="text-blue-600" />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )

  const AuthButtons = (
    <span className="flex flex-shrink-0 items-center gap-2">
      <Link to="/account" search={{ callbackUrl: "/" }}>
        <Button variant="outline" color="blue" size="sm" onClick={handleLogin}>
          Sign in
        </Button>
      </Link>
      <Link to="/account/register" search={{ callbackUrl: "/" }}>
        <Button variant="filled" color="blue" size="sm" onClick={handleSignup}>
          Sign up
        </Button>
      </Link>
    </span>
  )

  return (
    <header className="fixed left-0 top-0 z-[100] h-15 w-full border-b-1 border-green-500 bg-slate-50 shadow-lg dark:bg-slate-700">
      <div className="container mx-auto flex h-full items-center justify-end px-4">
        <nav className="hidden min-w-0 items-center space-x-6 md:flex">
          {ThemeButton}
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="whitespace-nowrap"
              activeProps={{ className: "text-blue-600 font-semibold" }}
            >
              {link.label}
            </Link>
          ))}
          {isSessionLoading ? (
            <Skeleton height={34} width={120} radius="xl" className="ml-4 flex-shrink-0" />
          ) : user ? UserMenu : AuthButtons}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {ThemeButton}
          <Burger opened={opened} onClick={() => setOpened(!opened)} size="sm" color="#6366f1" />
        </div>
      </div>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        padding="md"
        title="Menu"
        className="md:hidden"
      >
        <ScrollArea style={{ height: "100%" }}>
          <div className="mt-4 flex flex-col space-y-4 text-lg">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-gray-800 transition hover:text-indigo-500 dark:text-gray-100"
                onClick={() => setOpened(false)}
                activeProps={{ className: "text-indigo-500 font-semibold dark:text-indigo-400" }}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
              {isSessionLoading ? (
                <Skeleton height={40} radius="xl" />
              ) : user ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100"}
                      alt={user?.user_metadata?.full_name}
                      radius="xl"
                      size="sm"
                    />
                    <div className="flex-1">
                      <Text fw={600} size="sm">{user.user_metadata?.full_name}</Text>
                      {isAdmin && <Text size="xs" c="indigo" fw={500}>Administrator</Text>}
                    </div>
                  </div>

                  {isAdmin && (
                    <Button
                      variant="light"
                      color="indigo"
                      radius="xl"
                      fullWidth
                      leftSection={<LayoutDashboard size={15} />}
                      onClick={() => {
                        router.navigate({ to: "/admin" })
                        setOpened(false)
                      }}
                    >
                      Admin Dashboard
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    color="red"
                    radius="xl"
                    fullWidth
                    leftSection={<LogOut size={15} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button variant="outline" color="blue" size="md" fullWidth onClick={handleLogin}>
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </Drawer>
    </header>
  )
}