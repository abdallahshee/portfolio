import { useState } from 'react';
import { Burger, Drawer, ScrollArea, Button, Avatar, Text } from '@mantine/core';
import { Link, useRouter } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { toggleHireModeStatus } from "@/server/setting.functions"
import { hireStatusQueryOptions } from "@/queries/utils.queries"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const SETTING_ID = import.meta.env.VITE_HIRE_MODE_ID

export default function Header() {
  const [opened, setOpened] = useState(false);
  const session = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient()
  const [toggleLoading, setToggleLoading] = useState(false)

  const { data, isLoading } = useQuery(hireStatusQueryOptions(SETTING_ID))
  const isAdmin = session.data?.user?.role === "admin"
  const open = data?.isOpenForHire ?? false

  const handleToggle = async () => {
    try {
      setToggleLoading(true)
      const result = await toggleHireModeStatus({ data: { settingId: SETTING_ID } })
      queryClient.setQueryData(hireStatusQueryOptions(SETTING_ID).queryKey, {
        isOpenForHire: result.isOpenForHire,
      })
    } finally {
      setToggleLoading(false)
    }
  }

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Blog', to: '/blogs' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    await router.navigate({ to: "/" })
  };

  const handleLogin = async () => {
    router.navigate({ to: '/account', search: { callbackUrl: '/' } });
  };

  // Hire mode badge shown inline in header
  const HireBadge = () => {
    if (isLoading) return null

    return (
      <div className="flex items-center gap-2">
        {/* Visible to everyone when on */}
        {open && (
          <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 dark:border-green-800 dark:bg-green-950">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <Text size="md" fw={500} c="green.7" className="hidd sm:block whitespace-nowrap">
              Open for hire
            </Text>
          </div>
        )}

        {/* Toggle button — admin only */}
        {isAdmin && (
          <Button
            size="xs"
            radius="xl"
            variant="light"
            color={open ? "red" : "green"}
            loading={toggleLoading}
            onClick={handleToggle}
            className="whitespace-nowrap"
          >
            {toggleLoading ? "Updating…" : open ? "Disable" : "Enable Hire Mode"}
          </Button>
        )}
      </div>
    )
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">

        {/* Left — Logo + Hire badge */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-indigo-600 cursor-pointer">
            Abdallah Shee
          </div>
          <HireBadge />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}

          {/* Auth / Avatar */}
          {session.data?.user ? (
            <div className="flex items-center space-x-4 ml-4">
              <Avatar
                src="https://i.pravatar.cc/100"
                alt={session.data.user.name}
                radius="xl"
                size="sm"
              />
              <Button
                variant="outline"
                color="red"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              color="blue"
              size="sm"
              onClick={handleLogin}
              className="ml-4"
            >
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Burger */}
        <div className="md:hidden">
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
            color="#6366f1"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        padding="md"
        title="Menu"
        className="md:hidden"
      >
        <ScrollArea style={{ height: '100%' }}>
          <div className="flex flex-col space-y-4 mt-4 text-lg">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-gray-800 dark:text-gray-100 hover:text-indigo-500 transition"
                onClick={() => setOpened(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Hire mode in mobile drawer */}
            {!isLoading && (
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                {open && (
                  <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 dark:border-green-800 dark:bg-green-950">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <Text size="xs" fw={500} c="green.7">
                      Open for hire
                    </Text>
                  </div>
                )}
                {isAdmin && (
                  <Button
                    size="xs"
                    radius="xl"
                    variant="light"
                    color={open ? "red" : "green"}
                    loading={toggleLoading}
                    onClick={handleToggle}
                  >
                    {toggleLoading ? "Updating…" : open ? "Disable" : "Enable Hire Mode"}
                  </Button>
                )}
              </div>
            )}

            {session.data?.user ? (
              <div className="flex items-center space-x-4 mt-4">
                <Avatar
                  src={session.data.user.image}
                  alt={session.data.user.name}
                  radius="xl"
                  size="sm"
                />
                <Button variant="outline" color="red" size="md" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" color="blue" size="md" onClick={handleLogin} className="mt-4">
                Login
              </Button>
            )}
          </div>
        </ScrollArea>
      </Drawer>
    </header>
  );
}