import {
  Group,
  Stack,
  Anchor,
  Divider,
  ActionIcon,
  Image,
  SimpleGrid,
} from "@mantine/core"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Home,
  Folder,
  BadgeCheck,
} from "lucide-react"
import { Link, linkOptions, useRouter } from "@tanstack/react-router"
import Brand from "./Brand"

const links = linkOptions([
  { label: "Home", to: "/", icon: Home },
  { label: "Skills", to: "/skills", icon: BadgeCheck },
  { label: "Projects", to: "/projects", icon: Folder },
  // { label: "", to: "/skills", icon: Wrench },
])

export default function Footer() {
  const router = useRouter()

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto w-full max-w-full px-4 py-12 sm:px-6 md:px-8 lg:py-16">

        {/* ── TOP SECTION ── */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 'xl', lg: '2xl' }}>

          {/* ── Identity ── */}
          <Stack gap="md">
            <Link to="/" className="inline-block w-fit">
              <Image
                src="/images/profile.jpg"
                alt="Abdallah Shee"
                w={60}
                h={60}
                radius="md"
                fit="cover"
                className="transition-opacity duration-200 hover:opacity-80"
              />
            </Link>
            <Stack gap={4}>
              <Brand />
              {/* <div className="text-sm text-slate-500 dark:text-slate-400">
                Nairobi, Kenya 🇰🇪
              </div> */}
            </Stack>
          </Stack>

          {/* ── Explore ── */}
          <Stack gap="sm">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Explore
            </div>
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Anchor
                  key={link.to}
                  component={Link}
                  to={link.to}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  className="text-sm text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{link.label}</span>
                </Anchor>
              )
            })}
          </Stack>

          {/* ── Contact ── */}
          <Stack gap="sm">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Contacts
            </div>
            <Group gap="xs" wrap="nowrap" align="flex-start" className="min-w-0">
              <Phone size={14} className="mt-0.5 shrink-0 text-indigo-400" />
              <span className="min-w-0 break-words text-sm text-slate-600 dark:text-slate-400">
                +254 796 515 302
              </span>
            </Group>
            <Group gap="xs" wrap="nowrap" align="flex-start" className="min-w-0">
              <Mail size={14} className="mt-0.5 shrink-0 text-indigo-400" />
              <span className="min-w-0 break-all text-sm text-slate-600 dark:text-slate-400">
                abdallahshee664@email.com
              </span>
            </Group>

            <Group gap="xs" mt="xs">
              <ActionIcon
                component="a"
                href="https://github.com/abdallahshee"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                color="dark"
                radius="md"
                size="md"
              >
                <Github size={14} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href="https://linkedin.com/in/abdallahshee"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                color="blue"
                radius="md"
                size="md"
              >
                <Linkedin size={16} />
              </ActionIcon>
              <ActionIcon
                onClick={() => router.navigate({ to: "/connect" })}
                variant="light"
                color="indigo"
                radius="md"
                size="md"
              >
                <Mail size={14} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* ── Availability ── */}
          <Stack gap="sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-green-500" />
              Availability
            </div>
            <p className="text-md leading-relaxed text-slate-600 dark:text-slate-400">
              Open to software developer opportunities.
            </p>
            <Anchor
              component={Link}
              to="/connect"
              className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
            >
              Let's Connect →
            </Anchor>
          </Stack>

        </SimpleGrid>

        <Divider my="xl" />

        {/* ── BOTTOM ── */}
        <Group justify="center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Abdallah Shee. All rights reserved.
          </p>
        </Group>

      </div>
    </footer>
  )
}