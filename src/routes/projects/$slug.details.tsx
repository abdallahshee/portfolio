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
  Container,
} from "@mantine/core"

import {
  ArrowLeft,
  CalendarDays,
  Globe,
  RefreshCw,
  WandSparkles,
  Star,
  Github,
  Code2,
  ListChecks,
  CheckCircle2,
  User,
  Users,
  Rocket,
  Circle,
  FolderKanban,
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
  if (value >= 50) return "cyan"
  if (value >= 40) return "yellow"
  return "red"
}

function progressLabel(value: number) {
  if (value === 100) return "Complete"
  if (value >= 75) return "Almost there"
  if (value >= 50) return "Halfway through"
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


  const technologies = project.technologies ?? []
  const roles = project.roles ?? []
  const nextSteps = project.nextSteps ?? []

  return (
    <div className="grid grid-cols-1 gap-6 py-10">

      {/* HEADER — title/actions + project info row (progress, dates, links) */}
      <Paper radius="sm" p="xl" withBorder className="shadow-sm">
        <Stack gap="lg">
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

              <div className="text-3xl font-bold">{project.title}</div>

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

            

                {project.isContributor ? (
                  <Badge
                    variant="light"
                    color="grape"
                    radius="md"
                    size="sm"
                    leftSection={<Users size={11} />}
                  >
                    Collaborative Project
                  </Badge>
                ) : (
                  <Badge
                    variant="light"
                    color="teal"
                    radius="md"
                    size="sm"
                    leftSection={<User size={11} />}
                  >
                    Solo Project
                  </Badge>
                )}
              </Group>
            </Stack>

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
          </Group>

          <Divider />

          {/* PROJECT INFO ROW — dates, live/source links */}
          <Group justify="space-between" align="center" wrap="wrap" gap="xl">
            <Group gap="xl" wrap="wrap">
              <Group gap="sm">
                <ThemeIcon variant="light" color="gray" radius="xl" size="lg">
                  <CalendarDays size={16} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    Created
                  </Text>
                  <Text size="sm" fw={500}>
                    {moment(project.createdAt).format("D MMMM YYYY")}
                  </Text>
                </Stack>
              </Group>

              <Group gap="sm">
                <ThemeIcon variant="light" color="gray" radius="xl" size="lg">
                  <RefreshCw size={16} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    Updated
                  </Text>
                  <Text size="sm" fw={500}>
                    {moment(project.updatedAt).fromNow()}
                  </Text>
                </Stack>
              </Group>
            </Group>

            <Group gap="sm" wrap="wrap">
              {project.liveUrl ? (
                <Button
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  radius="md"
                  size="sm"
                  leftSection={<Globe size={15} />}
                >
                  Visit live site
                </Button>
              ) : (
                <Button
                  radius="md"
                  size="sm"
                  leftSection={<Globe size={15} />}
                  disabled
                  variant="light"
                  color="gray"
                >
                  No live site
                </Button>
              )}

              {project.githubUrl ? (
                <Button
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  variant="light"
                  radius="md"
                  size="sm"
                  leftSection={<Github size={15} />}
                >
                  View source
                </Button>
              ) : (
                <Button
                  radius="md"
                  size="sm"
                  leftSection={<Github size={15} />}
                  disabled
                  variant="light"
                  color="gray"
                >
                  Source is private
                </Button>
              )}
            </Group>
          </Group>
        </Stack>
      </Paper>

      {/* TECH STACK — moved up so it's scannable immediately after the header */}
      <Paper p="sm" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <Code2 size={16} className="text-slate-500" />
            <Text fw={500} size="sm" c="dimmed" tt="uppercase">
              Tech Stack
            </Text>
          </Group>
          <Divider />
          {technologies.length === 0 ? (
            <Text size="sm" c="dimmed">
              No technologies listed for this project.
            </Text>
          ) : (
            <Group gap="xs">
              {technologies.map((tech: string, index: number) => (
                <Badge key={`${tech}-${index}`} radius="xl" variant="light" color="blue">
                  {tech}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
      </Paper>

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
          <div className="flex h-[340px] flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FolderKanban size={32} />
            <span className="text-sm">No image available</span>
          </div>
        )}
      </Card>

      {/* ABOUT */}
      <Paper p="sm" className="shadow-sm">
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

      {/* MY ROLE */}
      <Paper p="sm" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <ListChecks size={16} className="text-slate-500" />
            <Text fw={500} size="sm" c="dimmed" tt="uppercase">
              My Role
            </Text>
          </Group>
          <Divider />
          {roles.length === 0 ? (
            <Text size="sm" c="dimmed">
              No role details listed for this project.
            </Text>
          ) : (
            <Stack gap="sm">
              {roles.map((role: string, index: number) => (
                <Group key={index} gap="sm" align="flex-start" wrap="nowrap">
                  <ThemeIcon
                    variant="light"
                    color="indigo"
                    radius="xl"
                    size="sm"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  >
                    <CheckCircle2 size={12} />
                  </ThemeIcon>
                  <Text size="sm" lh={1.7} c="dimmed">
                    {role}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </div>
  )
}

export default ProjectDetails