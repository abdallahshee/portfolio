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
  ListChecks,
  CheckCircle2,
  User,
  Users,
  Rocket,
  Circle,
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
  const { user } = Route.useRouteContext()
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
  const roles = project.roles ?? []
  const nextSteps = project.nextSteps ?? []

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
              {user &&
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
              }
            </Group>
          </Group>
        </Paper>

        {/* BODY */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">

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

            {/* MY ROLE */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
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

            {/* TECHNOLOGIES */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Group gap="xs">
                  <Code2 size={16} className="text-slate-500" />
                  <Text fw={500} size="sm" c="dimmed" tt="uppercase">
                    Technologies Used
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

            {/* NEXT STEPS */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Group gap="xs">
                  <Rocket size={16} className="text-slate-500" />
                  <Text fw={500} size="sm" c="dimmed" tt="uppercase">
                    What's Next
                  </Text>
                </Group>

                <Divider />

                {nextSteps.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    {project.progress === 100
                      ? "This project is complete — no further steps planned."
                      : "No upcoming steps listed for this project yet."}
                  </Text>
                ) : (
                  <Stack gap="sm">
                    {nextSteps.map((step: string, index: number) => (
                      <Group key={index} gap="sm" align="flex-start" wrap="nowrap">
                        <ThemeIcon
                          variant="light"
                          color="orange"
                          radius="xl"
                          size="sm"
                          style={{ flexShrink: 0, marginTop: 2 }}
                        >
                          <Circle size={10} />
                        </ThemeIcon>
                        <Text size="sm" lh={1.7} c="dimmed">
                          {step}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>

          </Stack>

          {/* RIGHT SIDEBAR */}
          <Stack gap="lg">

            {/* META */}
            <Paper radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Text fw={500} size="sm" c="dimmed" tt="uppercase" className="text-center">
                  Info
                </Text>

                <Divider />
                <Stack gap="md" align="center">
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
              <Button fullWidth variant="outline" rightSection={<ExternalLink size={15} />}>
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