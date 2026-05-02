
import { getTopProjectsQueryOptions } from '@/db/queries/project.queries'
import {
  Badge,
  Button,
  Card,
  Container,
  Table,
  Image,
  Group,
  Stack,
  Paper,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowRight,
  Linkedin,
  FolderKanban,
  BookOpen,
  Briefcase,
  Users,
  Database,
  Layout,
  Server,
  Network,
  Gauge,
  Sparkles,
  Mail,
  BriefcaseBusiness,
} from 'lucide-react'
import moment from 'moment'
import { Suspense } from 'react'


export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getTopProjectsQueryOptions())
  },
  component: App,
})

function ProjectsSkeleton() {
  return (
    <Stack gap="sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-md" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </Stack>
  )
}



function FeaturedProjectsSection() {
  const { data: projects } = useSuspenseQuery(getTopProjectsQueryOptions())
  const router = useRouter()

  const isEmpty = !projects || projects.length === 0
  return (
    <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
      <Stack gap="md">
        <Group justify="space-between" align="flex-end">
          <div>
            <div className="title3">Featured Projects</div>
            <p className="text-sm text-slate-500">
              A selection of standout builds
            </p>
          </div>

          {!isEmpty &&
            <Link to="/projects">
              <Button
                variant="subtle"
                size="sm"
                rightSection={<ArrowRight size={16} />}
              >
                View All
              </Button>
            </Link>}
        </Group>

        <div className="-mx-1 overflow-x-auto sm:mx-0">
          {isEmpty ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
              <ThemeIcon size={56} radius="md" variant="light" color="gray">
                <BookOpen size={28} />
              </ThemeIcon>

              <div className="title2 text-slate-400 dark:text-slate-500">
                No projects yet!
              </div>

              <p className="title3 text-slate-400 dark:text-slate-500">
                Featured projects will be added soon
              </p>

              <Link to="/services">
                <Button size="sm" variant="light" leftSection={<BriefcaseBusiness size={16} />}>
                  See My Services
                </Button>
              </Link>
            </div>
          ) : (
            <Table highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Project</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {projects.map((project) => (
                  <Table.Tr
                    key={project.id}
                    onClick={() =>
                      router.navigate({
                        to: '/projects/$slug/details',
                        params: { slug: project?.slug! },
                      })
                    }
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <Table.Td>
                      <Group gap="sm">
                        {project.imageUrl ? (
                          <Image src={project.imageUrl} w={46} h={46} radius="md" />
                        ) : (
                          <ThemeIcon size={46} radius="md" variant="light">
                            <FolderKanban size={20} />
                          </ThemeIcon>
                        )}
                        <div className="font-semibold truncate">{project.title}</div>
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        variant="light"
                        color={project.isPublic ? 'teal' : 'gray'}
                        radius="md"
                        size="sm"
                      >
                        {project.isPublic ? 'Open Source' : 'Private'}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {moment(project.createdAt).format("DDD- MM-YYYY")}

                      </span>
                    </Table.Td>

                    <Table.Td w={60}>
                      <span className="text-blue-600 font-semibold">View</span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
      </Stack>
    </Paper>
  )
}



const STATS = [
  { icon: <Briefcase size={18} />, value: '4+', label: 'Years Experience', color: 'indigo' },
  { icon: <FolderKanban size={18} />, value: '12+', label: 'Projects Delivered', color: 'blue' },
  { icon: <Users size={18} />, value: '10+', label: 'Happy Clients', color: 'green' },
  // { icon: <Star size={18} />, value: '100%', label: 'On-Time Delivery', color: 'yellow' },
]

const STRENGTHS = [
  {
    icon: <Layout size={20} />,
    title: 'Frontend Development',
    desc: 'Clean, responsive interfaces with React, Mantine UI, and Tailwind CSS — built for performance and accessibility.',
    color: 'indigo',
  },
  {
    icon: <Server size={20} />,
    title: 'Backend & APIs',
    desc: 'Scalable server functions and type-safe APIs focused on clean architecture and reliability.',
    color: 'blue',
  },
  {
    icon: <Database size={20} />,
    title: 'Database Design',
    desc: 'Efficient relational schemas with PostgreSQL and Drizzle ORM, optimized queries and solid data modeling.',
    color: 'teal',
  },
  {
    icon: <Network size={20} />,
    title: 'System Design',
    desc: 'Scalable, maintainable systems built through thoughtful architecture and practical engineering decisions.',
    color: 'pink',
  },
  {
    icon: <Gauge size={20} />,
    title: 'Performance & Scale',
    desc: 'Production-ready systems optimized through efficient data fetching, caching, and scalable patterns.',
    color: 'orange',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'AI-Augmented Development',
    desc: 'Leverage AI to accelerate development, improve code quality, and enhance product capabilities.',
    color: 'grape',
  },
]



function App() {

  return (
    <div className="max-w-full space-y-8 px-0 py-6 sm:space-y-10 sm:py-8 md:space-y-12 md:py-10">

      {/* ── HERO + ABOUT grouped with smaller gap ── */}
      <div className="space-y-6 sm:space-y-8">

        {/* ── HERO ── */}
        <section className="grid items-center gap-10 sm:gap-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_1fr] lg:gap-14">

            {/* LEFT */}
            <div id="left" className="flex flex-col gap-6 w-full">
              <div className="heading w-full">
                Scalable & Maintainable Software
              </div>

              <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
                I build mobile-first, responsive digital products focused on architecture,
                maintainability, performance, and user experience — turning complex ideas into reliable,
                production-ready applications. From planning and design to deployment, I ensure every
                solution is structured for scalability and long-term success. Whether you're a startup
                or an established business scaling up, I bring the technical depth to deliver software
                that works — and keeps working.
              </p>

              <div className="grid w-full gap-y-4 border-b border-blue-400 py-2 grid-cols-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col text-start">
                    <span className="title2 stat text-slate-900 dark:text-slate-50">
                      {stat.value}
                    </span>
                    <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — responsive image */}
            {/* RIGHT — responsive image */}
            <div id="right" className="order-first w-full lg:order-last">
              <div className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none">
                <div
                  className="group relative w-full overflow-hidden rounded-xl shadow-xl"
                  style={{
                    aspectRatio: '3 / 3',
                    isolation: 'isolate',
                    willChange: 'transform',
                    borderRadius: '0.75rem',
                    WebkitMaskImage: 'radial-gradient(white, black)',
                  }}
                >
                  <img
                    src="/images/profile.jpg"
                    alt="Abdallah Shee"
                    className="absolute inset-0 h-full w-full rounded-xl object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onClick={() => { window.location.hash = 'about' }}
                  />

                  {/* ── OVERLAY ── */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* ── LABEL ── */}
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold tracking-widest text-white/90">
                      Software Developer
                    </span>
                    <span className="h-[2px] w-10 rounded-full bg-gradient-to-r from-blue-400 via-teal-400 to-green-400" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="scroll-mt-24">
          <Stack gap="lg" className="w-full border-b-2 border-blue-400 pb-6 lg:border-b-0 lg:pb-0">
            <div className="title2">About Me</div>

            <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I'm <strong>Abdallah Shee</strong>, a software developer based in Nairobi, Kenya 🇰🇪.
              I help businesses and startups turn ideas into reliable digital products — platforms,
              systems, or custom solutions tailored to their needs. With expertise across frontend
              and backend, I cover everything from planning and design to deployment.
            </p>

            <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I focus on building systems that are simple, efficient, and built to grow. Good software
              should feel effortless — solving real problems and working smoothly long after launch.
              Whatever you're building, I'm here to make sure it's done right.
            </p>
          </Stack>
        </section>

      </div>

      {/* ── STRENGTHS ── */}
      <section className="space-y-6">
        <div>
          <div className="title2">Core Strengths</div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            The areas where I consistently deliver the most impact and value.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {STRENGTHS.map((strength) => (
            <Card key={strength.title} withBorder p="lg" radius="lg" className="shadow-sm">
              <Group gap="md" align="flex-start">
                <ThemeIcon variant="light" color={strength.color} radius="md" size="lg">
                  {strength.icon}
                </ThemeIcon>
                <Stack gap={4} className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-slate-50">{strength.title}</div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {strength.desc}
                  </p>
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <div className="mx-auto w-full scroll-mt-20">
        <Suspense fallback={<ProjectsSkeleton />}>
          <FeaturedProjectsSection />
        </Suspense>
      </div>

      {/* ── CTA ── */}
      <section id="contact" className="mx-auto w-full scroll-mt-20">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <Stack align="center" gap="md">
            <div className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent text-center">
              Have an idea or project in mind?
            </div>
            <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              Whether you're starting from scratch or improving an existing system, I can help you
              design and build something reliable, scalable, and easy to use — tailored to your goals and users.
            </p>
            <Group justify="center" mt="md" wrap="wrap" gap="sm">
              <Link to="/contacts">
                <Button variant="filled" color="blue" size="sm" radius="md" leftSection={<Mail size={18} />}>
                  Let's Discuss it
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" color="blue" size="sm" radius="md" leftSection={<FolderKanban size={18} />}>
                  View My Work
                </Button>
              </Link>
            </Group>
          </Stack>
        </Paper>
      </section>

    </div>
  )
}