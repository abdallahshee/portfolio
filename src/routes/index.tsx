import { getTopBlogsQueryOptions } from '@/db/queries/blog.queries'
import { getTopProjectsQueryOptions } from '@/db/queries/project.queries'
import {
  Badge,
  Button,
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
  Avatar,
} from '@mantine/core'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  Heart,
  MessageCircle,
  FolderKanban,
  Globe,
  FileText,
  Code2,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const top5Projects = await context.queryClient.fetchQuery(
      getTopProjectsQueryOptions()
    )
    const top5Blogs = await context.queryClient.fetchQuery(
      getTopBlogsQueryOptions()
    )

    return {
      projects: top5Projects,
      blogs: top5Blogs,
    }
  },
  component: App,
})

function App() {
  const { projects, blogs } = Route.useLoaderData()
  const router = useRouter()

  return (
    <Container size="xl" className="space-y-8 py-10">
      {/* HERO SECTION */}
      <section className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          {/* <Text size="xl" fw={'bold'} variant="light" color="indigo">
            Full-Stack Developer
          </Text> */}

          <div className="space-y-5">
            <Title className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Building modern
              <span className="text-indigo-500"> web products </span>
              with clarity, performance, and scale
            </Title>

            <Text size="lg" c="dimmed" className="max-w-2xl leading-8">
              I&apos;m Abdallah Shee, a full-stack developer focused on building
              reliable digital products with React, TanStack Start, Drizzle ORM,
              PostgreSQL, Mantine UI, and Tailwind CSS.
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

            <Button component="a" href="#contact" size="md" variant="outline">
              Contact Me
            </Button>
          </Group>

          {/* <Group gap="xs">
            {[
              'React',
              'TanStack Start',
              'TypeScript',
              'PostgreSQL',
              'Tailwind CSS',
            ].map((tech) => (
              <Badge key={tech} variant="light" color="green" radius="sm">
                {tech}
              </Badge>
            ))}
          </Group> */}
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
                    <Text fw={700}>Full-Stack Developer</Text>
                    <span className="text-base">🇰🇪</span>
                  </Group>
                  <Group gap={4} align="center">
                    {/* <span className="text-sm">⚡</span> */}
                    <Text size="sm" c="dimmed" className="max-w-[200px] leading-5">
                      Crafting fast, scalable, and maintainable web apps.
                    </Text>
                  </Group>
                </div>
              </Group>
            </Paper>
          </div>
        </div>
      </section>

      <Divider />

      {/* ABOUT SECTION */}
      <section className="max-w-4xl space-y-5">
        <Title order={2} className="text-3xl font-bold">
          About Me
        </Title>

        <Text size="lg" c="dimmed" className="leading-8">
          I build full-stack applications with a strong focus on clean
          architecture, maintainability, and user experience. I enjoy turning
          ideas into polished products, from database design and backend logic
          to responsive interfaces and dashboards.
        </Text>

        <Text size="lg" c="dimmed" className="leading-8">
          My work is centered around modern TypeScript tooling and production-ready
          systems that are practical, scalable, and easy to evolve.
        </Text>
      </section>

      <Divider />

      {/* FEATURED SECTION */}
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
          {/* PROJECTS COLUMN */}
          <Paper withBorder radius="xl" shadow="sm" className="p-5 bg-white">
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
                    View More Projects
                  </Button>
                </Link>
              </Group>

              <Table
                highlightOnHover
                withTableBorder
                verticalSpacing="md"
                horizontalSpacing="md"
              >
                <Table.Thead>
                  {/* <Table.Tr>
                    <Table.Th>Project</Table.Th>
                    <Table.Th>Rating</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr> */}
                </Table.Thead>

                <Table.Tbody>
                  {projects?.map((project) => {
                    const rating = Number(project.avgRating ?? 0)

                    return (
                      <Table.Tr
                        key={project.id}
                        onClick={() =>
                          router.navigate({
                            to: '/projects/$id/details',
                            params: { id: project.id },
                          })
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
                              <ThemeIcon
                                size={46}
                                radius="md"
                                variant="light"
                                color="gray"
                              >
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

                        <Table.Td>
                          {/* <Group gap="xs">
                            <Rating value={rating} readOnly size="sm" />
                            <Text size="sm" c="dimmed">
                              {rating > 0 ? rating.toFixed(1) : 'N/A'}
                            </Text>
                          </Group> */}
                        </Table.Td>

                        <Table.Td>
                          <Text c="blue" size="sm" fw={600}>
                            View
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>

          {/* BLOGS COLUMN */}
          <Paper withBorder radius="xl" shadow="sm" className="p-5 bg-white">
            <Stack gap="md">
              <Group justify="space-between" align="end">
                <div>
                  <Title order={3}>Most Popular Articles</Title>
                  <Text size="sm" c="dimmed">
                    Articles with the strongest audience engagement
                  </Text>
                </div>

                <Link to="/blogs" search={{ page: 1 }}>
                  <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                    View More Articles
                  </Button>
                </Link>
              </Group>

              <Table
                highlightOnHover
                withTableBorder
                verticalSpacing="md"
                horizontalSpacing="md"
              >
                <Table.Thead>
                  {/* <Table.Tr>
                    <Table.Th>Article</Table.Th>
                  
                    <Table.Th>Action</Table.Th>
                  </Table.Tr> */}
                </Table.Thead>

                <Table.Tbody>
                  {blogs?.map((blog) => (
                    <Table.Tr
                      key={blog.id}
                      onClick={() =>
                        router.navigate({
                          to: '/blogs/$slug/details',
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
                            <ThemeIcon
                              size={40}
                              radius="xl"
                              variant="light"
                              color="grape"
                            >
                              <FileText size={18} />
                            </ThemeIcon>
                          )}

                          <div className="min-w-0">
                            <Text fw={600} truncate>
                              {blog.title}
                            </Text>
                            <Group gap={6}>

                              <Badge>Likes {blog.likes}</Badge>
                            </Group>
                          </div>
                        </Group>
                      </Table.Td>

                      <Table.Td>
                        <Text c="blue" size="sm" fw={600}>
                          Read
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>
        </div>
      </section>

      <Divider />

      {/* CONTACT */}
      <section id="contact" className="max-w-5xl mx-auto">
        <Paper
          radius="xl"
          withBorder
          shadow="sm"
          className="p-8 lg:p-12 text-center bg-white"
        >
          <Stack align="center" gap="md">


            <Title order={2} className="text-3xl font-bold text-blue-700">
              Let's Build Something Great
            </Title>

            <Text c="dimmed" size="lg" className="max-w-2xl leading-8">
              I&apos;m open to freelance work, collaborations, and full-stack
              product opportunities. If you have an idea, product, or challenge
              in mind, I&apos;d be glad to connect.
            </Text>

            <Group justify="center" mt="md">
              <Button
                component="a"
                href="mailto:abdallah@example.com"
                leftSection={<Mail size={18} />}
                className="bg-indigo-500 hover:bg-indigo-600"
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