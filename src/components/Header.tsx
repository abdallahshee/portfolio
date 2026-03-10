import { useState } from 'react';
import { Burger, Drawer, ScrollArea, Button, Avatar } from '@mantine/core';
import { Link, useRouter } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export default function Header() {
  const [opened, setOpened] = useState(false);
  const session = authClient.useSession();
  const router = useRouter();

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
  
    { label: 'Contact', to: '/contact' },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleLogin = async () => {
    router.navigate({ 
      to: '/account',
      search: { callbackUrl: '/' },
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 shadow-md mb-40">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo / Name */}
        <div className="text-2xl font-bold text-indigo-600 cursor-pointer">
          Abdallah Shee
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
            >
              {link.label}
            </Link>
          ))}

          {/* Auth / Avatar */}
          {session.data?.session.userId ? (
            <div className="flex items-center space-x-4 ml-4">
              {/* Avatar */}
              <Avatar
                src={session.data.user.image }
                alt={session.data.user.name }
                radius="xl"
                size="sm"
              />
              {/* Logout Button */}
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

        {/* Mobile Burger Menu */}
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

            {session.data?.session.userId ? (
              <div className="flex items-center space-x-4 mt-4">
                <Avatar
                  src={session.data.user.image || undefined}
                  alt={session.data.user.name || 'User'}
                  radius="xl"
                  size="sm"
                />
                <Button
                  variant="outline"
                  color="red"
                  size="md"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                color="blue"
                size="md"
                onClick={handleLogin}
                className="mt-4"
              >
                Login
              </Button>
            )}
          </div>
        </ScrollArea>
      </Drawer>
    </header>
  );
}