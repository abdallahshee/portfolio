import { getProjectsQueryOptions } from '@/queries/project-querie'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  Text,
  Button,
  Image,
  Group,
  Stack,
  Badge,
  Title,
  Container,
} from '@mantine/core'
import { Globe, Github, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    const data = await context.queryClient.fetchQuery(
      getProjectsQueryOptions()
    )
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const projects = Route.useLoaderData()

  if (!projects || projects.length === 0) {
    return (
      <Container size="sm" className="py-24 text-center">
        <Title order={2}>No projects yet</Title>
        <Text c="dimmed" mt="sm">
          Projects will appear here once they are added to the portfolio.
        </Text>
      </Container>
    )
  }

  return (
    <Container size="xl" className="py-16">

      {/* Page Header */}
      <div className="max-w-2xl mb-12">
        <Title order={1} className="text-4xl font-bold mb-4">
          Projects I’ve Built
        </Title>

        <Text size="lg" c="dimmed">
          Here is a collection of applications and platforms I have designed
          and developed. These projects showcase my ability to build
          scalable, production-ready web applications using modern
          technologies like React, TanStack Start, Drizzle ORM, and
          PostgreSQL.
        </Text>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-12"></div>

      {/* Projects Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            shadow="sm"
            padding="lg"
            radius="lg"
            withBorder
            className="flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <Stack gap="sm">

              {/* Image */}
              {project.imageUrl && (
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    height={180}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              {/* Title */}
              <Title order={4}>{project.title}</Title>

              {/* Status Badge + Optional GitHub Button */}
              <Group gap="sm">
                <Badge
                  color={project.isPublic ? "green" : "gray"}
                  variant="light"
                  className="w-fit"
                >
                  {project.isPublic ? "Open Source" : "Private Project"}
                </Badge>

                {project.isPublic && project.githubUrl && (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    variant="subtle"
                    leftSection={<Github size={18} />}
                    size="xs"
                  >
                    View Source
                  </Button>
                )}
              </Group>

              {/* Description */}
              <Text size="sm" c="dimmed" lineClamp={3}>
                {project.description}
              </Text>

              {/* Example Tech Stack */}
              <Group gap="xs" mt="xs">
                {["React", "TypeScript", "PostgreSQL"].map((tech) => (
                  <Badge key={tech} size="sm" variant="outline">
                    {tech}
                  </Badge>
                ))}
              </Group>
            </Stack>

            {/* Action Buttons */}
            <Stack mt="md" gap="xs">
              <Group grow>
                <Button
                  component="a"
                  href={project.websiteUrl}
                  target="_blank"
                  leftSection={<Globe size={16} />}
                  variant="light"
                >
                  Live Demo
                </Button>

                <Link
                  to="/projects/details/$id"
                  params={{ id: project.id }}
                >
                  <Button rightSection={<ArrowRight size={16} />}>
                    Details
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Card>
        ))}
      </div>
    </Container>
  )
}