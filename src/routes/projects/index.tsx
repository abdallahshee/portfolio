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
  Tooltip,
  ActionIcon,
  Rating,
  Modal
} from '@mantine/core'
import { Globe, Github, ArrowRight, Pencil } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import type { Project } from '@/db/project-schema'
import { notifications } from '@mantine/notifications'


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
  const { data: session } = authClient.useSession()
 const [opened, { open, close }] = useDisclosure(false)
 const [selectedProject, setSelectedProject] = useState<Project|null>(null)
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
const handleSelectProject=(project:Project)=>{
  setSelectedProject(project)
  open()
}
  return (
    <Container size="xl" className="py-16">
      <Modal
        opened={opened}
        onClose={close}
        title="Rate Project"
        centered
      >
        {session?.user ?(
           <Stack>
          <Text size="sm">
            Select your rating for <b>{selectedProject?.title}</b>
          </Text>

          <Rating
            // value={rating}
            // onChange={setRating}
            size="lg"
          />

          <Button >
            Submit Rating
          </Button>
        </Stack>
        ):(
           <Stack>
          <Text size="sm">
            Sign In to Rate <b>{selectedProject?.title}</b>
          </Text>
          <Button >
          Login
          </Button>
        </Stack>
        )
        }
       
      </Modal>
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

              {/* Title + Edit Icon */}
              <Group justify="apart" align="center">
                <Title order={4}>{project.title}</Title>

                {session?.user.role === "admin" ?(
                  <Link to="/projects/edit/$id" params={{ id: project.id }}>
                    <Tooltip label="Edit project">
                      <ActionIcon variant="light" size="md">
                        <Pencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Link>
                ):(
                     <Badge onClick={()=>handleSelectProject(project)}>
                    {/* <Tooltip label="Edit project">
                      <ActionIcon variant="light" size="md">
                        <Pencil size={16} />
                      </ActionIcon>
                    </Tooltip> */}
                    Rate Project
                  </Badge>
                )}
              </Group>

              {/* ⭐ Rating */}
              <Rating value={project.rate} fractions={1} readOnly />

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

              {/* Technologies */}
              <Stack gap="xs" mt="xs">
                <Text variant="text" size="md">
                  Main Technologies used
                </Text>

                <div>
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} size="sm" variant="outline" mr="xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Stack>
            </Stack>

            {/* Action Buttons */}
            <Stack mt="md" gap="xs">
              <Group grow justify="space-evenly">
                <Button
                  component="a"
                  href={project.websiteUrl}
                  target="_blank"
                  leftSection={<Globe size={16} />}
                  variant="light"
                >
                  Live Demo
                </Button>

                <Link to="/projects/details/$id" params={{ id: project.id }}>
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