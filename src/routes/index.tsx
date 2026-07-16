import BrandHome from '@/components/BrandHome'
import { FeaturedProjectsSection } from '@/components/FeaturedProjects'
import { getTopFeaturedProjectsQueryOptions } from '@/db/queries/project.queries'
import { Button, Card, Paper, ThemeIcon, SimpleGrid } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight, FolderKanban, Database, Layout, Server, Gauge, Mail, ShieldCheck, GitBranch,
} from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getTopFeaturedProjectsQueryOptions())
  },
  component: App,
})

type TypingPhase = 'typingName' | 'typingRole' | 'deleting'

function useCoordinatedTyping(
  name: string,
  roleWords: string[],
  {
    nameTypingSpeed = 80, roleTypingSpeed = 80, namePause = 400, rolePause = 1600, deletingSpeed = 40,
  } = {}
) {
  const [phase, setPhase] = useState<TypingPhase>('typingName')
  const [typedName, setTypedName] = useState('')
  const [typedRole, setTypedRole] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const currentRole = roleWords[roleIndex % roleWords.length]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typingName') {
      if (typedName.length < name.length) {
        timeout = setTimeout(() => setTypedName(name.slice(0, typedName.length + 1)), nameTypingSpeed)
      } else {
        timeout = setTimeout(() => setPhase('typingRole'), namePause)
      }
    } else if (phase === 'typingRole') {
      if (typedRole.length < currentRole.length) {
        timeout = setTimeout(() => setTypedRole(currentRole.slice(0, typedRole.length + 1)), roleTypingSpeed)
      } else {
        timeout = setTimeout(() => setPhase('deleting'), rolePause)
      }
    } else if (phase === 'deleting') {
      if (typedRole.length > 0) {
        timeout = setTimeout(() => {
          setTypedRole((prev) => prev.slice(0, -1))
        }, deletingSpeed)
      } else {
        setRoleIndex((i) => i + 1)
        setPhase('typingRole')
      }
    }

    return () => clearTimeout(timeout)
  }, [phase, typedName, typedRole, roleIndex, name, roleWords, nameTypingSpeed, roleTypingSpeed, namePause, rolePause, deletingSpeed])

  return { typedName, typedRole, phase }
}

