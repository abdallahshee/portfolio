import { getTopBlogsQueryOptions } from '@/queries/blog.queries'
import { getTopProjectsQueryOptions } from '@/queries/project.queries'
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
    <Container size="xl" className="py-16 lg:py-24 space-y-20">
      {/* HERO SECTION */}
      <section className="grid lg:grid-cols-2 gap-14 items-center">
        <div className="space-y-8">
          <Badge size="lg" radius="sm" variant="light" color="indigo">
            Full-Stack Developer
          </Badge>

          <div className="space-y-5">
            <Title className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Building reliable
              <span className="text-indigo-500"> modern web products </span>
              with clean architecture
            </Title>

            <Text size="lg" c="dimmed" className="max-w-2xl leading-8">
              I&apos;m Abdallah Shee, a full-stack developer focused on crafting
              scalable applications with React, TanStack Start, Drizzle ORM,
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

          <Group gap="xs">
            {[
              'React',
              'TanStack Start',
              'TypeScript',
              'Drizzle ORM',
              'PostgreSQL',
              'Tailwind CSS',
            ].map((tech) => (
              <Badge key={tech} variant="light" color="gray" radius="sm">
                {tech}
              </Badge>
            ))}
          </Group>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
              alt="Abdallah Shee"
              className="w-80 h-80 lg:w-[24rem] lg:h-[24rem] object-cover rounded-3xl shadow-2xl"
            />
            <Paper
              shadow="md"
              radius="xl"
              withBorder
              className="absolute -bottom-6 -left-6 px-5 py-4 hidden sm:block"
            >
              <Group gap="md">
                <ThemeIcon size={42} radius="xl" variant="light" color="indigo">
                  <FolderKanban size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700}>Projects & Blogs</Text>
                  <Text size="sm" c="dimmed">
                    Selected work and writing
                  </Text>
                </div>
              </Group>
            </Paper>
          </div>
        </div>
      </section>

      <Divider />

      {/* ABOUT SECTION */}
      <section className="max-w-4xl space-y-6">
        <Title order={2} className="text-3xl font-bold">
          About Me
        </Title>

        <Text size="lg" c="dimmed" className="leading-8">
          I build full-stack applications with a strong focus on performance,
          usability, and maintainable code. I enjoy turning ideas into polished
          products, from backend architecture and database design to responsive
          interfaces and dashboards.
        </Text>

        <Text size="lg" c="dimmed" className="leading-8">
          My work centers around modern TypeScript tooling and production-ready
          systems that are clean, scalable, and user-friendly.
        </Text>
      </section>

      <Divider />

      {/* PROJECTS + BLOGS */}
      <section id="featured" className="grid lg:grid-cols-2 gap-12">
        {/* PROJECTS COLUMN */}
        <div className="space-y-6">
          <Group justify="space-between">
           <Title order={2}>Top Rated Projects</Title>

            <Link to="/projects">
              <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                  <Table.Th></Table.Th>
                {/* <Table.Th>Project</Table.Th> */}
                <Table.Th>Rating</Table.Th>
                <Table.Th>Link</Table.Th>
              </Table.Tr>
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
                      <Group gap="sm">
                        {project.imageUrl && (
                          <Image
                            src={project.imageUrl}
                            w={40}
                            h={40}
                            radius="sm"
                          />
                        )}

                        <Text fw={500}>{project.title}</Text>
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Rating value={rating} readOnly size="sm" />
                    </Table.Td>

                    <Table.Td>
                      <Text c="blue" size="sm" fw={500}>
                        View
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </div>

        {/* BLOGS COLUMN */}
        <div className="space-y-6">
          <Group justify="space-between">
          <Title order={2}>Most Popular Articles</Title>

            <Link to="/blogs">
              <Button variant="subtle" rightSection={<ArrowRight size={16} />}>
                View All
              </Button>
            </Link>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                 <Table.Th></Table.Th>
                {/* <Table.Th>Title</Table.Th> */}
                <Table.Th>Likes</Table.Th>
                {/* <Table.Th>Comments</Table.Th> */}
                <Table.Th>Link</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {blogs?.map((blog) => (
                <Table.Tr
                  key={blog.id}
                  onClick={() =>
                    router.navigate({
                      to: '/blogs/$id/details',
                      params: { id: blog.id },
                    })
                  }
                  className="cursor-pointer transition hover:bg-gray-50"
                >
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar src={blog.authorImage || undefined} alt={blog.title} />
                      <Text fw={500}>{blog.title}</Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Group gap={4}>
                      <Heart size={16} />
                      <Text size="sm">{blog.likes}</Text>
                    </Group>
                  </Table.Td>

                  {/* <Table.Td>
                    <Group gap={4}>
                      <MessageCircle size={16} />
                      <Text size="sm">{blog.comments}</Text>
                    </Group>
                  </Table.Td> */}

                  <Table.Td>
                    <Text c="blue" size="sm" fw={500}>
                      Read
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </section>

      <Divider />

      {/* CONTACT */}
      <section id="contact" className="max-w-4xl mx-auto">
        <Paper
          radius="2xl"
          withBorder
          shadow="sm"
          className="p-8 lg:p-12 text-center bg-white"
        >
          <Stack align="center" gap="md">
            <Badge variant="light" color="indigo" radius="sm">
              Contact
            </Badge>

            <Title order={2} className="text-3xl font-bold">
              Let&apos;s Build Something Great
            </Title>

            <Text c="dimmed" size="lg" className="max-w-2xl leading-8">
              I&apos;m open to freelance work, collaborations, and full-stack
              product opportunities. If you have an idea or project in mind,
              let&apos;s talk.
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