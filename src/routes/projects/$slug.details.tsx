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

function ProjectDetails() {
  const { slug } = Route.useParams()
  const { data: project } = useSuspenseQuery(getProjectBySlugQueryOptions(slug))
  const { isAdmin } = Route.useRouteContext()

  if (!project) {
    return (
      <Container className="py-20 text-center">
        <div className="title2">Project not found</div>
      </Container>
    )
  }

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
                <Text fw={600} c="dimmed" size="sm">
                  Project Details
                </Text>
              </Group>

              <div className="title2">{project.title}</div>

              <Group gap="xs">
                <Badge
                  variant="light"
                  color={project.isPublic ? "teal" : "gray"}
                  radius="md"
                  size="sm"
                  leftSection={
                    project.isPublic
                      ? <Globe2 size={12} />
                      : <Lock size={12} />
                  }
                >
                  {project.isPublic ? "Public" : "Private"}
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

              {isAdmin && (
                <Group gap="xs">
                  {/* Edit Project */}
                  <Link
                    to="/projects/$slug/edit"
                    params={{ slug: project.slug! }}
                  >
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
              )}
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

                {/* Visibility */}
                <Group gap="xs" justify="space-between">
                  <Text size="sm" c="dimmed">Visibility</Text>
                  <Badge
                    variant="light"
                    color={project.isPublic ? "teal" : "gray"}
                    radius="md"
                    size="sm"
                  >
                    {project.isPublic ? "Public" : "Private"}
                  </Badge>
                </Group>

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

                {/* CTA */}
                <Button
                  component="a"
                  href={!project.isPublic? project.url!:project.githubUrl!}
                  target="_blank"
                  radius="md"
                  size="sm"
                  leftSection={<Globe size={16} />}
                  fullWidth
                >
                  {project.isPublic ? "View Source Code" : "Visit Live URL"}
                </Button>
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