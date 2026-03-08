import { Container, Text, Anchor, Group } from '@mantine/core';
import { Github, Linkedin, Mail } from 'lucide-react';
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 mt-20">
      <Container size="lg" className="py-12 flex flex-col lg:flex-row justify-between items-center gap-6">

        {/* Left: Copyright */}
        <Text size="sm" color="gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Abdallah Shee. All rights reserved.
        </Text>

        {/* Center: Quick Links */}
        <div className="hidden lg:flex gap-6">
          <Anchor href="#home" className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition">
            Home
          </Anchor>
          <Anchor href="#projects" className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition">
            Projects
          </Anchor>
          <Anchor href="#about" className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition">
            About
          </Anchor>
          <Anchor href="#contact" className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition">
            Contact
          </Anchor>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <Anchor
            href="https://github.com/yourusername"
            target="_blank"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
          >
            <Github size={20} />
          </Anchor>
          <Anchor
            href="https://www.linkedin.com/in/yourusername"
            target="_blank"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
          >
            <Linkedin size={20} />
          </Anchor>
          <Anchor
            href="mailto:youremail@example.com"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
          >
            <Mail size={20} />
          </Anchor>
        </div>
      </Container>
    </footer>
  )
}
