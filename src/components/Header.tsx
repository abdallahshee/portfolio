import { useState, useEffect } from "react"
import {
  Burger,
  Drawer,
  ScrollArea,
  Image,
  UnstyledButton,
  Button,
} from "@mantine/core"
import { Link } from "@tanstack/react-router"
import { Sun, Moon, Briefcase, Home, Folder, Mail } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { createClient } from "@supabase/supabase-js"
import { getCurrentUserQueryOptions } from "@/db/queries/project.queries"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"


type ThemeMode = "light" | "dark"

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light"
  return window.localStorage.getItem("theme") === "dark" ? "dark" : "light"
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(mode)
  root.style.colorScheme = mode
  root.setAttribute("data-mantine-color-scheme", mode)
  root.setAttribute("data-theme", mode)
}

const links = [
  { label: "Home", to: "/", icon: Home },
  { label: "Services", to: "/services", icon: Briefcase },
  { label: "Projects", to: "/projects", icon: Folder },
  { label: "Contact", to: "/contact", icon: Mail },
]

export default function Header() {
  const [opened, setOpened] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  // ✅ Auth state
  const { data: currentUser } = useQuery({
    ...getCurrentUserQueryOptions(),
    retry: false,
  })

  // ✅ Supabase client
  const supabase = getSupabaseBrowserClient()
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/" // simple + reliable redirect
  }

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

  const BrandLogo = (
    <Link to="/" className="flex flex-shrink-0 items-center gap-2.5 no-underline">
      <Image
        src="/images/profile.png"
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

  return (
    <header className="fixed left-0 top-0 z-[100] h-15 w-full border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      {/* Gradient border bottom */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-full"
        style={{
          background:
            "radial-gradient(ellipse at 60% 20%, rgba(99,102,241,1) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(168,85,247,1) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto h-full max-w-full px-3 sm:px-4">
        {/* ── Mobile ── */}
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

        {/* ── Desktop ── */}
        <div className="hidden h-full items-center justify-between md:flex md:gap-x-7 lg:gap-x-10">
          <div className="flex min-w-0 shrink-0">{BrandLogo}</div>

          <div className="flex min-w-0 shrink-0 items-center gap-x-5 md:gap-x-7 lg:gap-x-10">
            {ThemeButton}

            <nav className="flex min-w-0 items-center gap-2.5 md:gap-3 lg:gap-5">
              {links.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center gap-1.5 whitespace-nowrap font-normal text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400"
                    activeProps={{ className: "text-blue-600 dark:text-blue-400" }}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* ✅ Sign Out (Desktop) */}
            {currentUser && (
              <Button
                size="xs"
                radius="md"
                variant="light"
                color="red"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        padding="md"
        title={
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/profile.png"
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
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-3 font-normal text-gray-800 transition hover:text-indigo-500 dark:text-gray-100"
                  onClick={() => setOpened(false)}
                  activeProps={{ className: "text-indigo-500 dark:text-indigo-400" }}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              )
            })}

            {/* ✅ Sign Out (Mobile) */}
            {currentUser && (
              <Button
                fullWidth
                radius="md"
                color="red"
                mt="md"
                onClick={() => {
                  setOpened(false)
                  handleSignOut()
                }}
              >
                Sign Out
              </Button>
            )}
          </div>
        </ScrollArea>
      </Drawer>
    </header>
  )
}