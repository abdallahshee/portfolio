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
  Github,
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
} from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const [projectsResult, blogsResult] = await Promise.allSettled([
      context.queryClient.fetchQuery(getTopProjectsQueryOptions()),
      context.queryClient.fetchQuery(getTopArticlesQueryOptions()),
    ])

    return {
      projects: projectsResult.status === 'fulfilled' ? projectsResult.value : [],
      blogs: blogsResult.status === 'fulfilled' ? blogsResult.value : [],
    }
  },
  component: App,
})

const STATS = [
  { icon: <Briefcase size={20} />, value: '3+', label: 'Years Experience', color: 'indigo' },
  { icon: <FolderKanban size={20} />, value: '20+', label: 'Projects Delivered', color: 'blue' },
  { icon: <Users size={20} />, value: '10+', label: 'Happy Clients', color: 'green' },
  { icon: <Star size={20} />, value: '100%', label: 'On-Time Delivery', color: 'yellow' },
]

const STRENGTHS = [
  {
    icon: <Layout size={20} />,
    title: 'Frontend Development',
    desc: 'Craft clean, responsive, and user-focused interfaces using React, Mantine UI, and Tailwind CSS with strong attention to performance and accessibility.',
    color: 'indigo',
  },
  {
    icon: <Server size={20} />,
    title: 'Backend & APIs',
    desc: 'Build scalable server functions and type-safe APIs with a focus on clean architecture, reliability, and maintainability.',
    color: 'blue',
  },
  {
    icon: <Database size={20} />,
    title: 'Database Design',
    desc: 'Design efficient relational schemas using PostgreSQL and Drizzle ORM, with optimized queries and solid data modeling.',
    color: 'teal',
  },
  {
    icon: <Network size={20} />,
    title: 'System Design & Problem Solving',
    desc: 'Design scalable, maintainable systems and solve complex problems through thoughtful architecture, efficient data flow, and practical engineering decisions.',
    color: 'pink',
  },
  {
    icon: <Gauge size={20} />,
    title: 'Performance & Scale',
    desc: 'Develop production-ready systems optimized for performance through efficient data fetching, caching, and scalable patterns.',
    color: 'orange',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'AI-Assisted Development',
    desc: 'Leverage AI tools to accelerate development, improve code quality, and iterate faster while maintaining strong engineering standards.',
    color: 'grape',
  },
]

