import {
  Group,
  Stack,
  Anchor,
  SimpleGrid,
  Divider,
  ActionIcon,
  Image,
} from "@mantine/core"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router"

export default function Footer() {
  const router = useRouter()

  return (
    <footer className="mt-10 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 sm:mt-12">
      <div className="container mx-auto w-full max-w-full px-3 py-10 sm:px-4 sm:py-12 md:px-6 md:py-14 lg:px-8">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 'lg', sm: 'xl' }}>
          {/* First Column: Identity */}
          <Stack gap="md">
            <Group align="flex-start" wrap="wrap" gap="sm">
              <Image
                src="/images/profile.png"
                alt="Abdallah Shee"
                w={60}
                h={60}
                radius="sm"
                fit="cover"
                style={{ flexShrink: 0 }}
              />
              <div className="min-w-0 flex-1">
                <div className="title3">
                  Abdallah Shee
                </div>
                <div className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <span className="block sm:inline">Software Developer,</span>{' '}
                  <span className="block sm:inline">Nairobi, Kenya 🇰🇪.</span>
                </div>
              </div>
            </Group>
          </Stack>

          {/* Second Column: Explore */}
          <Stack gap="sm">
            <Anchor component={Link} to="/services" className="transition-colors hover:text-indigo-500">
              Services
            </Anchor>
            <Anchor component={Link} to="/projects" className="transition-colors hover:text-indigo-500">
              Projects
            </Anchor>
            <Anchor component={Link} to="/contact" className="transition-colors hover:text-indigo-500">
              Contact
            </Anchor>
          </Stack>

          {/* Third Column: Contact */}
          <Stack gap="sm">
            <div className="title3">Contact</div>

            <Group gap="xs" wrap="nowrap" align="flex-start" className="min-w-0">
              <Phone size={16} className="mt-0.5 shrink-0 text-slate-500" />
              <span className="min-w-0 break-words text-sm text-slate-800 dark:text-slate-100">
                +254 796 515 302
              </span>
            </Group>

            <Group gap="xs" wrap="nowrap" align="flex-start" className="min-w-0">
              <Mail size={16} className="mt-0.5 shrink-0 text-slate-500" />
              <span className="min-w-0 break-all text-sm text-slate-800 dark:text-slate-100">
                abdallahshee664@email.com
              </span>
            </Group>
          </Stack>

          {/* Fourth Column: Connect */}
          <Stack gap="sm">
            <div className="title3">Connect</div>

            <Group gap="sm">
              <ActionIcon
                component="a"
                href="https://github.com/abdallahshee"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                radius="md"
                size="sm"
              >
                <Github size={18} />
              </ActionIcon>

              <ActionIcon
                component="a"
                href="https://linkedin.com/in/abdallahshee"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                radius="md"
                size="sm"
              >
                <Linkedin size={18} />
              </ActionIcon>

              <ActionIcon
                onClick={() => router.navigate({ to: "/contact" })}
                variant="light"
                radius="md"
                size="sm"
              >
                <Mail size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        </SimpleGrid>

        <Divider my="xl" />

        <Group justify="center" wrap="wrap" gap="sm">
          <p className="px-1 text-center text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Abdallah Shee. All rights reserved.
          </p>
        </Group>
      </div>
    </footer>
  )
}