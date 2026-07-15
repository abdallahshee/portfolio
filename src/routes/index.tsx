import BrandHome from '@/components/BrandHome'
import { FeaturedProjectsSection } from '@/components/FeaturedProjects'
import { getTopFeaturedProjectsQueryOptions } from '@/db/queries/project.queries'
import {
  Button,
  Card,
  Group,
  Stack,
  Paper,
  ThemeIcon,
  SimpleGrid
} from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  FolderKanban,
  Database,
  Layout,
  Server,
  Gauge,
  Mail,
  ShieldCheck,
  GitBranch,
} from 'lucide-react'

import { Suspense, useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getTopFeaturedProjectsQueryOptions())
  },
  component: App,
})

// ── TYPEWRITER HOOK ──
type TypingPhase = 'typingName' | 'typingRole' | 'deleting'

function useCoordinatedTyping(
  name: string,
  roleWords: string[],
  {
    nameTypingSpeed = 80,
    roleTypingSpeed = 80,
    namePause = 400,
    rolePause = 1600,
    deletingSpeed = 40,
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
        timeout = setTimeout(
          () => setTypedName(name.slice(0, typedName.length + 1)),
          nameTypingSpeed
        )
      } else {
        // Name fully typed — pause briefly, then start the role
        timeout = setTimeout(() => setPhase('typingRole'), namePause)
      }
    } else if (phase === 'typingRole') {
      if (typedRole.length < currentRole.length) {
        timeout = setTimeout(
          () => setTypedRole(currentRole.slice(0, typedRole.length + 1)),
          roleTypingSpeed
        )
      } else {
        // Role fully typed — hold for a second, then delete both together
        timeout = setTimeout(() => setPhase('deleting'), rolePause)
      }
    } else if (phase === 'deleting') {
      if (typedName.length > 0 || typedRole.length > 0) {
        timeout = setTimeout(() => {
          setTypedName((prev) => prev.slice(0, -1))
          setTypedRole((prev) => prev.slice(0, -1))
        }, deletingSpeed)
      } else {
        // Both fully deleted — move to next role word and start over
        setRoleIndex((i) => i + 1)
        setPhase('typingName')
      }
    }

    return () => clearTimeout(timeout)
  }, [
    phase,
    typedName,
    typedRole,
    roleIndex,
    name,
    roleWords,
    nameTypingSpeed,
    roleTypingSpeed,
    namePause,
    rolePause,
    deletingSpeed,
  ])

  return { typedName, typedRole, phase }
}
// ── SKELETONS ──
function ProjectsSkeleton() {
  return (
    <Stack gap="sm">
      {Array.from({ length: 3 }).map((_, i) => (
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
    icon: <ShieldCheck size={20} />,
    title: 'Testing & Reliability',
    desc: 'Writing tests that catch regressions early, keeping releases stable and shipping with real confidence.',
    color: 'pink',
  },
  {
    icon: <Gauge size={20} />,
    title: 'Performance & Scale',
    desc: 'Production-ready systems optimized through efficient data fetching, caching, and scalable patterns.',
    color: 'orange',
  },
  {
    icon: <GitBranch size={20} />,
    title: 'Collaboration & Workflow',
    desc: 'Comfortable working within existing codebases, git branching workflows, and team code review processes.',
    color: 'grape',
  },
]


const ROLE_WORDS = [
  'Rock-Solid Architecture',
  'Systems That Scale',
  'APIs You Can Trust',
  'Thoughtful, Polished UI/UX',
]

// ── PAGE ──
function App() {
  // const typedText = useTypewriter(ROLE_WORDS)
  // const typedName = typeName(["Abdallah Shee"])
  const { typedName, typedRole } = useCoordinatedTyping("Hi, I'm Abdallah Shee", ROLE_WORDS)
  const { data: projects } = useSuspenseQuery(getTopFeaturedProjectsQueryOptions())
  return (
    <div className="w-full space-y-0 px-0">

      {/* ── HERO + ABOUT (combined) ── */}
      <section className="rounded-3xl bg-slate-950 py-20 lg:py-28">
        <div className="mx-auto px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[4fr_1fr]">

            {/* LEFT SIDE */}
            <div className="max-w-7xl">
              <Stack gap="xl">

                <div>
                  <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                    👋 
                    <span className="bg-linear-to-r from-teal-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                      {typedName}
                    </span>
                  </h1>

                  <div className="mt-3 text-md font-medium text-slate-400 sm:text-2xl">
                    <span className='font-semibold'>Developing{" "}</span>
                    <span className="text-teal-400">
                      {typedRole}
                      <span className="animate-pulse"> |</span>
                    </span>
                  </div>
                </div>

                <p className="max-w-3xl text-lg leading-8 text-slate-400">
                  I'm a Full-Stack Software Developer based in Nairobi, Kenya 🇰🇪,
                  passionate about building scalable web applications that transform
                  complex business requirements into intuitive, reliable digital
                  experiences. From responsive React and Next.js frontends to secure
                  APIs and well-architected databases, I create maintainable software
                  focused on performance, usability, and long-term business value.
                </p>

                <Group gap="md" wrap="wrap" justify="start">
                  <Link to="/projects">
                    <Button
                      size="lg"
                      radius="md"
                      className="bg-linear-to-r from-teal-500 to-blue-500"
                      rightSection={<ArrowRight size={18} />}
                    >
                      View My Projects
                    </Button>
                  </Link>

                  <Link to="/connect">
                    <Button
                      size="lg"
                      radius="md"
                      variant="filled"
                      color="orange"
                      rightSection={<Mail size={18} />}
                    >
                      Connect With Me
                    </Button>
                  </Link>
                </Group>
              </Stack>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-center lg:justify-end">
              <div
                style={{
                  animation: "float-avatar 6s ease-in-out infinite",
                }}
                className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px]"
              >
                <div className="h-full w-full overflow-hidden rounded-full border border-slate-700/50 shadow-2xl">
                  <img
                    src="/images/home.jpg"
                    alt="Abdallah Shee"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Floating Brand Card */}
                <div className="absolute -bottom-6 left-1/2 z-20 w-full -translate-x-1/2">
                  <div className="w-full rounded-2xl px-1 py-3 bg-white backdrop-blur">
                    <BrandHome />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CORE STRENGTHS (technical) ── */}
      <section className="space-y-6 py-6 pt-16">
        <div>
          <div className="title2">Core Strengths</div>
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
      <div className="mx-auto w-full py-6 md:w-3/4 scroll-mt-20">
        <Suspense fallback={<ProjectsSkeleton />}>
          <FeaturedProjectsSection projects={projects} />
        </Suspense>
      </div>

      {/* ── CTA ── */}
      <section id="contact" className="mx-auto w-full scroll-mt-20 py-6">
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
            <Group justify="center" mt="md" wrap="wrap" gap="sm" grow>
              <Link to="/connect" style={{ flex: '0 1 200px' }}>
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
              <Link to="/projects" style={{ flex: '0 1 200px' }}>
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
            </Group>
          </Stack>
        </Paper>
      </section>

    </div>
  )
}