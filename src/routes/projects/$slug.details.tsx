import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  Badge,
  Stack,
  Text,
  ThemeIcon,
  RingProgress,
  Progress,
} from "@mantine/core"
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Globe,
  Lock,
  Pencil,
  RefreshCw,
  WandSparkles,
  Globe2,
  Star,
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

// helper — pick colour based on progress value
function progressColor(value: number) {
  if (value >= 80) return "teal"
  if (value >= 50) return "blue"
  if (value >= 25) return "yellow"
  return "red"
}

function ProjectDetails() {
  const { slug } = Route.useParams()
  const { data: project } = useSuspenseQuery(getProjectBySlugQueryOptions(slug))

  if (!project) {
    return (
      <Container className="py-20 text-center">
        <div className="title2">Project not found</div>
      </Container>
    )
  }

  const color = progressColor(project.progress)

  return (
    <div className="space-y-8 py-10">
      <Stack gap="xl">

        {/* ── HEADER ── */}
        <Paper
          radius="2xl"
          p="xl"
          withBorder
          className="overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
        >
          <Group justify="space-between" align="flex-start" className="gap-4">
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="md" size="sm">
                  <WandSparkles size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">Project Details</Text>
              </Group>

              <div className="title2">{project.title}</div>

              <Group gap="xs">
                {/* 👇 fixed: removed isPublic since it's not in your schema */}
                {project.isFeatured && (
                  <Badge
                    variant="light"
                    color="yellow"
                    radius="md"
                    size="sm"
                    leftSection={<Star size={12} />}
                  >
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="light"
                  color={color}
                  radius="md"
                  size="sm"
                >
                  {project.progress}% complete
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
                  Back to Projects
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

        {/* ── BODY ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Left — image + description */}
          <Stack gap="lg">
            <Card radius="2xl" withBorder padding="md" className="overflow-hidden shadow-sm">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title!}
                  radius="md"
                  fit="cover"
                  className="max-h-[460px] w-full"
                />
              ) : (
                <div className="flex h-[340px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                  No project image
                </div>
              )}
            </Card>

            {/* 👇 Progress bar under image */}
            <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" fw={600}>Project Progress</Text>
                  <Text size="sm" fw={700} c={color}>{project.progress}%</Text>
                </Group>
                <Progress
                  value={project.progress}
                  color={color}
                  radius="xl"
                  size="lg"
                  animated={project.progress < 100}
                />
                <Text size="xs" c="dimmed">
                  {project.progress === 100
                    ? "✅ Project complete"
                    : project.progress >= 50
                    ? "Halfway there — keep going!"
                    : "Just getting started"}
                </Text>
              </Stack>
            </Paper>

            <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <div className="title3">About this project</div>
                <Divider />
                <Text className="leading-8 text-slate-700 dark:text-slate-300">
                  {project.description}
                </Text>
              </Stack>
            </Paper>
          </Stack>

          {/* Right — metadata */}
          <Stack gap="lg">
            <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <div className="title3">Project Info</div>
                <Divider />

                {/* 👇 Ring progress in sidebar */}
                <Group justify="center" py="sm">
                  <RingProgress
                    size={120}
                    thickness={10}
                    roundCaps
                    sections={[{ value: project.progress, color }]}
                    label={
                      <Text ta="center" fw={700} size="lg" c={color}>
                        {project.progress}%
                      </Text>
                    }
                  />
                </Group>

                <Divider />

                {/* Created */}
                <Group gap="xs" justify="space-between">
                  <Group gap={6}>
                    <CalendarDays size={15} className="text-slate-400" />
                    <Text size="sm" c="dimmed">Created</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {moment(project.createdAt).fromNow()}
                  </Text>
                </Group>

                {/* Updated */}
                <Group gap="xs" justify="space-between">
                  <Group gap={6}>
                    <RefreshCw size={15} className="text-slate-400" />
                    <Text size="sm" c="dimmed">Last updated</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {moment(project.updatedAt).fromNow()}
                  </Text>
                </Group>

                <Divider />

                {/* 👇 fixed: swapped the condition — was backwards */}
                {project.liveUrl && (
                  <Button
                    component="a"
                    href={project.liveUrl}
                    target="_blank"
                    radius="md"
                    size="sm"
                    leftSection={<Globe size={16} />}
                    fullWidth
                  >
                    Visit Live URL
                  </Button>
                )}

                {project.githubUrl && (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    variant="light"
                    radius="md"
                    size="sm"
                    leftSection={<Globe size={16} />}
                    fullWidth
                  >
                    View Source Code
                  </Button>
                )}
              </Stack>
            </Paper>

            <Link to="/projects">
              <Button
                fullWidth
                variant="subtle"
                radius="md"
                size="sm"
                rightSection={<ExternalLink size={16} />}
              >
                View More Projects
              </Button>
            </Link>
          </Stack>
        </div>
      </Stack>
    </div>
  )
}

export default ProjectDetails