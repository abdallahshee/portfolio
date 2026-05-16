import {
  Button,
  Card,
  Divider,
  Group,
  Image,
  Paper,
  Badge,
  Stack,
  Text,
  ThemeIcon,
  RingProgress,
  Container,
} from "@mantine/core"

import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Globe,
  Pencil,
  RefreshCw,
  WandSparkles,
  Star,
  Github,
  Code2,
} from "lucide-react"

import { createFileRoute, Link } from "@tanstack/react-router"
import { getProjectBySlugQueryOptions } from "@/db/queries/project.queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import moment from "moment"

export const Route = createFileRoute("/projects/$slug/details")({
  loader: async ({ context, params }) => {
    await context.queryClient.fetchQuery(
      getProjectBySlugQueryOptions(params.slug)
    )
  },
  component: ProjectDetails,
})

function progressColor(value: number) {
  if (value === 100) return "teal"
  if (value >= 75) return "blue"
  if (value >= 40) return "yellow"
  return "red"
}

function progressLabel(value: number) {
  if (value === 100) return "Complete"
  if (value >= 75) return "Almost there"
  if (value >= 40) return "In progress"
  return "Just started"
}

function ProjectDetails() {
  const { slug } = Route.useParams()
  const { data: project } = useSuspenseQuery(
    getProjectBySlugQueryOptions(slug)
  )

  if (!project) {
    return (
      <Container className="py-20 text-center">
        <div className="text-2xl font-bold">Project not found</div>
      </Container>
    )
  }

  const color = progressColor(project.progress)
  const label = progressLabel(project.progress)

  const technologies = project.technologies ?? []

  return (
    <div className="space-y-8 py-10">
      <Stack gap="xl">

        {/* HEADER */}
        <Paper radius="xl" p="xl" withBorder className="shadow-sm">
          <Group justify="space-between" align="flex-start">
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
                  <WandSparkles size={18} />
                </ThemeIcon>
                <Text fw={500} c="dimmed" size="sm">
                  Project Details
                </Text>
              </Group>

              <div className="text-3xl font-bold">
                {project.title}
              </div>

              <Group gap="xs" mt={4}>
                {project.isFeatured && (
                  <Badge
                    variant="light"
                    color="yellow"
                    radius="md"
                    size="sm"
                    leftSection={<Star size={11} />}
                  >
                    Featured
                  </Badge>
                )}

                <Badge variant="light" color={color} radius="md" size="sm">
                  {label}
                </Badge>
              </Group>
            </Stack>

            <Group gap="xs">
              <Link to="/projects">
                <Button
                  variant="light"
                  radius="md"
                  size="sm"
                  leftSection={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
              </Link>

              <Link to="/projects/$slug/edit" params={{ slug: project.slug! }}>
                <Button
                  variant="light"
                  color="indigo"
                  radius="md"
                  size="sm"
                  leftSection={<Pencil size={16} />}
                >
                  Edit
                </Button>
              </Link>
            </Group>
          </Group>
        </Paper>

        {/* BODY */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* LEFT */}
          <Stack gap="lg">

            {/* IMAGE */}
            <Card radius="xl" withBorder p="md" className="overflow-hidden shadow-sm">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title ?? "Project image"}
                  radius="lg"
                  fit="cover"
                  h={420}
                />
              ) : (
                <div className="flex h-[340px] items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  No image available
                </div>
              )}
            </Card>

            {/* DESCRIPTION */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Text fw={500} size="sm" c="dimmed" tt="uppercase">
                  About this project
                </Text>

                <Divider />

                <Text size="sm" lh={1.9} c="dimmed">
                  {project.description}
                </Text>
              </Stack>
            </Paper>

            {/* TECHNOLOGIES (NEW) */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Group gap="xs">
                  <Code2 size={16} className="text-slate-500" />
                  <Text fw={500} size="sm" c="dimmed" tt="uppercase">
                    Technologies
                  </Text>
                </Group>

                <Divider />

                {technologies.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    No technologies listed for this project.
                  </Text>
                ) : (
                  <Group gap="xs">
                    {technologies.map((tech: string) => (
                      <Badge
                        key={tech}
                        radius="xl"
                        variant="light"
                        color="blue"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Stack>
            </Paper>

          </Stack>

          {/* RIGHT SIDEBAR */}
          <Stack gap="lg">

            {/* PROGRESS */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md" align="center">
                <Text fw={500} size="sm" c="dimmed" tt="uppercase">
                  Progress
                </Text>

                <Divider w="100%" />

                <RingProgress
                  size={180}
                  thickness={16}
                  roundCaps
                  sections={[{ value: project.progress, color }]}
                  label={
                    <Stack gap={2} align="center">
                      <Text fw={700} size="xl" c={color}>
                        {project.progress}%
                      </Text>
                      <Text size="xs" c="dimmed">
                        {label}
                      </Text>
                    </Stack>
                  }
                />

                <Text size="xs" c="dimmed" ta="center">
                  {project.progress === 100
                    ? "Completed"
                    : `${100 - project.progress}% remaining`}
                </Text>
              </Stack>
            </Paper>

            {/* META */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Text fw={500} size="sm" c="dimmed" tt="uppercase">
                  Info
                </Text>

                <Divider />

                <Group justify="space-between">
                  <Group gap={6}>
                    <CalendarDays size={14} />
                    <Text size="sm" c="dimmed">Created</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {moment(project.createdAt).format("D MMMM YYYY")}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Group gap={6}>
                    <RefreshCw size={14} />
                    <Text size="sm" c="dimmed">Updated</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {moment(project.updatedAt).fromNow()}
                  </Text>
                </Group>
                {/* Live URL */}
                {project.liveUrl ? (
                  <Button
                    component="a"
                    href={project.liveUrl}
                    target="_blank"
                    radius="md"
                    size="sm"
                    leftSection={<Globe size={15} />}
                    fullWidth
                  >
                    Visit live site
                  </Button>
                ) : (
                  <Button
                    radius="md"
                    size="sm"
                    leftSection={<Globe size={15} />}
                    fullWidth
                    disabled
                    variant="light"
                    color="gray"
                  >
                    No live site — API or private deployment
                  </Button>
                )}

                {/* GitHub URL */}
                {project.githubUrl ? (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    variant="light"
                    radius="md"
                    size="sm"
                    leftSection={<Github size={15} />}
                    fullWidth
                  >
                    View source code
                  </Button>
                ) : (
                  <Button
                    radius="md"
                    size="sm"
                    leftSection={<Github size={15} />}
                    fullWidth
                    disabled
                    variant="light"
                    color="gray"
                  >
                    Source code is private
                  </Button>
                )}
              </Stack>
            </Paper>

            <Link to="/projects">
              <Button fullWidth variant="subtle" rightSection={<ExternalLink size={15} />}>
                View more projects
              </Button>
            </Link>

          </Stack>
        </div>
      </Stack>
    </div>
  )
}

export default ProjectDetails