function ProjectsSkeleton() {
  return (
    <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
      <div className="flex flex-col gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative h-[220px] overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-[240px]"
            >
              {/* Image placeholder */}
              <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />

              {/* Featured badge */}
              <div className="absolute right-3 top-3 z-10 h-6 w-20 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />

              {/* Content area */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-4">
                {/* Title */}
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />

                {/* Buttons */}
                <div className="flex gap-2">
                  <div className="h-8 w-28 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
              </div>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </Paper>
  )
}

const STRENGTHS = [
  { icon: <Layout size={20} />, title: 'Frontend Development', desc: 'Clean, responsive interfaces with React, Mantine UI, and Tailwind CSS — built for performance and accessibility.', color: 'indigo' },
  { icon: <Server size={20} />, title: 'Backend & APIs', desc: 'Scalable server functions and type-safe APIs focused on clean architecture and reliability.', color: 'blue' },
  { icon: <Database size={20} />, title: 'Database Design', desc: 'Efficient relational schemas with PostgreSQL and Drizzle ORM, optimized queries and solid data modeling.', color: 'teal' },
  { icon: <ShieldCheck size={20} />, title: 'Testing & Reliability', desc: 'Writing tests that catch regressions early, keeping releases stable and shipping with real confidence.', color: 'pink' },
  { icon: <Gauge size={20} />, title: 'Performance & Scale', desc: 'Production-ready systems optimized through efficient data fetching, caching, and scalable patterns.', color: 'orange' },
  { icon: <GitBranch size={20} />, title: 'Collaboration & Workflow', desc: 'Comfortable working within existing codebases, git branching workflows, and team code review processes.', color: 'grape' },
]

const ROLE_WORDS = [
  'Rock-Solid Architecture', 'Systems That Scale', 'APIs You Can Trust', 'Thoughtful, Polished UI/UX',
]

function App() {
  const { typedName, typedRole } = useCoordinatedTyping("Hi, I'm Abdallah Shee", ROLE_WORDS)

  return (
    <div className="w-full space-y-0 px-0">
      {/* HERO + ABOUT */}
      <section className="rounded-none py-10 lg:py-14">
        <div className="mx-auto px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[4fr_1fr]">
            <div className="max-w-7xl">
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                    👋{" "}
                    <span className="bg-linear-to-r from-teal-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                      {typedName}
                    </span>
                  </h1>

                  <p className="mt-3 text-base font-semibold text-slate-400 sm:text-2xl">
                    <span className="font-semibold">For </span>
                    <span className="text-green-700 dark:text-white">
                      {typedRole}
                      <span className="animate-pulse"> |</span>
                    </span>
                  </p>
                </div>

                <p className="max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
                  I'm a Full-Stack Software Developer based in Nairobi, Kenya 🇰🇪,
                  passionate about building scalable web applications that transform
                  complex business requirements into intuitive, reliable digital
                  experiences. From responsive React and Next.js frontends to secure
                  APIs and well-architected databases, I create maintainable software
                  focused on performance, usability, and long-term business value.
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                  <Link to="/projects" className="w-full sm:w-48">
                    <Button
                      size="md"
                      radius="sm"
                      fullWidth
                      className="bg-linear-to-r from-teal-500 to-blue-500"
                      rightSection={<ArrowRight size={18} />}
                    >
                      My Projects
                    </Button>
                  </Link>

                  <Link to="/connect" className="w-full sm:w-48">
                    <Button
                      size="md"
                      radius="sm"
                      fullWidth
                      variant="filled"
                      color="orange"
                      rightSection={<Mail size={18} />}
                    >
                      Let's Connect
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div style={{ animation: "float-avatar 6s ease-in-out infinite" }} className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px]">
                <div className="h-full w-full overflow-hidden rounded-full border border-slate-700/50 shadow-2xl">
                  <img src="/images/home.jpg" alt="Abdallah Shee" className="h-full w-full object-cover" />
                </div>
                <div className="absolute -bottom-6 left-1/2 z-20 w-full -translate-x-1/2">
                  <div className="w-full rounded-xl  bg-green-700 px-0 py-3 backdrop-blur">
                    <BrandHome />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE STRENGTHS */}
      <section className="space-y-6 py-6 pt-16">
        <div>
          <h2 className="title2">Core Strengths</h2>
          <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            The technical areas where I consistently deliver the most impact and value — not
            a checklist of buzzwords, but the parts of a project I actually get hands-on with
            from day one: structuring the frontend, designing the data layer, and making sure
            what ships holds up once real users start relying on it.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {STRENGTHS.map((strength) => (
            <Card key={strength.title} withBorder p="lg" radius="lg" className="shadow-sm">
              <div className="flex items-start gap-3">
                <ThemeIcon variant="light" color={strength.color} radius="md" size="lg">
                  {strength.icon}
                </ThemeIcon>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="font-bold text-slate-900 dark:text-slate-50">{strength.title}</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{strength.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* FEATURED PROJECTS */}
      <div className="mx-auto w-full scroll-mt-20 py-6 md:w-3/4">
        <Suspense fallback={<ProjectsSkeleton />}>
          <FeaturedProjectsSection />
        </Suspense>
      </div>

      {/* CTA */}
      <section id="contact" className="mx-auto w-full scroll-mt-20 py-6">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <div className="flex flex-col items-center gap-4">
            <h2 className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-center text-transparent">
              Looking for a Full-Stack Developer?
            </h2>
            <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              I'm actively seeking full-stack software developer opportunities in Nairobi and Mombasa.
              Take a look at what I've built, and let's talk about how I can contribute to your team.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/connect"
                className="w-full sm:min-w-[200px] sm:flex-1"
              >
                <Button
                  variant="filled"
                  color="orange"
                  size="sm"
                  radius="sm"
                  leftSection={<Mail size={18} />}
                  fullWidth
                >
                  Let's Connect
                </Button>
              </Link>

              <Link
                to="/projects"
                className="w-full sm:min-w-[200px] sm:flex-1"
              >
                <Button
                  variant="outline"
                  color="blue"
                  size="sm"
                  radius="sm"
                  leftSection={<FolderKanban size={18} />}
                  fullWidth
                >
                  View Projects
                </Button>
              </Link>
            </div>
          </div>
        </Paper>
      </section>
    </div>
  )
}