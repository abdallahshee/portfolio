import { useState } from "react"
import {
  Burger,
  Drawer,
  ScrollArea,
  Button,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Group,
  Skeleton,
} from "@mantine/core"
import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth-client"
import { ChevronDown, LogOut, Sun, LayoutDashboard } from "lucide-react"

export default function Header() {
  const [opened, setOpened] = useState(false)
  const session = authClient.useSession()
  const router = useRouter()

  const isSessionLoading = session.isPending
  const isAdmin = session.data?.user?.role === "admin"
  const user = session.data?.user

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

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md dark:bg-slate-900">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="cursor-pointer text-md font-bold text-indigo-600">
          Abdallah Shee
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center space-x-6 md:flex">
          {links.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}

          {/* ✅ Auth inline — no nested component */}
          {isSessionLoading ? (
            <Skeleton height={34} width={120} radius="xl" className="ml-4" />
          ) : user ? (
            <Menu shadow="md" width={220} position="bottom-end" radius="md">
              <Menu.Target>
                <UnstyledButton className="ml-4 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Group gap="sm" className="px-2 py-1.5">
                    <Avatar
                      src={user.image || "https://i.pravatar.cc/100"}
                      alt={user.name}
                      radius="xl"
                      size="sm"
                    />
                    <Text size="sm" fw={600} className="leading-tight">
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
                    // onClick={() => router.navigate({ to: "/admin" })}
                    >
                      Admin Dashboard
                    </Menu.Item>
                    <Menu.Divider />
                  </>
                )}

                <Menu.Item leftSection={<Sun size={16} className="text-indigo-500" />}>
                  Dark Mode
                </Menu.Item>

                <Menu.Divider />

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
            <span>
              <Button
                variant="outline"
                color="blue"
                size="sm"
                onClick={handleLogin}
                className="ml-4"
              >
                Sign in
              </Button>
              <Button
                variant="filled"
                color="blue"
                size="sm"
                onClick={handleSignup}
                className="ml-4"
              >
                Sign up
              </Button>
            </span>
          )}
        </nav>

        {/* Mobile burger */}
        <div className="md:hidden">
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
                        // router.navigate({ to: "/admin" })
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
                <Button variant="outline" color="blue" size="md" fullWidth onClick={handleLogin}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </Drawer>
    </header>
  )
}