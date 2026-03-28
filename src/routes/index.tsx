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
  Zap,
  CheckCircle,
  Database,
  Layout,
  Server,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const top5Projects = await context.queryClient.fetchQuery(
      getTopProjectsQueryOptions()
    )
    const top5Blogs = await context.queryClient.fetchQuery(
      getTopArticlesQueryOptions()
    )
    return {
      projects: top5Projects,
      blogs: top5Blogs,
    }
  },
  component: App,
})

const STATS = [
  { icon: <Briefcase size={20} />, value: "3+", label: "Years Experience", color: "indigo" },
  { icon: <FolderKanban size={20} />, value: "20+", label: "Projects Delivered", color: "blue" },
  { icon: <Users size={20} />, value: "10+", label: "Happy Clients", color: "green" },
  { icon: <Star size={20} />, value: "100%", label: "On-Time Delivery", color: "yellow" },
]

const STRENGTHS = [
  {
    icon: <Layout size={20} />,
    title: "Frontend Development",
    desc: "Pixel-perfect, responsive UIs with React, Mantine UI, and Tailwind CSS. Strong focus on performance and accessibility.",
    color: "indigo",
  },
  {
    icon: <Server size={20} />,
    title: "Backend & APIs",
    desc: "Scalable server functions and REST APIs using TanStack Start, with clean architecture and proper error handling.",
    color: "blue",
  },
  {
    icon: <Database size={20} />,
    title: "Database Design",
    desc: "Relational schema design with PostgreSQL and Drizzle ORM. Optimized queries, migrations, and data modeling.",
    color: "teal",
  },
  {
    icon: <Zap size={20} />,
    title: "Performance & Scale",
    desc: "Production-ready systems built to handle real traffic — caching, lazy loading, and efficient data fetching.",
    color: "orange",
  },
]

const CORE_SKILLS = [
  "TypeScript & JavaScript (ES2022+)",
  "React 19 & TanStack Start",
  "PostgreSQL & Drizzle ORM",
  "Supabase (Auth, Storage, Realtime)",
  "Mantine UI & Tailwind CSS",
  "REST APIs & Server Functions",
  "Git, CI/CD & Agile workflows",
]