const CORE_SKILLS = [
  'TypeScript',
  'React 19 & TanStack Start',
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
          <div className="rise-in">
            <Badge variant="filled" color="green" size="lg" radius="xl">
              Available for new projects
            </Badge>
          </div>

          <Stack gap="lg" className="max-w-3xl">
            <div className="relative inline-block text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              <span className="text-blue-500">
                Software Architect • Full-Stack Developer
              </span>

              <span className="absolute left-0 -bottom-1 sm:-bottom-2 h-[3px] sm:h-[4px] w-3/5 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 rounded-full"></span>
            </div>

            <div className="space-y-2 py-3">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black leading-[1.02] tracking-tight text-slate-900 dark:text-white">
                Designing maintainable and scalabe {" "}
                {/* </Title> */}

                {/* <Title className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.02] tracking-tight"> */}
                <span className="bg-gradient-to-r from-indigo-600  via-30% via-blue-600 to-blue-400 bg-clip-text text-transparent">
                  web products and software systems
                </span>
              </div>

              {/* <Title className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.02] tracking-tight text-slate-900 dark:text-white">
      that scale with confidence
    </Title> */}
            </div>

            <Text
              size="lg"
              c="dimmed"
              className="max-w-2xl text-base sm:text-lg leading-7 sm:leading-8"
            >
              I build modern digital products with a strong focus on architecture,
              maintainability, performance, and user experience — turning complex ideas
              into reliable, production-ready applications.
            </Text>
          </Stack>

          <Group>
            <Button
              component="a"
              href="#featured"
              size="md"
              radius="xl"
              className="bg-indigo-500 hover:bg-indigo-600"
              rightSection={<ArrowRight size={18} />}
            >
              Explore Work
            </Button>

            <Link to="/contact">
              <Button size="md" radius="xl" variant="outline">
                Contact Me
              </Button>
            </Link>
          </Group>
        </Stack>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah Shee"
              className="w-72 h-72 sm:w-80 sm:h-80 lg:w-[25rem] lg:h-[25rem] object-cover rounded-3xl shadow-2xl"
            />

            <Paper
              shadow="md"
              radius="xl"
              withBorder
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 lg:left-auto lg:-translate-x-0 lg:-bottom-6 lg:-left-6 px-5 py-4 bg-white/95 backdrop-blur dark:bg-slate-900/95"
            >
              <Group gap="md" wrap="nowrap">
                <ThemeIcon size={44} radius="xl" variant="light" color="indigo">
                  <Code2 size={20} />
                </ThemeIcon>

                <div>
                  <Group gap="xs" align="center">
                    <Text fw={700}>Abdallah Shee</Text>
                    <span className="text-base">🇰🇪</span>
                  </Group>
                  <Text size="sm" c="dimmed" className="leading-5">
                    Nairobi, Kenya
                  </Text>
                </div>
              </Group>
            </Paper>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
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
                size={50}
                className="shadow-sm transition-transform group-hover:scale-110"
              >
                {stat.icon}
              </ThemeIcon>

              <div>
                <Title order={2} className="text-3xl font-extrabold leading-none tracking-tight">
                  {stat.value}
                </Title>

                <div className="w-10 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent rounded-full my-2" />

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
        <Stack gap="lg">
          <div>

            <Title order={2} className="text-3xl font-bold tracking-tight ">
              About Me
            </Title>
          </div>

          <Text size="lg" c="dimmed" className="leading-8">
            I’m <strong>Abdallah Shee</strong>, a full-stack developer based in
            Nairobi, Kenya 🇰🇪. I build modern web applications that are fast,
            scalable, and reliable — turning complex ideas into clean, intuitive
            products that deliver real value to users.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            I work across the full JavaScript and TypeScript stack — from designing
            relational databases and type-safe APIs to crafting responsive,
            user-friendly interfaces. My approach emphasizes clean architecture,
            maintainability, and strong developer experience, so products remain
            easy to scale and evolve over time.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            I also leverage AI-assisted workflows to enhance development speed,
            improve code quality, and accelerate problem-solving while maintaining
            full control over engineering decisions. The goal is always the same:
            deliver robust, production-ready software without compromising clarity
            or long-term maintainability.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            I care about writing software that lasts — systems that are
            understandable, adaptable, and built to perform well in real-world
            production environments.
          </Text>

          <Link to="/contact">
            <Button
              variant="filled"
              color="indigo"
              radius="xl"
              size="md"
              rightSection={<ArrowRight size={16} />}
            >
              Work With Me
            </Button>
          </Link>
        </Stack>

        <Card radius="2xl" withBorder p="xl" className="shadow-sm h-full">
          <Stack gap="lg">
            <Title order={4}>Core Skills & Technologies</Title>

            <List
              spacing="sm"
              size="md"
              icon={
                <ThemeIcon color="indigo" size={22} radius="xl" variant="light">
                  <CheckCircle size={13} />
                </ThemeIcon>
              }
            >
              {CORE_SKILLS.map((skill) => (
                <List.Item key={skill}>
                  <Text size="sm" fw={500}>
                    {skill}
                  </Text>
                </List.Item>
              ))}
            </List>

            <Divider />

            <Stack gap="xs">
              <Text
                size="sm"
                fw={600}
                c="dimmed"
                className="uppercase tracking-widest"
              >
                Currently Working With
              </Text>

              <Group gap="sm" className="flex-wrap">
                {[
                  'React 19',
                  'TanStack Start',
                  'Drizzle ORM',
                  'Supabase',
                  'Tailwind v4',
                  'Zod',
                  'TypeScript',
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="light"
                    color="indigo"
                    radius="xl"
                    className="px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-indigo-500 hover:text-white border border-transparent hover:border-indigo-400"
                  >
                    {tech}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Stack>
        </Card>
      </section>

      <Divider />

      {/* ── STRENGTHS ── */}
      <section className="space-y-6">
        <div>
          <Badge variant="light" color="violet" radius="sm" mb="xs">
            What I Bring
          </Badge>
          <Title order={2} className="text-3xl font-bold">
            Core Strengths
          </Title>
          <Text c="dimmed" mt={4}>
            The areas where I consistently deliver the most impact and value.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {STRENGTHS.map((strength) => (
            <Card key={strength.title} radius="xl" withBorder p="lg" className="shadow-sm">
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

      <Divider />

      {/* ── FEATURED ── */}
      <section id="featured" className="space-y-10">
        <div className="space-y-2">
          <Badge variant="light" color="indigo" radius="sm">
            Highlights
          </Badge>
          <Title order={2} className="text-3xl font-bold">
            Top Work & Writing
          </Title>
          <Text c="dimmed" className="max-w-3xl">
            A snapshot of the highest rated projects and most popular articles.
          </Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* PROJECTS */}
          <Paper withBorder radius="xl" shadow="sm" className="p-5">
            <Stack gap="md">
              <Group justify="space-between" align="end">
                <div>
                  <Title order={3}>Top Rated Projects</Title>
                  <Text size="sm" c="dimmed">
                    Highest-rated builds from my portfolio
                  </Text>
                </div>
                <Link to="/projects">
                  <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </Link>
              </Group>

              <Table highlightOnHover withTableBorder verticalSpacing="md" horizontalSpacing="md">
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
                                <Image
                                  src={project.imageUrl}
                                  w={46}
                                  h={46}
                                  radius="md"
                                  className="object-cover"
                                />
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
                          <Table.Td />
                          <Table.Td>
                            <Text c="blue" size="sm" fw={600}>
                              View
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={3}>
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
                  <Title order={3}>Most Popular Articles</Title>
                  <Text size="sm" c="dimmed">
                    Articles with the strongest engagement
                  </Text>
                </div>
                <Link to="/articles" search={{ page: 1 }}>
                  <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                    View All
                  </Button>
                </Link>
              </Group>

              <Table highlightOnHover withTableBorder verticalSpacing="md" horizontalSpacing="md">
                <Table.Tbody>
                  {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <Table.Tr
                        key={blog.id}
                        onClick={() =>
                          router.navigate({
                            to: '/articles/$slug',
                            params: { slug: blog.slug },
                          })
                        }
                        className="cursor-pointer transition hover:bg-gray-50"
                      >
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            {blog.coverImage ? (
                              <Image
                                src={blog.coverImage}
                                w={46}
                                h={46}
                                radius="md"
                                className="object-cover"
                              />
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
                        <Table.Td>
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

      <Divider />

      {/* ── CTA ── */}
      <section id="contact" className="max-w-4xl mx-auto">
        <Paper
          radius="2xl"
          withBorder
          shadow="sm"
          className="p-8 lg:p-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800"
        >
          <Stack align="center" gap="md">
            <Title
              order={2}
              className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              Let&apos;s Build Something Great
            </Title>
            <Text c="dimmed" size="lg" className="max-w-2xl leading-8">
              I&apos;m open to freelance work, collaborations, and full-stack
              product opportunities. If you have an idea, product, or challenge
              in mind, I&apos;d be glad to connect.
            </Text>
            <Group justify="center" mt="md">
              <Button
                variant="filled"
                component="a"
                href="mailto:abdallah@example.com"
                leftSection={<Mail size={18} />}
                color="indigo"
              >
                Email Me
              </Button>
              <Button
                component="a"
                href="https://github.com"
                target="_blank"
                variant="filled"
                leftSection={<Github size={18} />}
              >
                GitHub
              </Button>
              <Button
                component="a"
                href="https://linkedin.com"
                target="_blank"
                variant="filled"
                leftSection={<Linkedin size={18} />}
              >
                LinkedIn
              </Button>
            </Group>
          </Stack>
        </Paper>
      </section>
    </Container>
  )
}