import { getTopProjectsQueryOptions } from '@/queries/project-querie'
import {
  Badge,
  Button,
  Container,
  Text,
  Title,
  Card,
  Image,
  Group,
  Stack,
  Rating,
  Divider
} from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Mail, Github, Linkedin } from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const data = await context.queryClient.fetchQuery(
      getTopProjectsQueryOptions(3)
    )
    return data
  },
  component: App
})

function App() {
  const projects = Route.useLoaderData()

  return (
    <Container size="xl" className="py-24 space-y-32">

      {/* HERO SECTION */}
      <section className="grid lg:grid-cols-2 gap-16 items-center">

        <div className="space-y-8">

          <Text className="uppercase tracking-widest text-indigo-500 font-semibold">
            Hello, I'm Abdallah Shee
          </Text>

          <Title className="text-4xl lg:text-5xl font-bold leading-tight">
            Full-Stack Developer crafting
            <span className="text-indigo-500"> scalable modern web apps</span>
          </Title>

          <Text size="lg" c="dimmed" className="max-w-xl">
            I design and build production-ready web platforms using
            React, TanStack Start, Drizzle ORM and PostgreSQL.
            My focus is performance, scalability and clean architecture.
          </Text>

          <Group>
            <Button
              component="a"
              href="#projects"
              size="md"
              className="bg-indigo-500 hover:bg-indigo-600"
              rightSection={<ArrowRight size={18} />}
            >
              View Projects
            </Button>

            <Button
              component="a"
              href="#contact"
              variant="outline"
            >
              Contact Me
            </Button>
          </Group>

          {/* TECH STACK */}
          <Group mt="lg">
            {[
              "React",
              "TanStack Start",
              "TypeScript",
              "Drizzle ORM",
              "PostgreSQL",
              "TailwindCSS"
            ].map((tech) => (
              <Badge key={tech} variant="light" color="indigo">
                {tech}
              </Badge>
            ))}
          </Group>

        </div>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
            alt="Abdallah Shee"
            className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
          />
        </div>

      </section>

      <Divider />

      {/* ABOUT SECTION */}
      <section className="max-w-3xl">

        <Title order={2} className="text-3xl font-bold mb-6">
          About Me
        </Title>

        <Text size="lg" c="dimmed">
          I'm a full-stack developer passionate about building modern web
          applications that are scalable, fast and user-friendly.
          I enjoy working across the entire stack — from crafting elegant
          front-end interfaces to designing efficient backend systems.
        </Text>

        <Text size="lg" c="dimmed" mt="md">
          My stack focuses on modern TypeScript technologies including
          React, TanStack Start, Drizzle ORM and PostgreSQL.
        </Text>

      </section>

      <Divider />

      {/* PROJECTS */}
      <section id="projects">

        <div className="mb-12">

          <Title order={2} className="text-3xl font-bold mb-2">
            Featured Projects
          </Title>

          <Text c="dimmed">
            A selection of some of my best work.
          </Text>

        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => {
            const isNew =
              new Date(project.createdAt).getTime() >
              Date.now() - 1000 * 60 * 60 * 24 * 30

            return (
              <Card
                key={project.id}
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                className="flex flex-col justify-between hover:shadow-xl transition"
              >
                <Stack>

                  {/* IMAGE */}
                  {project.imageUrl && (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      height={180}
                      className="rounded-md object-cover"
                    />
                  )}

                  {/* TITLE + BADGE */}
                  <Group justify="space-between">
                    <Title order={4}>{project.title}</Title>

                    {isNew && (
                      <Badge color="green" variant="light">
                        New
                      </Badge>
                    )}
                  </Group>

                  {/* RATING */}
                  <Rating value={project.rate} readOnly />

                  {/* CREATED DATE */}
                  <Text size="sm" c="dimmed">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </Text>

                  {/* BUTTON */}
                  <Link
                    to="/projects/details/$id"
                    params={{ id: project.id }}
                  >
                    <Button
                      fullWidth
                      rightSection={<ArrowRight size={16} />}
                    >
                      View Project
                    </Button>
                  </Link>

                </Stack>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center mt-12">

          <Link to="/projects">
            <Button
              size="lg"
              variant="outline"
              rightSection={<ArrowRight size={18} />}
            >
              View All Projects
            </Button>
          </Link>

        </div>

      </section>

      <Divider />

      {/* CONTACT */}
      <section
        id="contact"
        className="text-center space-y-6 max-w-2xl mx-auto"
      >

        <Title order={2} className="text-3xl font-bold">
          Let's Work Together
        </Title>

        <Text c="dimmed" size="lg">
          I'm always open to discussing new opportunities,
          collaborations or interesting projects.
        </Text>

        <Group justify="center">

          <Button
            component="a"
            href="mailto:abdallah@example.com"
            leftSection={<Mail size={18} />}
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

      </section>

    </Container>
  )
}