import { getTopArticlesQueryOptions } from '@/db/queries/article.queries'
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
  Rating,
  Paper,
  ThemeIcon,
  SimpleGrid,
  List,
} from '@mantine/core'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowRight,
  Mail,
  Linkedin,
  FolderKanban,
  FileText,
  FolderOpen,
  BookOpen,
  Briefcase,
  Users,
  CheckCircle,
  Database,
  Layout,
  Server,
  Network,
  Gauge,
  Sparkles,
  Send,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const [projectsResult, blogsResult] = await Promise.allSettled([
      context.queryClient.fetchQuery(getTopProjectsQueryOptions()),
      context.queryClient.fetchQuery(getTopArticlesQueryOptions()),
    ])

    return {
      projects:
        projectsResult.status === 'fulfilled'
          ? projectsResult.value?.slice(0, 3)
          : [],
      blogs:
        blogsResult.status === 'fulfilled'
          ? blogsResult.value?.slice(0, 3)
          : [],
    }
  },
  component: App,
})

const STATS = [
  { icon: <Briefcase size={18} />, value: '4+', label: 'Years Experience', color: 'indigo' },
  { icon: <FolderKanban size={18} />, value: '10+', label: 'Projects Delivered', color: 'blue' },
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

const CORE_SKILLS = [
  'TypeScript',
  'React 19 & TanStack Start',
  // 'TanStack Query & TanStack Router',
  'PostgreSQL & Drizzle ORM',
  'Supabase (Auth, Storage, Realtime)',
  'Mantine UI & Tailwind CSS',
  'REST APIs & Server Functions',
  'Git, CI/CD & Agile workflows',
]

function App() {
  const { projects, blogs } = Route.useLoaderData()
  const router = useRouter()

  return (
    <Container size="xl" className="max-w-full space-y-8 px-0 py-6 sm:space-y-10 sm:py-8 md:space-y-12 md:py-10">
      {/* ── HERO ── */}
      <section className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <Stack gap="xl" className="max-w-3xl min-w-0">
          <Stack gap="md" className="max-w-3xl min-w-0">
            <div className="relative mb-2 inline-block min-w-0 title2">
              <span className="text-blue-500">Full-Stack Software Developer</span>
              <span className="absolute left-0 -bottom-1 sm:-bottom-2 h-[3px] sm:h-[4px] w-3/5 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 rounded-full"></span>
            </div>

            <div className="min-w-0">
              <h1 className="heading break-words">
                Designing maintainable and scalable web products & software systems
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
              I build modern digital products with a strong focus on architecture,
              maintainability, performance, and user experience — turning complex ideas
              into reliable, production-ready applications.
            </p>
          </Stack>

          <Group wrap="wrap" gap="sm" className="gap-3">
            <Link to="/projects">
              <Button
                size="sm"
                radius="md"
                className="bg-indigo-500 hover:bg-indigo-600"
                rightSection={<ArrowRight size={18} />}
              >
                Explore My Projects
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="sm" radius="md" variant="filled" color="yellow" rightSection={<Send size={18} />}>
                Contact Me
              </Button>
            </Link>
          </Group>
        </Stack>

        <div className="flex justify-center lg:justify-end">
          <div className="relative h-[240px] overflow-hidden rounded-2xl sm:h-[280px] lg:h-[320px]">
            <img
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah Shee"
              className="block h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
        {STATS.map((stat) => (
          <Paper
            key={stat.label}
            radius="md"
          withBorder
            p="sm"
            className="group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800"
          >
            <Group align="center" gap="sm" wrap="wrap">
              <ThemeIcon
                variant="light"
                color={stat.color}
                radius="md"
                size={36}
                className="shadow-sm transition-transform group-hover:scale-110"
              >
                {stat.icon}
              </ThemeIcon>

              <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
                <div className="text-2xl font-extrabold leading-none tracking-tight">
                  {stat.value}
                </div>

                <span className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                  {stat.label}
                </span>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* <Divider /> */}

      {/* ── ABOUT ── */}
      <section className="grid items-start gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Stack gap="lg" className="min-w-0 border-b-4 border-blue-500 pb-6 lg:border-b-0 lg:border-r-4 lg:pb-0 lg:pr-6">
          <div className="title2">
            About Me
          </div>

          <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
            I'm <strong>Abdallah Shee</strong>, a software developer based in Nairobi, Kenya 🇰🇪.
            I help businesses and startups turn ideas into reliable, easy-to-use digital products —
            whether it’s a platform, a system, or a custom solution tailored to their needs.
          </p>

          <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
            From planning how everything should work to building and refining the final product,
            I focus on creating systems that are simple to use, efficient, and built to handle growth.
            My goal is always to make things clear, practical, and valuable for the people who use them.
          </p>

          <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
            I believe good software should feel effortless — it should solve real problems,
            adapt as your business grows, and continue working smoothly long after it’s launched.
          </p>

          {/* <Group>
            <Link to="/contact">
              <Button variant="filled" color="indigo" radius="xl" size="md" rightSection={<ArrowRight size={16} />}>
                Let's Work Together
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" color="indigo" radius="xl" size="md" rightSection={<ArrowRight size={16} />}>
                Explore My Services
              </Button>
            </Link>
          </Group> */}
        </Stack>

        <Stack gap="lg" className="min-w-0">
          <div className="title2">
            Core Skills & Technologies
          </div>
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
                <span className="text-sm text-slate-600 sm:text-base dark:text-slate-400">{skill}</span>
              </List.Item>
            ))}
          </List>
        </Stack>

      </section>
      <section className="flex justify-center">
        <Group justify="center" gap="md" wrap="wrap" className="sm:gap-8">
          <Link to="/contact">
            <Button
              variant="filled"
              color="indigo"
              radius="md"
              size="sm"
              rightSection={<ArrowRight size={16} />}
            >
              Let&apos;s Work Together
            </Button>
          </Link>

          <Link to="/services">
            <Button
              variant="outline"
              color="indigo"
              radius="md"
              size="sm"
              rightSection={<ArrowRight size={16} />}
            >
              Explore My Services
            </Button>
          </Link>
        </Group>
      </section>

      {/* ── STRENGTHS ── */}
      <section className="space-y-6">
        <div>
          <div className="title2">
            Core Strengths
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
            The areas where I consistently deliver the most impact and value.
          </p>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {STRENGTHS.map((strength) => (
            <Card key={strength.title} withBorder p="lg" radius="lg" className="shadow-sm ">
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

      {/* ── FEATURED ── */}
      <section id="featured" className="space-y-8">
        <div className="space-y-2">
          <div className="title2">
            Featured Work & Writing
          </div>
          <p className="mt-1 max-w-3xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
            A curated selection of projects and articles that best reflect the quality of my work.
          </p>
        </div>

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-2">
          {/* PROJECTS */}
          <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
            <Stack gap="md">
              <Group
                justify="space-between"
                align="flex-start"
                gap="sm"
                wrap="wrap"
                className="sm:flex-nowrap sm:items-end"
              >
                <div className="min-w-0 flex-1">
                  <div className='title3'>Featured Projects</div>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                    A selection of standout builds from my portfolio
                  </p>
                </div>
                <Link to="/projects" className="shrink-0">
                  <Button variant="subtle" size="sm" radius="md" rightSection={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </Link>
              </Group>

              <div className="-mx-1 overflow-x-auto sm:mx-0">
              <Table highlightOnHover withTableBorder verticalSpacing="sm" horizontalSpacing="sm" className="min-w-[280px]">
                <Table.Tbody>
                  {projects && projects.length > 0 ? (
                    projects.map((project) => {
                      const rating = Number(project.avgRating ?? 0)
                      return (
                        <Table.Tr
                          key={project.id}
                          onClick={() =>
                            router.navigate({ to: '/projects/$id', params: { id: project.id } })
                          }
                          className="cursor-pointer transition hover:bg-gray-50"
                        >
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              {project.imageUrl ? (
                                <Image src={project.imageUrl} w={46} h={46} radius="md" className="object-cover" />
                              ) : (
                                <ThemeIcon size={46} radius="md" variant="light" color="gray">
                                  <FolderKanban size={20} />
                                </ThemeIcon>
                              )}
                              <Stack gap={2} className="min-w-0">
                                <div className="truncate font-semibold text-slate-900 dark:text-slate-50">
                                  {project.title}
                                </div>
                                <Rating value={rating} readOnly size="sm" />
                              </Stack>
                            </Group>
                          </Table.Td>
                          <Table.Td w={60}>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              View
                            </span>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Stack align="center" gap="xs" py="xl">
                          <ThemeIcon size={56} radius="md" variant="light" color="gray">
                            <FolderOpen size={28} />
                          </ThemeIcon>
                          <div className="text-center text-base font-semibold text-slate-900 dark:text-slate-50">
                            No projects yet
                          </div>
                          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                            Projects will appear here once they are added.
                          </p>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
              </div>
            </Stack>
          </Paper>

          {/* ARTICLES */}
          <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
            <Stack gap="md">
              <Group
                justify="space-between"
                align="flex-start"
                gap="sm"
                wrap="wrap"
                className="sm:flex-nowrap sm:items-end"
              >
                <div className="min-w-0 flex-1">
                  <div className='title3'>Featured Articles</div>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                    A few of the most engaging pieces written by users
                  </p>
                </div>
                <Link to="/articles" search={{ page: 1 }} className="shrink-0">
                  <Button variant="subtle" radius="md" rightSection={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </Link>
              </Group>

              <div className="-mx-1 overflow-x-auto sm:mx-0">
              <Table highlightOnHover withTableBorder verticalSpacing="sm" horizontalSpacing="sm" className="min-w-[280px]">
                <Table.Tbody>
                  {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <Table.Tr
                        key={blog.id}
                        onClick={() =>
                          router.navigate({ to: '/articles/$slug', params: { slug: blog.slug } })
                        }
                        className="cursor-pointer transition hover:bg-gray-50"
                      >
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            {blog.coverImage ? (
                              <Image src={blog.coverImage} w={46} h={46} radius="md" className="object-cover" />
                            ) : (
                              <ThemeIcon size={40} radius="md" variant="light" color="grape">
                                <FileText size={18} />
                              </ThemeIcon>
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900 dark:text-slate-50">
                                {blog.title}
                              </div>
                              <Badge variant="light" radius="md" color="pink" size="sm">
                                ❤️ {blog.likes} Likes
                              </Badge>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td w={60}>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Read
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Stack align="center" gap="xs" py="xl">
                          <ThemeIcon size={56} radius="md" variant="light" color="grape">
                            <BookOpen size={28} />
                          </ThemeIcon>
                          <div className="text-center text-base font-semibold text-slate-900 dark:text-slate-50">
                            No articles yet
                          </div>
                          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                            Articles will appear here once they are published.
                          </p>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
              </div>
            </Stack>
          </Paper>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="mx-auto max-w-3xl scroll-mt-20">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          className="relative overflow-hidden border border-slate-200/70 bg-gradient-to-br from-white via-indigo-50 to-blue-50 px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

          {/* Center everything */}
          <div className="relative flex justify-center">
            <Stack gap="lg" align="center" className="text-center max-w-2xl">
              <div className="space-y-2">
                <div className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  Let me turn your idea into reality
                </div>

                <p className="text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                  I turn ideas into practical software solutions that work
                  reliably and grow with your business.
                </p>
              </div>

              <Group gap="sm" className="pt-2" justify="center" wrap="wrap">
                <Button
                  size="sm"
                  radius="md"
                  color="yellow"
                  variant="filled"
                  onClick={() => router.navigate({ to: '/contact' })}
                  leftSection={<Mail size={18} />}
                  className="shadow-sm"
                >
                  Start a Conversation
                </Button>

                <Button
                  component="a"
                  href="https://linkedin.com/in/abdallahshee"
                  target="_blank"
                  variant="filled"
                  color="blue"
                  size="sm"
                  radius="md"
                  leftSection={<Linkedin size={18} />}
                >
                  Connect on LinkedIn
                </Button>
              </Group>
            </Stack>
          </div>
        </Paper>
      </section>
    </Container>
  )
}