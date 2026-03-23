import { useState, useEffect } from "react"
import {
  Burger, Drawer, ScrollArea, Button, Avatar,
  Text, Menu, UnstyledButton, Group, Skeleton,
} from "@mantine/core"
import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { ChevronDown, LogOut, Sun, Moon, LayoutDashboard, Briefcase } from "lucide-react"
import HireModeBanner from "./HireModeBanner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { hireStatusQueryOptions } from "@/db/queries/utils.queries"
import { toggleHireModeStatus } from "@/server/setting.functions"

const SETTING_ID = import.meta.env.VITE_HIRE_MODE_ID!

type ThemeMode = 'light' | 'dark'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'dark') return 'dark'
  // treat 'auto' and anything else as 'light'
  return 'light'
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.style.colorScheme = mode
  root.setAttribute('data-mantine-color-scheme', mode)
  root.setAttribute('data-theme', mode)

  // Force Mantine to re-read the color scheme
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'theme',
    newValue: mode,
  }))
}

export default function Header() {
  const [opened, setOpened] = useState(false)
  const session = authClient.useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const isSessionLoading = session.isPending
  const isAdmin = session.data?.user?.role === "admin"
  const user = session.data?.user

  const { data } = useQuery(hireStatusQueryOptions(SETTING_ID))
  const [hireOpen, setHireOpen] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

useEffect(() => {
  const initial = getInitialMode()
  setThemeMode(initial)
  applyThemeMode(initial)

  // Re-apply after a tick to override any Mantine hydration reset
  const timeout = setTimeout(() => applyThemeMode(initial), 50)
  return () => clearTimeout(timeout)
}, [])

  const handleThemeChange = () => {
    const next: ThemeMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(next)
    applyThemeMode(next)
    window.localStorage.setItem('theme', next)
  }

  useEffect(() => {
    if (data?.isOpenForHire !== undefined) {
      setHireOpen(data.isOpenForHire)
    }
  }, [data?.isOpenForHire])

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

  const links = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/blogs" },
    { label: "Contact", to: "/contact" },
  ]

  const handleLogout = async () => {
    await authClient.signOut()
    await router.navigate({ to: "/" })
  }

  const handleLogin = () => {
    router.navigate({ to: "/account", search: { callbackUrl: "/" } })
  }

  const handleSignup = () => {
    router.navigate({ to: "/account/register", search: { callbackUrl: "/" } })
  }

  // Theme toggle button — reused in both desktop and mobile
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

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md dark:bg-slate-900">
      <div className="container mx-auto flex items-center justify-between p-4">

        {/* Left — hire mode banner */}
        <div className="flex-shrink-0">
          <HireModeBanner open={hireOpen} />
        </div>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 items-center space-x-6 md:flex">

          {/* Theme toggle — sits before the links */}
          {ThemeButton}

          {links.map((link) => (
            <Link key={link.label} to={link.to} className="whitespace-nowrap">
              {link.label}
            </Link>
          ))}

          {isSessionLoading ? (
            <Skeleton height={34} width={120} radius="xl" className="ml-4 flex-shrink-0" />
          ) : user ? (
            <Menu shadow="md" width={220} position="bottom-end" radius="md">
              <Menu.Target>
                <UnstyledButton className="ml-4 flex-shrink-0 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Group gap="sm" className="px-2 py-1.5">
                    <Avatar
                      src={user.image || "https://i.pravatar.cc/100"}
                      alt={user.name}
                      radius="xl"
                      size="sm"
                    />
                    <Text size="sm" fw={600} className="whitespace-nowrap leading-tight">
                      {user.name}
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
                      leftSection={<LayoutDashboard size={16} className="text-indigo-500" />}
                      onClick={() => router.navigate({ to: "/admin" })}
                    >
                      Admin Dashboard
                    </Menu.Item>

                    <Menu.Divider />
                  </>
                )}

                <Menu.Item
                  color="red"
                  leftSection={<LogOut size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <span className="flex flex-shrink-0 items-center gap-2">
              <Button variant="outline" color="blue" size="sm" onClick={handleLogin}>
                Sign in
              </Button>
              <Button variant="filled" color="blue" size="sm" onClick={handleSignup}>
                Sign up
              </Button>
            </span>
          )}
        </nav>

        {/* Mobile — theme toggle + burger */}
        <div className="flex items-center gap-2 md:hidden">
          {ThemeButton}
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
            color="#6366f1"
          />
        </div>
      </div>

      {/* Mobile drawer */}
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
                      src={user.image || "https://i.pravatar.cc/100"}
                      alt={user.name}
                      radius="xl"
                      size="sm"
                    />
                    <div className="flex-1">
                      <Text fw={600} size="sm">{user.name}</Text>
                      {isAdmin && (
                        <Text size="xs" c="indigo" fw={500}>Administrator</Text>
                      )}
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