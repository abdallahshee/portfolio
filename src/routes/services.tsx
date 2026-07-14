import {
  Button,
  Card,
  Group,
  Stack,
  Paper,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Mail,
  ShoppingCart,
  GraduationCap,
  CalendarClock,
  Globe,
  Cpu,
  Plug,
  FolderKanban,
} from 'lucide-react'

export const Route = createFileRoute('/services')({
  component: ServicesPage,
})

const EXPERIENCE_AREAS = [
  {
    icon: <ShoppingCart size={24} />,
    title: 'E-Commerce Platforms',
    desc: 'Built full-featured online stores with product management, cart, checkout, payments (M-Pesa, Stripe), order tracking, inventory control, and admin dashboards.',
    color: 'orange',
  },
  {
    icon: <GraduationCap size={24} />,
    title: 'School Management Systems',
    desc: 'Built comprehensive platforms for schools and colleges — student enrollment, fee management, timetabling, attendance tracking, exam results, teacher portals, and parent communication dashboards.',
    color: 'violet',
  },
  {
    icon: <CalendarClock size={24} />,
    title: 'Booking & Scheduling Apps',
    desc: 'Built smart appointment and reservation systems for clinics, salons, hotels, and service businesses — with calendar sync, automated reminders, staff scheduling, and online payments.',
    color: 'cyan',
  },
  {
    icon: <Globe size={24} />,
    title: 'Portals & SaaS Products',
    desc: 'Built multi-tenant SaaS products and web portals with role-based access control, subscription billing, onboarding flows, usage analytics, and scalable multi-organization architecture.',
    color: 'indigo',
  },
  {
    icon: <Cpu size={24} />,
    title: 'Custom Software Solutions',
    desc: 'Designed and built bespoke web applications around complex, non-standard workflows — from process automation to internal tooling.',
    color: 'grape',
  },
  {
    icon: <Plug size={24} />,
    title: 'API & System Integrations',
    desc: 'Integrated third-party services like payment gateways (M-Pesa, Stripe), SMS/email providers, CRMs, and accounting tools — ensuring reliable data flow between systems.',
    color: 'blue',
  },
]

function ServicesPage() {
  const router = useRouter()

  return (
    <div className="max-w-full space-y-10 px-0 py-6 sm:space-y-12 sm:py-8 md:space-y-16 md:py-10">
      {/* ── HERO ── */}
      <section className="grid items-start gap-10 sm:gap-12">
        <div className="lg:gap-14">
          <Stack gap="lg" className="w-full lg:border-b-0 lg:pb-0">
            <div className="heading">
              What I Bring to a Development Team
            </div>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I'm a full-stack software developer who has designed, built, and shipped production
              systems across e-commerce, education, SaaS, and business automation. I focus on
              writing clean, maintainable code, making sound architectural decisions early, and
              building software that holds up under real-world use — not just demos.
            </p>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              Below are the domains I have hands-on experience building in, along with the
              engineering principles I bring to every codebase I touch, whether working solo or
              as part of a team.
            </p>

            {/* FEATURE CARDS */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" className="pt-4">
              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Scalable Systems
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    I design systems to grow smoothly with increasing users, data, and complexity.
                  </p>
                </div>
              </Paper>

              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Impact-Driven
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    I build with the underlying business problem in mind, not just the ticket in front of me.
                  </p>
                </div>
              </Paper>

              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Responsive Design
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    I build interfaces that work well across desktop, tablet, and mobile from day one.
                  </p>
                </div>
              </Paper>

              <Paper
                withBorder
                radius="md"
                p="lg"
                className="group flex h-full flex-col justify-between border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="text-base font-semibold text-slate-900 transition-colors group-hover:text-pink-500 dark:text-slate-50">
                    Secure by Default
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    I follow modern security practices and reliable data protection standards as a baseline, not an afterthought.
                  </p>
                </div>
              </Paper>
            </SimpleGrid>
          </Stack>
        </div>
      </section>

      {/* ── EXPERIENCE AREAS ── */}
      <section className="space-y-3">
        <div>
          <div className="title2">Domains I've Built In</div>
          <p className="w-full text-base mb-6 leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
            Real problems I've solved through code — spanning customer-facing applications,
            internal management systems, and API-driven platforms. Each one reflects practical
            experience with the architecture, trade-offs, and edge cases that come with shipping
            real software.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {EXPERIENCE_AREAS.map((area) => (
            <Card
              key={area.title}
              radius="md"
              withBorder
              p="lg"
              className="group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <Stack gap="md" h="100%">
                <Group className="min-w-0 items-start gap-3" wrap="nowrap">
                  <ThemeIcon
                    variant="light"
                    color={area.color}
                    radius="md"
                    size={42}
                    className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                  >
                    {area.icon}
                  </ThemeIcon>
                  <div className="min-w-0 font-bold text-slate-900 dark:text-slate-50">{area.title}</div>
                </Group>
                <Stack gap={4} className="min-w-0 flex-1">
                  <p className="text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">{area.desc}</p>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="mx-auto w-full scroll-mt-20">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <Stack align="center" gap="md">
            <div className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Looking for a Developer Like This on Your Team?
            </div>
            <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I'm actively looking for full-stack software developer roles in Nairobi and Mombasa.
              Reach out and let's talk about how my experience fits what you're building.
            </p>
            <Group justify="center" mt="md" wrap="wrap" gap="sm">
              <Button
                className="min-w-[200px] justify-center"
                variant="filled"
                color="blue"
                size="sm"
                radius="md"
                leftSection={<Mail size={18} />}
                onClick={() => router.navigate({ to: '/contacts' })}
              >
                Get In Touch
              </Button>

              <Link to="/projects">
                <Button
                  className="min-w-[200px] justify-center"
                  variant="outline"
                  color="blue"
                  size="sm"
                  radius="md"
                  leftSection={<FolderKanban size={18} />}
                >
                  Explore My Projects
                </Button>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </section>
    </div>
  )
}