import { createFileRoute } from '@tanstack/react-router'
import {
    Container,
    Group,
    Stack,
    Paper,
    ThemeIcon,
    Timeline,
    List,
    Divider,
    Button,
} from '@mantine/core'
import {
    Search,
    Pencil,
    Code2,
    Rocket,
    HeartHandshake,
    CheckCircle,
    Mail,
    FolderKanban,
    ArrowRight,
} from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/tools-process')({
    component: HowIWorkPage,
})

const PROCESS = [
    {
        icon: <Search size={18} />,
        title: 'Discovery & Scoping',
        desc: 'We start with a detailed conversation about your goals, users, and requirements. I map out the system, define scope, and propose a clear technical approach before any code is written.',
        color: 'indigo',
    },
    {
        icon: <Pencil size={18} />,
        title: 'Design & Architecture',
        desc: 'I design the database schema, system architecture, and UI wireframes. This stage ensures we agree on structure and flow before building — saving time and rework down the line.',
        color: 'blue',
    },
    {
        icon: <Code2 size={18} />,
        title: 'Development & Iteration',
        desc: 'I build in focused sprints with regular check-ins and previews. You get visibility throughout — not just at the end. Feedback is incorporated continuously.',
        color: 'teal',
    },
    {
        icon: <Rocket size={18} />,
        title: 'Testing & Deployment',
        desc: 'The product is thoroughly tested, optimized for performance, and deployed to production with proper CI/CD pipelines, environment config, and monitoring.',
        color: 'orange',
    },
    {
        icon: <HeartHandshake size={18} />,
        title: 'Handover & Support',
        desc: 'You receive full documentation, source code access, and a handover session. Post-launch support is available to ensure everything runs smoothly.',
        color: 'green',
    },
]

const CORE_SKILLS = [
    'TypeScript and Python',
    'React 19 & TanStack Start',
    'TanStack Query & TanStack Router',
    'PostgreSQL & Drizzle ORM',
    'Supabase (Auth, Storage, Realtime)',
    'Material UI & Tailwind CSS',
    'ExpressJs & MeteorJS',
    'REST APIs & Server Functions',
    'Git, CI/CD & Agile workflows',
]

function HowIWorkPage() {
    const router = useRouter()

    return (
        <Container size="xl" className="max-w-full space-y-10 px-0 py-6 sm:space-y-12 sm:py-8 md:py-10">

            {/* ── PAGE HEADER ── */}
            <section className="w-full space-y-6">
                <div className="heading">
                    How I Build and What I Build With
                </div>

                <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                    Building modern software is about making deliberate decisions at every stage —
                    not just writing code. My workflow is structured around clarity, collaboration,
                    and predictability. Every project begins with a thorough discovery phase where
                    I invest time understanding your business, your users, and the problem we are
                    solving together — ensuring what gets built is exactly what is needed.
                </p>

                <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                    The tools I work with are chosen for reliability, maintainability, and developer
                    experience — not trends. TypeScript enforces correctness across the codebase,
                    TanStack powers type-safe routing and data fetching, and PostgreSQL with Drizzle
                    ORM brings structure to data management. Supabase ties it all together with
                    built-in auth, storage, and real-time capabilities — forming a cohesive stack
                    that scales from MVP to full production system.
                </p>
            </section>

            <Divider color="blue" />

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">

                {/* LEFT — Process Timeline */}
                <section className="space-y-8 border-b-2 border-blue-400 pb-8 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-6">
                    <div>
                        <div className="title2">How I Work</div>
                        <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
                            A clear, collaborative process from first conversation to final handover — so you always
                            know what's happening and what comes next.
                        </p>
                    </div>

                    <Timeline active={4} bulletSize={40} lineWidth={2} color="indigo">
                        {PROCESS.map((step, i) => (
                            <Timeline.Item
                                key={step.title}
                                bullet={
                                    <ThemeIcon size={40} radius="xl" variant="filled" color={step.color}>
                                        {step.icon}
                                    </ThemeIcon>
                                }
                                title={
                                    <div className="mb-2 text-base font-bold text-slate-900 dark:text-slate-50">
                                        {i + 1}. {step.title}
                                    </div>
                                }
                            >
                                <p className="mb-6 text-sm leading-7 text-slate-600 sm:mb-8 dark:text-slate-400">
                                    {step.desc}
                                </p>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </section>

                {/* RIGHT — Skills & Tools */}
                <section className="space-y-6">
                    <div>
                        <div className="title2">Core Skills & Technologies</div>
                        <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
                            A modern, production-proven stack chosen for reliability, developer experience,
                            and long-term maintainability.
                        </p>
                    </div>

                    <img
                        src="/images/tools.jpg"
                        alt="Distributed software system with multiple connected services"
                        className="block h-38 w-full rounded-lg object-cover sm:h-46 md:h-56"
                    />

                    <List
                        spacing="sm"
                        size="md"
                        icon={
                            <ThemeIcon color="indigo" size={22} radius="md" variant="light">
                                <CheckCircle size={16} />
                            </ThemeIcon>
                        }
                    >
                        {CORE_SKILLS.map((skill) => (
                            <List.Item key={skill}>
                                <span className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                                    {skill}
                                </span>
                            </List.Item>
                        ))}
                    </List>
                </section>
            </div>

            {/* ── CTA ── */}
            <Paper
                radius="24px"
                withBorder
                shadow="sm"
                className="relative overflow-hidden border border-slate-200/70 bg-linear-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
            >
                <Stack align="center" gap="md">
                    <div className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent text-center">
                        Like the Way I Work?
                    </div>
                    <p className="max-w-2xl px-1 text-center text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                        If my process and stack align with what your project needs, I'd love to hear
                        about it. Reach out and let's talk about how we can build something great together.
                    </p>
                    <Group justify="center" mt="md" wrap="wrap" gap="sm">
                        <Button
                            variant="filled"
                            color="blue"
                            size="sm"
                            radius="md"
                            leftSection={<Mail size={18} />}
                            onClick={() => router.navigate({ to: '/contacts' })}
                        >
                            Contact Me
                        </Button>
                        <Link to="/services">
                            <Button
                                variant="outline"
                                color="blue"
                                size="sm"
                                radius="md"
                                rightSection={<ArrowRight size={16} />}
                            >
                                Explore Services
                            </Button>
                        </Link>
                    </Group>
                </Stack>
            </Paper>

        </Container>
    )
}