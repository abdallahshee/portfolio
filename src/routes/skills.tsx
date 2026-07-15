import {
  Button,
  Card,
  Group,
  Stack,
  Paper,
  ThemeIcon,
  SimpleGrid,
  List,
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
  CheckCircle,
  MonitorSmartphone,
  Server,
  Database,
  GitBranch,
} from 'lucide-react'

export const Route = createFileRoute('/skills')({
  component: ServicesPage,
})

const CORE_SKILLS = {
  Frontend: {
    color: "#3B82F6",
    icon: MonitorSmartphone,
    skills: [
      'React 19',
      'Next.js 16',
      'Mantine UI',
      'Tailwind CSS',
      'TanStack Router',
    ],
  },


  Backend: {
    color: "#22C55E",
    icon: Server,
    skills: [
      'TypeScript',
      'Python',
      'Express.js',
      'Meteor.js',
      'TanStack Start',
    ],
  },

  Database: {
    color: "#A855F7",
    icon: Database,
    skills: [
      'PostgreSQL',
      'Drizzle ORM',
      'MongoDB',
      'Mongoose',
      'Supabase',
    ],
  },

  DevOps: {
    color: "#F97316",
    icon: GitBranch,
    skills: [
      'Git',
      'CI/CD Pipelines',
      'Serverless',
      'Docker & Containerization',
      'Infrastracture as Code ( aws cdk )',
    ],
  }
}

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
              What I Bring to a Team
            </div>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I'm a full-stack software developer who designs, builds, and ships production systems
              across e-commerce, education, SaaS, and business automation — always starting from a
              clear understanding of the problem, writing clean, maintainable code, and following
              through to a solid handover, whether I'm working solo or as part of a team. Here's a
              closer look at the domains I've built in, and the engineering principles behind each one.
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


      <section className="space-y-6">
        <div>
          <div className="title2">Tech Stack & Technologies</div>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            A modern, production-proven technology stack, chosen deliberately for reliability,
            scalability, developer experience, and long-term maintainability. I lean toward tools
            that stay stable at scale, integrate cleanly with the rest of the system, and don't
            get in the way once a project moves from prototype to production — not trends I'm
            chasing, but a toolkit I trust to hold up over time, project after project, team
            after team.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          {Object.entries(CORE_SKILLS).map(([category, skills]) => (
            <Paper
              key={category}
              withBorder
              color='red'
              radius="lg"
              p="lg"
              className="border-slate-200 bg-white shadow-sm transition-colors group-hover:text-pink-500 duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60"
            >
              <Stack gap="md">
                <Group gap="sm">
                  <ThemeIcon
                    size={36}
                    radius="md"
                    color={skills.color}
                    variant="light"
                  >
                    <skills.icon size={18} />
                  </ThemeIcon>

                  <div className="font-semibold text-slate-900 dark:text-slate-50">
                    {category}
                  </div>
                </Group>

                <Stack gap="xs">
                  {skills.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <CheckCircle
                        size={14}
                        className="shrink-0 text-indigo-500"
                      />

                      <span>{skill}</span>

                    </div>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </section>



      {/* ── EXPERIENCE AREAS ── */}
      <section className="space-y-3">
        <div>
          <div className="title2">Hands-On Experience</div>
          <p className="w-full text-base mb-6 leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
            Real systems I've built and shipped — spanning customer-facing applications,
            internal management platforms, and API-driven services. Each one reflects the
            kind of hands-on experience that comes from navigating real architecture,
            trade-offs, and edge cases in production.
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
              Looking for a Developer Like Me?
            </div>
            <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I'm actively looking for full-stack software developer roles.
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
                onClick={() => router.navigate({ to: '/connect' })}
              >
                Let's Connect
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