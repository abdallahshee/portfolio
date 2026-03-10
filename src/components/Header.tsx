import { useState } from 'react';
import { Burger, Drawer, ScrollArea } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export default function Header() {
    const [opened, setOpened] = useState(false);

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 shadow-md mb-40">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo / Name */}
        <div className="text-2xl font-bold text-indigo-600 cursor-pointer">
          Abdallah Shee
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
            >
              {link.label}
            </Link>
          ))}
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
          </div>
        </ScrollArea>
      </Drawer>
    </header>
  )
}
