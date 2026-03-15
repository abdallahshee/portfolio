import { getProjectsQueryOptions } from '@/queries/project.queries'
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
  Modal,
  Pagination,
} from '@mantine/core'
import { Globe, Github, ArrowRight } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Project } from '@/db/project.schema'

const PAGE_SIZE = 6

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getProjectsQueryOptions(1, PAGE_SIZE))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session } = authClient.useSession()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getProjectsQueryOptions(page, PAGE_SIZE),
    placeholderData: (prev) => prev, // keep previous page data while fetching next
  })

  const projects = data?.projects ?? []
  const totalPages = data?.totalPages ?? 1

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isLoading && projects.length === 0) {
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
      <Modal opened={opened} onClose={close} title="Rate Project" centered>
        {session?.user ? (
          <Stack>
            <Text size="sm">
              Select your rating for <b>{selectedProject?.title}</b>
            </Text>
            <Rating size="lg" />
            <Button>Submit Rating</Button>
          </Stack>
        ) : (
          <Stack>
            <Text size="sm">
              Sign In to Rate <b>{selectedProject?.title}</b>
            </Text>
            <Button>Login</Button>
          </Stack>
        )}
      </Modal>

      {/* Page Header */}
      <div className="max-w-2xl mb-12">
        <Title order={1} className="text-4xl font-bold mb-4">
          Projects I've Built
        </Title>
        <Text size="lg" c="dimmed">
          Here is a collection of applications and platforms I have designed
          and developed. These projects showcase my ability to build scalable,
          production-ready web applications using modern technologies like
          React, TanStack Start, Drizzle ORM, and PostgreSQL.
        </Text>
      </div>

      <div className="border-b border-gray-200 mb-12" />

      {/* Projects Grid */}
      <div
        className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${
          isPlaceholderData ? 'opacity-60' : 'opacity-100'
        }`}
      >
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
              <div className="overflow-hidden rounded-md h-[180px] bg-gray-100 flex items-center justify-center">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    height={180}
                    fit="cover"
                    className="w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <Text size="sm" c="dimmed">No image</Text>
                )}
              </div>

              {/* Title */}
              <Group justify="apart" align="center">
                <Title order={4}>{project.title}</Title>
              </Group>

              {/* Rating */}
              <Rating value={project.totalRatings} fractions={1} readOnly />

              {/* Status Badge + GitHub */}
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
                <Text size="md">Main Technologies used</Text>
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
                <Link to="/projects/$id/details" params={{ id: project.id }}>
                  <Button rightSection={<ArrowRight size={16} />}>
                    Details
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={page}
            onChange={handlePageChange}
            total={totalPages}
            radius="md"
            withEdges
          />
        </Group>
      )}
    </Container>
  )
}