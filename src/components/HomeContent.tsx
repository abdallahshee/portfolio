'use client'

import BrandHome from '@/components/BrandHome'
import { Button, Paper, ThemeIcon } from '@mantine/core'
import Link from 'next/link'
import {
  ArrowRight, FolderKanban, Mail,
  CheckCircle,
  MonitorSmartphone,
  Server,
  GitBranch,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

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

const CORE_SKILLS = {
  Frontend: {
    color: "#3B82F6",
    icon: MonitorSmartphone,
    skills: ["TypeScript", "React 19", "Zustand", "NextJS (App Router)", "Tailwind CSS"],
  },
  Backend: {
    color: "#22C55E",
    icon: Server,
    skills: ["TypeScript", "REST APIs", "Supabase", "Python (FastAPI)", "PostgreSQL"],
  },
  DevOps: {
    color: "#F97316",
    icon: GitBranch,
    skills: [
      "Docker & Containerization",
      "Git & GitHub",
      "Vercel Deployment Pipelines",
      "AWS Lambda (Serverless)",
    ],
  },
}

const ROLE_WORDS = [
  'Rock-Solid Architecture', 'Systems That Scale', 'APIs You Can Trust', 'Thoughtful, Polished UI/UX',
]

export default function HomeContent({ children }: { children: ReactNode }) {
  const { typedName, typedRole } = useCoordinatedTyping("Turning Complexity to Clarity", ROLE_WORDS)

  return (
    <div className="w-full space-y-12 sm:space-y-14 md:space-y-16">
      {/* HERO */}
      <section className="pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-[4fr_1fr] lg:gap-6">
          <div className="max-w-7xl">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
                
                  <span className="bg-linear-to-r from-teal-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                    {typedName}
                  </span>
                </h3>

                <p className="mt-3 text-base font-semibold text-slate-600 sm:text-2xl dark:text-slate-400">
                  <span className="font-semibold">For </span>
                  <span className="text-green-700 dark:text-white">
                    {typedRole}
                    <span className="animate-pulse"> |</span>
                  </span>
                </p>
              </div>

              <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                I'm a Full-Stack Software Developer based in Nairobi, Kenya 🇰🇪,
                passionate about building scalable web applications that transform
                complex business requirements into intuitive, reliable digital
                experiences. From responsive React and Next.js frontends to secure
                APIs and well-architected databases, I create maintainable software
                focused on performance, usability, and long-term business value.
              </p>

              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <Link href="/#projects" className="w-full sm:w-48">
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

                <Link href="/connect" className="w-full sm:w-48">
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
            <div style={{ animation: "float-avatar 6s ease-in-out infinite" }} className="relative h-65 w-65 sm:h-80 sm:w-80">
              <div className="h-full w-full overflow-hidden rounded-full border border-slate-700/50 shadow-2xl">
                <img src="/images/home.jpg" alt="Abdallah Shee" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 left-1/2 z-20 w-full -translate-x-1/2">
                <div className="w-full rounded-xl bg-green-700 px-0 py-3 backdrop-blur">
                  <BrandHome />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="space-y-6">
        <div>
          <h2 className="title2">Core Stack</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            These are some of the core technologies I use to design, build, and deploy modern software.
            While they don't represent my complete skill set, they reflect the tools I rely on most to
            deliver scalable, secure, and maintainable applications. I continuously expand my expertise
            by learning new technologies and frameworks, always selecting the right tool for the problem
            rather than following trends, with a strong focus on clean architecture, performance, and
            long-term maintainability.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(CORE_SKILLS).map(([category, group]) => (
            <Paper
              key={category}
              withBorder
              radius="lg"
              p="lg"
              className="flex h-full flex-col border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/60"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ThemeIcon
                    size={42}
                    radius="md"
                    variant="light"
                    style={{
                      color: group.color,
                      backgroundColor: `${group.color}20`,
                    }}
                  >
                    <group.icon size={20} />
                  </ThemeIcon>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {category}
                  </h3>
                </div>

                <div className="flex flex-1 flex-col gap-2.5">
                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <CheckCircle
                        size={14}
                        className="shrink-0"
                        style={{ color: group.color }}
                      />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <div id="projects" className="w-full scroll-mt-20">
        {children}
      </div>

      {/* CTA */}
      <section id="contact" className="mx-auto w-full scroll-mt-20">
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
              I'm actively seeking full-stack software developer opportunities.
              Take a look at what I've built, and let's talk about how I can contribute to your team / project.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/connect"
                className="w-full sm:min-w-50 sm:flex-1"
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
                href="/#projects"
                className="w-full sm:min-w-50 sm:flex-1"
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
