import { getTopFeaturedProjectsQueryOptions } from '@/db/queries/project.queries'
import {
  Button,
  Card,
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
  ExternalLink,
  FolderKanban,
  BookOpen,
  Database,
  Layout,
  Server,
  Network,
  Gauge,
  Sparkles,
  Mail,
  BriefcaseBusiness,
  Github
} from 'lucide-react'

import { Suspense } from 'react'


export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getTopFeaturedProjectsQueryOptions())
  },
  component: App,
})

// ── SKELETONS ──
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

// ── PLACEHOLDER — shown on error or empty ──
function ProjectsPlaceholder() {
  return (
    <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
      <Stack gap="md">
        <div>
          <div className="title3">Featured Projects</div>
          <p className="text-sm text-slate-500">A selection of standout builds</p>
        </div>

        <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
          <ThemeIcon size={56} radius="md" variant="light" color="gray">
            <BookOpen size={28} />
          </ThemeIcon>
          <div className="title2 text-slate-400 dark:text-slate-500">
            Projects coming soon
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Featured projects will be added here shortly
          </p>
          <Link to="/services">
            <Button size="sm" variant="light" leftSection={<BriefcaseBusiness size={16} />}>
              See My Skills & Approach
            </Button>
          </Link>
        </div>
      </Stack>
    </Paper>
  )
}


function FeaturedProjectsSection() {
  const { data: projects } = useSuspenseQuery(getTopFeaturedProjectsQueryOptions())
  const router = useRouter()

  const isEmpty = !projects || projects.length === 0

  if (isEmpty) return <ProjectsPlaceholder />

  return (
    <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <div className="title2">Featured Projects</div>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              A curated selection of projects I have built and shipped — each one
              reflecting my approach to writing clean, maintainable, and
              production-ready software.
            </p>
          </div>
          <Link to="/projects">
            <Button variant="filled" size="sm" rightSection={<ArrowRight size={16} />}>
              View All
            </Button>
          </Link>
        </Group>

        <Stack gap="sm">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                project.slug &&
                router.navigate({
                  to: '/projects/$slug/details',
                  params: { slug: project.slug },
                })
              }
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
            >
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  w={48}
                  h={48}
                  radius="md"
                  fit="cover"
                  style={{ flexShrink: 0 }}
                />
              ) : (
                <ThemeIcon
                  size={48}
                  radius="md"
                  variant="light"
                  color="gray"
                  style={{ flexShrink: 0 }}
                >
                  <FolderKanban size={20} />
                </ThemeIcon>
              )}

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 dark:text-slate-50 break-words">
                  {project.title}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {project.githubUrl && (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="filled"
                    color="dark"
                    size="sm"
                    leftSection={<Github size={14} />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Source Code
                  </Button>
                )}

                {project.liveUrl && (
                  <Button
                    component="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="filled"
                    color="green"
                    size="sm"
                    leftSection={<ExternalLink size={14} />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Site
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

// ── STRENGTHS ──
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
    title: 'AI-Assisted Development',
    desc: 'Leverage AI to accelerate development, improve code quality, and enhance product capabilities.',
    color: 'grape',
  },
]

// ── PAGE ──
function App() {
  return (
    <div className="max-w-full space-y-8 px-0 py-6 sm:space-y-10 sm:py-8 md:space-y-12 md:py-10">
      <section className="w-full">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <img
            src="/images/home.jpg"
            alt="Abdallah Shee — Full-Stack Software Developer"
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="h-[160px] w-full cursor-pointer object-cover object-center transition-transform duration-500 hover:scale-[1.02] sm:h-[260px] md:h-[320px] lg:h-[380px]"
          />
        </div>
      </section>

      {/* ── HERO / ABOUT ── */}
      <section id="about" className="grid items-start gap-10 scroll-mt-20 sm:gap-12">
        <div className="grid grid-cols-1">
          <Stack gap="lg" className="w-full pb-2 lg:border-b-0 lg:pb-0">
            <div className="title2">About Me</div>
            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I'm <strong>Abdallah Shee</strong>, a Full-Stack Software Developer based in Nairobi, Kenya 🇰🇪. I specialize in designing, building, and deploying reliable, production-ready web applications, with a strong focus on clean architecture, performance optimization, and user experience. My work spans the full stack — from crafting responsive, accessible interfaces with React and Next.js to building scalable, type-safe APIs and well-structured databases that power real business needs.
            </p>

            <p className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I believe great software should be both practical and dependable — solving real problems for users while supporting business growth and operational efficiency. With hands-on experience across the modern web stack, including React, Next.js, Node.js, and PostgreSQL, I bring a solution-oriented approach to every project I take on, whether independently or as part of a team. I focus on building systems that are not only well-architected, but also maintainable, scalable, and easy to extend throughout their lifecycle.
            </p>
          </Stack>
        </div>
      </section>

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
      <div className="mx-auto w-full md:w-3/4 scroll-mt-20">
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
              Looking for a Full-Stack Developer?
            </div>
            <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I'm actively seeking full-stack software developer opportunities in Nairobi and Mombasa.
              Take a look at what I've built, and let's talk about how I can contribute to your team.
            </p>
            <Group justify="center" mt="md" wrap="wrap" gap="sm">
              <Link to="/contacts">
                <Button variant="filled" color="blue" size="sm" radius="md" leftSection={<Mail size={18} />}>
                  Get In Touch
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