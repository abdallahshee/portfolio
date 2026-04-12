import { useState, useEffect } from "react"
import {
  Burger,
  Drawer,
  ScrollArea,
  Button,
  Avatar,
  Menu,
  UnstyledButton,
  Group,
  Skeleton,
  Image,
} from "@mantine/core"
import { Link, useRouter, useRouterState } from "@tanstack/react-router"
import {
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  Settings,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Session, AuthChangeEvent } from "@supabase/supabase-js"

type ThemeMode = "light" | "dark"

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light"
  const stored = window.localStorage.getItem("theme")
  if (stored === "dark") return "dark"
  return "light"
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(mode)
  root.style.colorScheme = mode
  root.setAttribute("data-mantine-color-scheme", mode)
  root.setAttribute("data-theme", mode)
}

export default function Header() {
  const [opened, setOpened] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [isNavigatingAway, setIsNavigatingAway] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [cameFromLogin, setCameFromLogin] = useState(false)

  const isRouterNavigating = useRouterState({
    select: (state) => state.isLoading,
  })

  const currentPath = useRouterState({
    select: (state) => state.resolvedLocation?.pathname,
  })

  // ✅ Detect when navigating away from /account
  // ✅ Detect when on the login page specifically
  useEffect(() => {
    if (currentPath === "/account") {
      setCameFromLogin(true)
    }
  }, [currentPath])

  // ✅ Clear once router finishes navigating away from login
  useEffect(() => {
    if (!isRouterNavigating && cameFromLogin && currentPath !== "/account") {
      setCameFromLogin(false)
    }
  }, [isRouterNavigating, cameFromLogin, currentPath])
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data?.session ?? null)
      setIsSessionLoading(false)
      setHasInitialized(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!mounted) return

        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "TOKEN_REFRESHED"
        ) {
          setIsNavigatingAway(true)
        }

        if (event === "INITIAL_SESSION") {
          setSession(nextSession)
          setIsSessionLoading(false)
          setHasInitialized(true)
          return
        }

        setSession(nextSession)
        setIsSessionLoading(false)
      }
    )

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (!isRouterNavigating && isNavigatingAway) {
      setIsNavigatingAway(false)
    }
  }, [isRouterNavigating, isNavigatingAway])

  const user = session?.user ?? null
  const isAdmin = user?.user_metadata?.role === "admin"

  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  useEffect(() => {
    const initial = getInitialMode()
    setThemeMode(initial)
    applyThemeMode(initial)
    const timeout = setTimeout(() => applyThemeMode(initial), 100)
    return () => clearTimeout(timeout)
  }, [])

  const handleThemeChange = () => {
    const next: ThemeMode = themeMode === "light" ? "dark" : "light"
    setThemeMode(next)
    applyThemeMode(next)
    window.localStorage.setItem("theme", next)
  }

  const handleLogout = async () => {
    setOpened(false)
    setIsNavigatingAway(true)
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

  const handleProfileChange = async () => {
    setOpened(false)

    await router.navigate({ to: "/account/profile/edit" })
  }

  const links = [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/articles" },
    { label: "Contact", to: "/contact" },
  ]

  // ✅ Show skeleton on first load, during auth navigation,
  // and while router is still navigating away from login
  const showSkeleton =
    !hasInitialized ||
    isNavigatingAway ||
    (cameFromLogin && isRouterNavigating)

  const BrandLogo = (
    <Link
      to="/"
      className="flex flex-shrink-0 items-center gap-2.5 no-underline"
    >
      <Image
        src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
        alt="Abdallah logo"
        radius="md"
        w={36}
        h={36}
        fit="cover"
      />
      <span className="text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        Abdallah
      </span>
    </Link>
  )

  const ThemeButton = (
    <UnstyledButton
      onClick={handleThemeChange}
      title={themeMode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      className="flex items-center justify-center rounded-full px-4 pt-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {themeMode === "dark" ? (
        <Moon size={24} className="text-indigo-400" />
      ) : (
        <Sun size={24} className="text-indigo-500" />
      )}
    </UnstyledButton>
  )

  const DesktopUserSkeleton = (
    <Group gap="sm" className="flex-shrink-0">
      <Skeleton height={30} circle />
      <Skeleton height={10} width={80} radius="md" />
    </Group>
  )

  const MobileUserSkeleton = (
    <div className="flex items-center space-x-3">
      <Skeleton height={32} circle />
      <div className="flex-1 space-y-2">
        <Skeleton height={10} width="60%" radius="md" />
        <Skeleton height={8} width="40%" radius="md" />
      </div>
    </div>
  )

  const UserMenu = (
    <Menu shadow="md" width={220} position="bottom-end" radius="md" zIndex={9999}>
      <Menu.Target>
        <UnstyledButton className="min-w-0 max-w-full shrink-0 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800">
          <Group gap="sm" wrap="nowrap" className="min-w-0 px-2 py-1.5">
            <Avatar
              src={user?.user_metadata?.avatar}
              alt={user?.user_metadata?.name}
              radius="md"
              size="sm"
              className="shrink-0"
            />
            <span className="min-w-0 max-w-[100px] truncate text-left text-sm font-semibold leading-tight text-slate-800 sm:max-w-[140px] md:max-w-[200px] lg:max-w-none dark:text-slate-100">
              {user?.user_metadata?.name}
            </span>
            <ChevronDown size={16} className="shrink-0 text-slate-500" />
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

        <Menu.Item
          leftSection={<Settings size={16} className="text-blue-600" />}
          onClick={() => handleProfileChange()}
        >
          Edit Profile
        </Menu.Item>

        <Menu.Item
          leftSection={<LogOut size={16} className="text-red-500" />}
          color="red"
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )

  const AuthButtons = (
    <span className="flex min-w-0 flex-shrink-0 items-center gap-2">
      <Link to="/account" search={{ callbackUrl: "/" }}>
        <Button variant="outline" color="blue" size="sm">
          Sign in
        </Button>
      </Link>
      <Link to="/account/register" search={{ callbackUrl: "/" }}>
        <Button variant="filled" color="blue" size="sm">
          Sign up
        </Button>
      </Link>
    </span>
  )

  return (
    <header className="fixed left-0 top-0 z-[100] h-15 w-full bg-slate-50 shadow-lg dark:bg-slate-700">
      {/* Gradient border bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-[2px]"
        style={{
          background:
            'radial-gradient(ellipse at 60% 20%, rgba(99,102,241,1) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,1) 0%, transparent 50%)',
        }}
      />

      <div className="container mx-auto h-full max-w-full px-3 sm:px-4">
        {/* Mobile: logo | theme + menu */}
        <div className="flex h-full items-center justify-between md:hidden">
          {BrandLogo}
          <div className="flex items-center gap-2">
            {ThemeButton}
            <Burger
              opened={opened}
              onClick={() => setOpened(!opened)}
              size="sm"
              color="#6366f1"
            />
          </div>
        </div>

        {/* Desktop: brand (left) · links (center) · auth/user + theme (right) */}
        <div className="hidden h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-5 gap-y-0 md:grid md:gap-x-7 lg:gap-x-10">
          <div className="flex min-w-0 justify-self-start">
            {BrandLogo}
          </div>

          <nav className="flex max-w-full min-w-0 items-center justify-center gap-2.5 pr-3 md:gap-3 md:pr-6 lg:gap-5 lg:pr-6">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="whitespace-nowrap font-normal text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400"
                activeProps={{ className: "text-blue-600 dark:text-blue-400" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 shrink-0 items-center justify-end justify-self-end gap-2 pl-3 sm:gap-3 md:pl-5 lg:pl-6">
            {ThemeButton}
            {showSkeleton ? DesktopUserSkeleton : user ? UserMenu : AuthButtons}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        padding="md"
        title={
          <div className="flex items-center gap-2.5">
            <Image
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah logo"
              radius="md"
              w={30}
              h={30}
              fit="cover"
            />
            <span className="text-[16px] font-semibold text-slate-800 dark:text-slate-100">
              Abdallah
            </span>
          </div>
        }
        className="md:hidden"
      >
        <ScrollArea style={{ height: "100%" }}>
          <div className="mt-4 flex flex-col space-y-4 text-lg">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-normal text-gray-800 transition hover:text-indigo-500 dark:text-gray-100"
                onClick={() => setOpened(false)}
                activeProps={{ className: "text-indigo-500 dark:text-indigo-400" }}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
              {showSkeleton ? (
                MobileUserSkeleton
              ) : user ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={user?.user_metadata?.avatar}
                      alt={user?.user_metadata?.name}
                      radius="md"
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {user.user_metadata?.name}
                      </div>
                      {isAdmin && (
                        <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          Administrator
                        </div>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <Button
                      variant="light"
                      color="indigo"
                      radius="md"
                      size="sm"
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
                    variant="light"
                    color="blue"
                    radius="md"
                    size="sm"
                    fullWidth
                    leftSection={<Settings size={15} />}
                    onClick={() => handleProfileChange()}
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    color="red"
                    radius="md"
                    size="sm"
                    fullWidth
                    leftSection={<LogOut size={15} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button variant="outline" color="blue" size="sm" fullWidth onClick={handleLogin}>
                    Login
                  </Button>
                  <Button variant="filled" color="blue" size="sm" fullWidth onClick={handleSignup}>
                    Sign Up
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