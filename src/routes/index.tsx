import { getTopArticlesQueryOptions } from '@/db/queries/article.queries'
import { getTopProjectsQueryOptions } from '@/db/queries/project.queries'
import {
  Badge,
  Button,
  Card,
  Container,
  Text,
  Title,
  Table,
  Image,
  Group,
  Stack,
  Rating,
  Divider,
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
  Code2,
  FolderOpen,
  BookOpen,
  Briefcase,
  Star,
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
  { icon: <FolderKanban size={18} />, value: '20+', label: 'Projects Delivered', color: 'blue' },
  { icon: <Users size={18} />, value: '10+', label: 'Happy Clients', color: 'green' },
  { icon: <Star size={18} />, value: '100%', label: 'On-Time Delivery', color: 'yellow' },
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
    <Container size="xl" className="space-y-12 py-10">
      {/* ── HERO ── */}
      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-center">
        <Stack gap="xl" className="max-w-3xl">
          <Stack gap="md" className="max-w-3xl">
            <div className="relative inline-block text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2">
              <span className="text-blue-500">Full-Stack Software Developer</span>
              <span className="absolute left-0 -bottom-1 sm:-bottom-2 h-[3px] sm:h-[4px] w-3/5 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 rounded-full"></span>
            </div>

            <div>
              <Title className="heading">
                Designing maintainable and scalable web products & software systems
              </Title>
            </div>

            <Text size="lg" c="dimmed" className="max-w-2xl text-base sm:text-lg leading-7 sm:leading-8">
              I build modern digital products with a strong focus on architecture,
              maintainability, performance, and user experience — turning complex ideas
              into reliable, production-ready applications.
            </Text>
          </Stack>

          <Group>
            <Link to="/projects">
              <Button
                size="md"
                radius="xl"
                className="bg-indigo-500 hover:bg-indigo-600"
                rightSection={<ArrowRight size={18} />}
              >
                Explore My Projects
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="md" radius="xl" variant="filled" color="yellow" rightSection={<Send size={18} />}>
                Contact Me
              </Button>
            </Link>
          </Group>
        </Stack>

        <div className="flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[14rem] sm:max-w-[16rem] lg:max-w-[20rem]">
  <div className="aspect-square overflow-hidden rounded-2xl shadow-xl">
    <img
      src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
      alt="Abdallah Shee"
      className="block h-full w-full object-cover"
    />
  </div>
</div>
        </div>
      </section>

      {/* ── STATS ── */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
        {STATS.map((stat) => (
          <Paper
            key={stat.label}
            radius="2xl"
            withBorder
            p="sm"
            className="group shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800"
          >
            <Group align="center" gap="md" wrap="nowrap">
              <ThemeIcon
                variant="light"
                color={stat.color}
                radius="xl"
                size={42}
                className="shadow-sm transition-transform group-hover:scale-110"
              >
                {stat.icon}
              </ThemeIcon>
              <div>
                <Title order={2} className="text-2xl font-extrabold leading-none tracking-tight">
                  {stat.value}
                </Title>
                <div className="w-11 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent rounded-full my-2" />
                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <Divider />

      {/* ── ABOUT ── */}
      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
        <Stack gap="lg" className="border-r-4 border-blue-500 pr-4">
          <Title order={2} className="text-3xl font-bold tracking-tight">
            About Me
          </Title>

          <Text size="lg" c="dimmed" className="leading-8">
            I'm <strong>Abdallah Shee</strong>, a software developer based in Nairobi, Kenya 🇰🇪.
            I help businesses and startups turn ideas into reliable, easy-to-use digital products —
            whether it’s a platform, a system, or a custom solution tailored to their needs.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            From planning how everything should work to building and refining the final product,
            I focus on creating systems that are simple to use, efficient, and built to handle growth.
            My goal is always to make things clear, practical, and valuable for the people who use them.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            I believe good software should feel effortless — it should solve real problems,
            adapt as your business grows, and continue working smoothly long after it’s launched.
          </Text>

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

        <Stack gap="lg">
          <Title order={2} className="text-3xl font-bold tracking-tight">
            Core Skills & Technologies
          </Title>
          <List
            spacing="sm"
            size="lg"
            icon={
              <ThemeIcon color="indigo" size={22} radius="xl" variant="light">
                <CheckCircle size={16} />
              </ThemeIcon>
            }
          >
            {CORE_SKILLS.map((skill) => (
              <List.Item key={skill}>
                <Text size="md" c="dimmed">
                  {skill}
                </Text>
              </List.Item>
            ))}
          </List>
        </Stack>

      </section>
      <section className="flex ">
        <Group justify="center" gap="lg" wrap="wrap">
          <Link to="/contact">
            <Button
              variant="filled"
              color="indigo"
              radius="xl"
              size="md"
              rightSection={<ArrowRight size={16} />}
            >
              Let&apos;s Work Together
            </Button>
          </Link>

          <Link to="/services">
            <Button
              variant="outline"
              color="indigo"
              radius="xl"
              size="md"
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
          <Title order={2} className="text-3xl font-bold">
            Core Strengths
          </Title>
          <Text c="dimmed" mt={4}>
            The areas where I consistently deliver the most impact and value.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {STRENGTHS.map((strength) => (
            <Card key={strength.title} withBorder p="lg" className="shadow-sm ">
              <Group gap="md" align="flex-start">
                <ThemeIcon variant="light" color={strength.color} radius="xl" size="lg">
                  {strength.icon}
                </ThemeIcon>
                <Stack gap={4} className="flex-1">
                  <Text fw={700}>{strength.title}</Text>
                  <Text size="sm" c="dimmed">
                    {strength.desc}
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </section>

      {/* ── FEATURED ── */}
      <section id="featured" className="space-y-8">
        <div className="space-y-2">
          <Title order={2} className="text-3xl font-bold">
            Featured Work & Writing
          </Title>
          <Text c="dimmed" className="max-w-3xl">
            A curated selection of projects and articles that best reflect the quality of my work.
          </Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* PROJECTS */}
          <Paper withBorder radius="xl" shadow="sm" className="p-5">
            <Stack gap="md">
              <Group justify="space-between" align="end">
                <div>
                  <Title order={3}>Featured Projects</Title>
                  <Text size="sm" c="dimmed">
                    A selection of standout builds from my portfolio
                  </Text>
                </div>
                <Link to="/projects">
                  <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </Link>
              </Group>

              <Table highlightOnHover withTableBorder verticalSpacing="sm" horizontalSpacing="sm">
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
                                <Text fw={600} truncate>
                                  {project.title}
                                </Text>
                                <Rating value={rating} readOnly size="sm" />
                              </Stack>
                            </Group>
                          </Table.Td>
                          <Table.Td w={60}>
                            <Text c="blue" size="sm" fw={600}>
                              View
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Stack align="center" gap="xs" py="xl">
                          <ThemeIcon size={56} radius="xl" variant="light" color="gray">
                            <FolderOpen size={28} />
                          </ThemeIcon>
                          <Text fw={600} size="md">
                            No projects yet
                          </Text>
                          <Text size="sm" c="dimmed" ta="center">
                            Projects will appear here once they are added.
                          </Text>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>

          {/* ARTICLES */}
          <Paper withBorder radius="xl" shadow="sm" className="p-5">
            <Stack gap="md">
              <Group justify="space-between" align="end">
                <div>
                  <Title order={3}>Featured Articles</Title>
                  <Text size="sm" c="dimmed">
                    A few of the most engaging pieces written by users
                  </Text>
                </div>
                <Link to="/articles" search={{ page: 1 }}>
                  <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </Link>
              </Group>

              <Table highlightOnHover withTableBorder verticalSpacing="sm" horizontalSpacing="sm">
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
                              <ThemeIcon size={40} radius="xl" variant="light" color="grape">
                                <FileText size={18} />
                              </ThemeIcon>
                            )}
                            <div className="min-w-0">
                              <Text fw={600} truncate>
                                {blog.title}
                              </Text>
                              <Badge variant="light" color="pink" size="sm">
                                ❤️ {blog.likes} Likes
                              </Badge>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td w={60}>
                          <Text c="blue" size="sm" fw={600}>
                            Read
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Stack align="center" gap="xs" py="xl">
                          <ThemeIcon size={56} radius="xl" variant="light" color="grape">
                            <BookOpen size={28} />
                          </ThemeIcon>
                          <Text fw={600} size="md">
                            No articles yet
                          </Text>
                          <Text size="sm" c="dimmed" ta="center">
                            Articles will appear here once they are published.
                          </Text>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>
        </div>
      </section>

      {/* ── CTA ── */}
      {/* <section id="contact" className="mx-auto max-w-3xl scroll-mt-20"> */}
      <section id="contact" className="mx-auto max-2xl: scroll-mt-20">
        <Paper
          radius="24px"
          withBorder
          shadow="sm"
          className="relative overflow-hidden border border-slate-200/70 bg-gradient-to-br from-white via-indigo-50 to-blue-50 px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

          {/* Center everything */}
          <div className="relative flex justify-center">
            <Stack gap="lg" align="center" className="text-center max-w-2xl">
              <div className="space-y-2">
                <Title order={2} className="heading2">
                     Let me turn your idea into reality
                </Title>

                <Text c="dimmed" size="lg" className="leading-8">
              I turn ideas into practical software solutions that work
               reliably and grow with your business.
                </Text>
              </div>

              <Group gap="sm" className="pt-2" justify="center">
                <Button
                  size="md"
                  radius="xl"
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
                  size="md"
                  radius="xl"
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