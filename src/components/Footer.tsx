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
  Briefcase,
  Folder,
  Wrench,
} from "lucide-react"
import { Link, linkOptions, useRouter } from "@tanstack/react-router"

const links =linkOptions ([
  { label: "Home", to: "/", icon: Home },
  { label: "Services", to: "/services", icon: Briefcase },
  { label: "Projects", to: "/projects", icon: Folder },
  { label: "Tools & Process", to: "/tools-process", icon: Wrench },
  // { label: "Contacts", to: "/contacts", icon: Mail },
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
              <div className="text-base font-bold text-slate-900 dark:text-slate-50">
                Abdallah Shee
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Software Developer
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Nairobi, Kenya 🇰🇪
              </div>
            </Stack>

            {/* Social Icons */}
     
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
              <Phone size={15} className="mt-0.5 shrink-0 text-indigo-400" />
              <span className="min-w-0 break-words text-sm text-slate-600 dark:text-slate-400">
                +254 796 515 302
              </span>
            </Group>
            <Group gap="xs" wrap="nowrap" align="flex-start" className="min-w-0">
              <Mail size={15} className="mt-0.5 shrink-0 text-indigo-400" />
              <span className="min-w-0 break-all text-sm text-slate-600 dark:text-slate-400">
                abdallahshee664@email.com
              </span>
            </Group>
            <Group gap="xs" wrap="nowrap" align="flex-start" className="min-w-0">
              <svg
                viewBox="0 0 24 24"
                width={15}
                height={15}
                fill="currentColor"
                className="mt-0.5 shrink-0 text-blue-400"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              

              <a
                href="https://wa.me/254796515302"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 break-words text-sm text-slate-600 transition-colors hover:text-indigo-500"
              >
                +254 796 515 302
              </a>
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
                <Github size={16} />
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
                onClick={() => router.navigate({ to: "/contacts" })}
                variant="light"
                color="indigo"
                radius="md"
                size="md"
              >
                <Mail size={16} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* ── Availability ── */}
          <Stack gap="sm">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Availability
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Available for work
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Open to freelance projects, contracts, and full-time opportunities.
            </p>
            <Anchor
              component={Link}
              to="/contacts"
              className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400"
            >
              Get in touch →
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