import { useState, useEffect } from "react"
import {
  Burger, Drawer, ScrollArea, Button, Avatar,
  Text, Menu, UnstyledButton, Group, Skeleton,
} from "@mantine/core"
import { Link, useRouter } from "@tanstack/react-router"

import { ChevronDown, LogOut, Sun, Moon, LayoutDashboard } from "lucide-react"
import HireModeBanner from "./HireModeBanner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { hireStatusQueryOptions } from "@/db/queries/utils.queries"

import { authClient } from "@/lib/auth-client"
import { getSessionQueryOption } from "@/lib/auth.functions"

const SETTING_ID = import.meta.env.VITE_HIRE_MODE_ID!

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

export default function Header() {
  const [opened, setOpened] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Use server-prefetched data as initial, authClient for reactivity
  // const { data: prefetchedSession } = useQuery({
  //   ...getSessionQueryOptions(),
  //   staleTime: Infinity,
  // })

  const session = authClient.useSession()

  // const user = clientSession.data?.user ?? prefetchedSession?.user ?? null
  // const isSessionLoading = clientSession.isPending && !prefetchedSession && !clientSession.data
  // const isAdmin = user?.role === "admin"

  // Don't show skeleton at all — just show login buttons while loading
// This prevents the infinite skeleton problem
const user = session.data?.user ?? null
const isAdmin = user?.role === "admin"
const isSessionLoading = false // disable skeleton entirely for now

  const { data: hireData } = useQuery(hireStatusQueryOptions(SETTING_ID))
  const [hireOpen, setHireOpen] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const initial = getInitialMode()
    setThemeMode(initial)
    applyThemeMode(initial)
    const timeout = setTimeout(() => applyThemeMode(initial), 50)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (hireData?.isOpenForHire !== undefined) {
      setHireOpen(hireData.isOpenForHire)
    }
  }, [hireData?.isOpenForHire])

  const handleThemeChange = () => {
    const next: ThemeMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(next)
    applyThemeMode(next)
    window.localStorage.setItem('theme', next)
  }

  const handleLogout = async () => {
    await authClient.signOut()
    await queryClient.invalidateQueries({ queryKey: getSessionQueryOption().queryKey })
    await router.navigate({ to: "/" })
  }

const handleLogin = () => {
  window.location.href = '/account/?callbackUrl=/'
}

const handleSignup = () => {
  router.navigate({
    to: "/account/register",
    search: { callbackUrl: "/" },
  })
}

  const links = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "Articles", to: "/articles" },
    { label: "Contact", to: "/contact" },
  ]

  const ThemeButton = (
    <UnstyledButton
      onClick={handleThemeChange}
      title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className="flex items-center justify-center rounded-full px-4 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {themeMode === 'dark'
        ? <Moon size={28} className="text-indigo-400" />
        : <Sun size={28} className="text-indigo-500" />
      }
    </UnstyledButton>
  )

  return (
    // <header className="fixed left-0 top-0 z-[100] w-full border-b-2 border-b-blue-600 shadow-lg ">
          <header className="fixed left-0 top-0 z-[100] w-full bg-slate-50 dark:bg-slate-700 border-b-2 border-blue-500 shadow-lg ">

      
      <div className="container mx-auto flex items-center justify-between p-4">

        {/* Left — hire mode banner */}
        <div className="flex-shrink-0">
          <HireModeBanner open={hireOpen} />
        </div>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 items-center space-x-6 md:flex">

          {ThemeButton}

          {links.map((link) => (
            <Link key={link.label} to={link.to} className="whitespace-nowrap">
              {link.label}
            </Link>
          ))}

          {isSessionLoading ? (
            <Skeleton height={34} width={120} radius="xl" className="ml-4 flex-shrink-0" />
          ) : user ? (
            <Menu shadow="md" width={220} position="bottom-end" radius="md" zIndex={9999}>
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
              <Link to="/account" search={{callbackUrl:"/"}}>
              <Button variant="outline" color="blue" size="sm" onClick={handleLogin}>
                Sign in
              </Button>
              </Link>
             <Link to="/account/register" search={{callbackUrl:"/"}}>
              <Button variant="filled" color="blue" size="sm" onClick={handleSignup}>
                Sign up
              </Button>
              </Link>
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

                  {/* {isAdmin && ( */}
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
                  {/* )} */}

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