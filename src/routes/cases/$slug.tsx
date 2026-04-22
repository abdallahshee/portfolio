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
  Tabs,
  Skeleton,
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
  BookOpen,
  FolderKanban,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { getProjectBySlugNameQueryOptions } from "@/db/queries/project.queries"
import { getCaseStudyByProjectIdQueryOptions } from "@/db/queries/case.queries"
import { Suspense,useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import moment from "moment"


export const Route = createFileRoute("/cases/$slug")({
  loader: async ({ context, params }) => {
    await context.queryClient.fetchQuery(
      getProjectBySlugNameQueryOptions(params.slug)
    )
  },
  component: ProjectDetails,
})

// ── CASE STUDY SKELETON ──
function CaseStudySkeleton() {
  return (
    <Stack gap="lg">
      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Skeleton height={24} width="40%" radius="md" />
          <Divider />
          <Skeleton height={14} radius="md" />
          <Skeleton height={14} width="90%" radius="md" />
          <Skeleton height={14} width="80%" radius="md" />
        </Stack>
      </Paper>
      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Skeleton height={24} width="30%" radius="md" />
          <Divider />
          <Skeleton height={14} radius="md" />
          <Skeleton height={14} width="85%" radius="md" />
          <Skeleton height={14} width="75%" radius="md" />
        </Stack>
      </Paper>
      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Skeleton height={24} width="35%" radius="md" />
          <Divider />
          <Skeleton height={14} radius="md" />
          <Skeleton height={14} width="90%" radius="md" />
        </Stack>
      </Paper>
    </Stack>
  )
}

// ── CASE STUDY CONTENT ──
function CaseStudyContent({ projectId }: { projectId: string }) {
  const { data: caseStudy } = useSuspenseQuery(
    getCaseStudyByProjectIdQueryOptions(projectId)
  )

  if (!caseStudy) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
        <ThemeIcon size={56} radius="md" variant="light" color="gray">
          <BookOpen size={28} />
        </ThemeIcon>
        <Text c="dimmed" size="sm">
          No case study available for this project yet.
        </Text>
      </div>
    )
  }

  return (
    <Stack gap="lg">
      {caseStudy.overview && (
        <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
          <Stack gap="md">
            <div className="title3">Overview</div>
            <Divider />
            <Text className="leading-8 text-slate-700 dark:text-slate-300">
              {caseStudy.overview}
            </Text>
          </Stack>
        </Paper>
      )}

      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <ThemeIcon variant="light" color="red" radius="md" size="sm">
              <Layers size={14} />
            </ThemeIcon>
            <div className="title3">The Problem</div>
          </Group>
          <Divider />
          <Text className="leading-8 text-slate-700 dark:text-slate-300">
            {caseStudy.problem}
          </Text>
        </Stack>
      </Paper>

      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <ThemeIcon variant="light" color="teal" radius="md" size="sm">
              <CheckCircle size={14} />
            </ThemeIcon>
            <div className="title3">The Solution</div>
          </Group>
          <Divider />
          <Text className="leading-8 text-slate-700 dark:text-slate-300">
            {caseStudy.solution}
          </Text>
        </Stack>
      </Paper>

      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <ThemeIcon variant="light" color="indigo" radius="md" size="sm">
              <FolderKanban size={14} />
            </ThemeIcon>
            <div className="title3">Implementation</div>
          </Group>
          <Divider />
          <Text className="leading-8 text-slate-700 dark:text-slate-300">
            {caseStudy.implementation}
          </Text>
        </Stack>
      </Paper>

      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <ThemeIcon variant="light" color="green" radius="md" size="sm">
              <CheckCircle size={14} />
            </ThemeIcon>
            <div className="title3">Outcomes</div>
          </Group>
          <Divider />
          <Text className="leading-8 text-slate-700 dark:text-slate-300">
            {caseStudy.outcomes}
          </Text>
        </Stack>
      </Paper>

      {caseStudy.technologies && caseStudy.technologies.length > 0 && (
        <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
          <Stack gap="md">
            <div className="title3">Technologies Used</div>
            <Divider />
            <Group gap="sm" wrap="wrap">
              {caseStudy.technologies.map((tech: string) => (
                <Badge key={tech} variant="light" color="indigo" radius="md" size="md">
                  {tech}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Paper>
      )}

      <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
        <Stack gap="md">
          <Group gap="xs">
            <ThemeIcon variant="light" color="orange" radius="md" size="sm">
              <Clock size={14} />
            </ThemeIcon>
            <div className="title3">Timeline</div>
          </Group>
          <Divider />
          <Group gap="xs" justify="space-between">
            <Group gap={6}>
              <CalendarDays size={15} className="text-slate-400" />
              <Text size="sm" c="dimmed">Start Date</Text>
            </Group>
            <Text size="sm" fw={500}>
              {moment(caseStudy.startDate).format('MMM D, YYYY')}
            </Text>
          </Group>
          <Group gap="xs" justify="space-between">
            <Group gap={6}>
              <CalendarDays size={15} className="text-slate-400" />
              <Text size="sm" c="dimmed">End Date</Text>
            </Group>
            <Text size="sm" fw={500}>
              {moment(caseStudy.endDate).format('MMM D, YYYY')}
            </Text>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}

// ── MAIN COMPONENT ──
function ProjectDetails() {
  const { slug } = Route.useParams()
  const {isAdmin}=Route.useRouteContext()
  const { data: project } = useSuspenseQuery(getProjectBySlugNameQueryOptions(slug))
  const [activeTab, setActiveTab] = useState<string | null>('details')

  if (!project) {
    return (
      <Container className="py-20 text-center">
        <div className="title2">Project not found</div>
      </Container>
    )
  }

  return (
    <Container size="xl" className="space-y-8 py-10">
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
                  leftSection={project.isPublic ? <Globe2 size={12} /> : <Lock size={12} />}
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
                <Link to="/projects/$slug/edit" params={{ slug: project.slug! }}>
                  <Button
                    variant="light"
                    color="indigo"
                    radius="md"
                    size="sm"
                    leftSection={<Pencil size={16} />}
                  >
                    Edit Project
                  </Button>
                </Link>
              )}
            </Group>
          </Group>
        </Paper>

        {/* ── BODY ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left — tabs */}
          <Stack gap="lg">
            <Tabs value={activeTab} onChange={setActiveTab} radius="md" keepMounted={false}>
              <Tabs.List mb="lg">
                <Tabs.Tab value="details" leftSection={<FolderKanban size={15} />}>
                  Project Details
                </Tabs.Tab>
                <Tabs.Tab value="case-study" leftSection={<BookOpen size={15} />}>
                  Case Study
                </Tabs.Tab>
              </Tabs.List>

              {/* ── DETAILS TAB ── */}
              <Tabs.Panel value="details">
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
              </Tabs.Panel>

              {/* ── CASE STUDY TAB ── */}
              <Tabs.Panel value="case-study">
                <Suspense fallback={<CaseStudySkeleton />}>
                  <CaseStudyContent projectId={project.id} />
                </Suspense>
              </Tabs.Panel>
            </Tabs>
          </Stack>

          {/* Right — metadata */}
          <Stack gap="lg">
            <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <div className="title3">Project Info</div>
                <Divider />

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

                <Group gap="xs" justify="space-between">
                  <Group gap={6}>
                    <CalendarDays size={15} className="text-slate-400" />
                    <Text size="sm" c="dimmed">Created</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {moment(project.createdAt).fromNow()}
                  </Text>
                </Group>

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

                {/* Live URL / Source Code */}
                <Button
                  component="a"
                  href={project.url}
                  target="_blank"
                  radius="md"
                  size="sm"
                  leftSection={<Globe size={16} />}
                  fullWidth
                >
                  {project.isPublic ? "View Source Code" : "Visit Live URL"}
                </Button>

                {/* Add Case Study — authenticated only */}
                {isAdmin && (
                  <Link
                    to="/cases/new/$projectId"
                    params={{ projectId: project.id }}
                  >
                    <Button
                      variant="light"
                      color="indigo"
                      radius="md"
                      size="sm"
                      leftSection={<BookOpen size={16} />}
                      fullWidth
                    >
                      Add Case Study
                    </Button>
                  </Link>
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
    </Container>
  )
}

export default ProjectDetails