function App() {
  const { projects, blogs } = Route.useLoaderData()
  const router = useRouter()

  return (
    <Container size="xl" className="space-y-12 py-10">

      {/* ── HERO ── */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
 <div className="rise-in">
  <Badge variant="light" color="green" size="lg" radius="xl">
    🟢 Available for new projects
  </Badge>
</div>
     

          <div className="space-y-4">
            <Title className="text-4xl lg:text-6xl font-extrabold tracking-tight">
              <span className="relative inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Full-Stack Developer
                <span className="absolute -bottom-1 left-0 h-1 w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60" />
              </span>
            </Title>
            <Title className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Building modern
              <span className="text-indigo-500"> web products </span>
              with clarity, performance, and scale
            </Title>
            <Text size="lg" c="dimmed" className="max-w-2xl leading-8">
              I'm <strong>Abdallah Shee</strong>, a full-stack developer based in
              Nairobi, Kenya 🇰🇪. I turn complex ideas into fast, maintainable,
              and production-ready web applications.
            </Text>
          </div>

          <Group>
            <Button
              component="a"
              href="#featured"
              size="md"
              className="bg-indigo-500 hover:bg-indigo-600"
              rightSection={<ArrowRight size={18} />}
            >
              Explore Work
            </Button>
            <Link to="/contact">
              <Button size="md" variant="outline">
                Contact Me
              </Button>
            </Link>
          </Group>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah Shee"
              className="w-80 h-80 lg:w-[25rem] lg:h-[25rem] object-cover rounded-3xl shadow-2xl"
            />
            <Paper
              shadow="md"
              radius="xl"
              withBorder
              className="absolute -bottom-6 -left-6 hidden px-5 py-4 sm:block bg-white dark:bg-slate-900"
            >
              <Group gap="md">
                <ThemeIcon size={44} radius="xl" variant="light" color="indigo">
                  <Code2 size={20} />
                </ThemeIcon>
                <div>
                  <Group gap="xs" align="center">
                    <Text fw={700}>Abdallah Shee</Text>
                    <span className="text-base">🇰🇪</span>
                  </Group>
                  <Text size="sm" c="dimmed" className="max-w-[200px] leading-5">
                    Crafting fast, scalable, and maintainable web apps.
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
          <Paper key={stat.label} radius="xl" withBorder p="lg" className="text-center shadow-sm">
            <ThemeIcon variant="light" color={stat.color} radius="xl" size="xl" className="mx-auto mb-3">
              {stat.icon}
            </ThemeIcon>
            <Title order={2} className="text-3xl font-extrabold">{stat.value}</Title>
            <Text size="sm" c="dimmed">{stat.label}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Divider />

      {/* ── BIO ── */}
      <section className="grid lg:grid-cols-2 gap-10 items-start">
        <Stack gap="lg">
          <div>
            <Badge variant="light" color="indigo" radius="sm" mb="xs">About Me</Badge>
            <Title order={2} className="text-3xl font-bold">
              Who I Am
            </Title>
          </div>

          <Text size="lg" c="dimmed" className="leading-8">
            I'm a self-driven full-stack developer with over 3 years of experience
            building web applications from the ground up. My journey started with
            a passion for solving real problems through code, and has grown into
            a career delivering production-ready digital products for clients and
            personal projects.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            I specialize in the full JavaScript/TypeScript stack — from designing
            relational databases and building type-safe APIs, to crafting responsive
            interfaces that users love. I care deeply about clean architecture,
            developer experience, and shipping products that actually work.
          </Text>

          <Text size="lg" c="dimmed" className="leading-8">
            Outside of code, I enjoy learning about system design, contributing to
            open source, and staying current with the evolving web ecosystem.
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

        {/* Core skills */}
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
                  <Text size="sm" fw={500}>{skill}</Text>
                </List.Item>
              ))}
            </List>

            <Divider />

            <Stack gap="xs">
              <Text size="sm" fw={600} c="dimmed" className="uppercase tracking-widest">
                Currently Working With
              </Text>
              <Group gap="xs" className="flex-wrap">
                {["React 19", "TanStack Start", "Drizzle ORM", "Supabase", "Mantine 8", "Tailwind v4", "Zod", "TypeScript"].map((tech) => (
                  <Badge key={tech} variant="light" color="indigo" radius="md">
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
          <Badge variant="light" color="violet" radius="sm" mb="xs">What I Bring</Badge>
          <Title order={2} className="text-3xl font-bold">My Strengths</Title>
          <Text c="dimmed" mt={4}>
            Areas where I consistently deliver the most value.
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
                  <Text size="sm" c="dimmed">{strength.desc}</Text>
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
          <Badge variant="light" color="indigo" radius="sm">Highlights</Badge>
          <Title order={2} className="text-3xl font-bold">Top Work & Writing</Title>
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
                  <Text size="sm" c="dimmed">Highest-rated builds from my portfolio</Text>
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
                          onClick={() => router.navigate({ to: '/projects/$id', params: { id: project.id } })}
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
                                <Text fw={600} truncate>{project.title}</Text>
                                <Rating value={rating} readOnly size="sm" />
                              </Stack>
                            </Group>
                          </Table.Td>
                          <Table.Td />
                          <Table.Td>
                            <Text c="blue" size="sm" fw={600}>View</Text>
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
                          <Text fw={600} size="md">No projects yet</Text>
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
                  <Text size="sm" c="dimmed">Articles with the strongest engagement</Text>
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
                        onClick={() => router.navigate({ to: '/articles/$slug', params: { slug: blog.slug } })}
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
                              <Text fw={600} truncate>{blog.title}</Text>
                              <Badge variant="light" color="pink" size="sm">❤️ {blog.likes} Likes</Badge>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text c="blue" size="sm" fw={600}>Read</Text>
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
                          <Text fw={600} size="md">No articles yet</Text>
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
            <Badge variant="light" color="indigo" size="lg" radius="xl">
              Open to opportunities
            </Badge>
            <Title order={2} className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Let's Build Something Great
            </Title>
            <Text c="dimmed" size="lg" className="max-w-2xl leading-8">
              I'm open to freelance work, collaborations, and full-stack
              product opportunities. If you have an idea, product, or challenge
              in mind, I'd be glad to connect.
            </Text>
            <Group justify="center" mt="md">
              <Button
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
                variant="outline"
                leftSection={<Github size={18} />}
              >
                GitHub
              </Button>
              <Button
                component="a"
                href="https://linkedin.com"
                target="_blank"
                variant="outline"
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