import { getProjectsQueryOptions } from '@/queries/project-querie'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Text, Button, Image, Group, Stack, Badge } from '@mantine/core'
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
  if (!projects) {
    return <div>No projects found</div>
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex flex-col justify-between hover:shadow-lg transition"
          >
            <Stack>

              {/* Project Image */}
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  radius="md"
                  height={180}
                />
              )}

              {/* Title */}
              <Text fw={600} size="lg">
                {project.title}
              </Text>

              {/* Description */}
              <Text size="sm" c="dimmed" lineClamp={3}>
                {project.description}
              </Text>

              {/* Visibility */}
              <Badge color={project.isPublic ? "green" : "gray"}>
                {project.isPublic ? "Public" : "Private"}
              </Badge>
            </Stack>

            {/* Buttons */}
            <Group grow mt="md">
              <Button
                component="a"
                href={project.websiteUrl}
                target="_blank"
                leftSection={<Globe size={16} />}
                variant="light"
              >
                Visit
              </Button>

              {/* <Button
                component={Link}
                to="/projects/details/$projectId"
                params={{ projectId:project.id }}
                rightSection={<ArrowRight size={16} />}
              >
                Details
              </Button> */}
              <Link to="/projects/details/$id"
                params={{ id: project.id }}>
                <Button
                  // component={Link}

                  rightSection={<ArrowRight size={16} />}
                >
                  Details
                </Button>
              </Link>

            </Group>

            {/* Optional Github */}
            {project.githubUrl && (
              <Button
                component="a"
                href={project.githubUrl}
                target="_blank"
                leftSection={<Github size={16} />}
                variant="subtle"
                mt="sm"
              >
                View Source
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}