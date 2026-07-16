import { useState, useEffect } from "react"
import {
  Burger,
  Drawer,
  ScrollArea,
  Image,
  UnstyledButton,
  Modal,
  Button,
} from "@mantine/core"
import { Link, linkOptions } from "@tanstack/react-router"
import { Sun, Moon, Download } from "lucide-react"
import Brand from "./Brand"

type ThemeMode = "light" | "dark"
const resume = "/abdallah-cv.pdf"
const resumeButtonClasses = `
  flex items-center gap-1
  px-1 py-2
  ml-2
  text-md font-semibold
   dark:!text-white
 text-green-700
 dark:text-white
  cursor-pointer
  transition-all duration-200
`

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "dark"
  return window.localStorage.getItem("theme") === "light" ? "light" : "dark" // ← defaults to dark
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(mode)
  root.style.colorScheme = mode
  root.setAttribute("data-mantine-color-scheme", mode)
  root.setAttribute("data-theme", mode)
}

const links = linkOptions([
  { label: "Home", to: "/" },
  { label: "Skills", to: "/skills" },
  { label: "Connect", to: "/connect" },
  { label: "Projects", to: "/projects" },
  // { label: "Skills", to: "/skills" },
])

export default function Header() {
  const [opened, setOpened] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>("light")
  const [resumeModalOpen, setResumeModalOpen] = useState(false)
  useEffect(() => {
    const initial = getInitialMode()
    setThemeMode(initial)
    applyThemeMode(initial)
    const timeout = setTimeout(() => applyThemeMode(initial), 100)
    return () => clearTimeout(timeout)
  }, [])

  const handleResumeDownload = () => {
    const link = document.createElement("a")
    link.href = resume
    link.download = "Abdallah-Shee-CV.pdf"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setResumeModalOpen(false)
  }
  const handleThemeChange = () => {
    const next: ThemeMode = themeMode === "light" ? "dark" : "light"
    setThemeMode(next)
    applyThemeMode(next)
    window.localStorage.setItem("theme", next)
  }

  const BrandLogo = (
    <div className="flex flex-shrink-0 items-center gap-3">
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <Image
          src="/images/profile.jpg"
          alt="Abdallah Shee"
          radius="md"
          w={36}
          h={36}
          fit="cover"
          className="transition-opacity duration-200 hover:opacity-80"
        />
        <Brand />
      </Link>

      <button
        type="button"
        className={resumeButtonClasses}
        onClick={() => setResumeModalOpen(true)}
      >
        <span className="font-semibold">
          Resume
        </span>

        <Download
          size={24}
          className="shrink-0"
        />
      </button>
    </div>
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
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center gap-1.5 whitespace-nowrap font-normal text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400"
                  activeProps={{ className: "text-blue-600 dark:text-blue-400" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
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
              src="/images/profile.jpg"
              alt="Abdallah Shee"
              radius="md"
              w={30}
              h={30}
              fit="cover"
              className="transition-opacity duration-200 hover:opacity-80"
            />
            <Brand />
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
                className="flex items-center gap-3 font-normal text-gray-800 transition hover:text-indigo-500 dark:text-gray-100"
                onClick={() => setOpened(false)}
                activeProps={{ className: "text-indigo-500 dark:text-indigo-400" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </Drawer>
      <Modal
        opened={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        title="Download Resume"
        centered
        radius="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Would you like to download Abdallah Shee's resume?
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="filled"
              color="red"
              onClick={() => setResumeModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              color="green"
              leftSection={<Download size={16} />}
              onClick={handleResumeDownload}
            >
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  )
}