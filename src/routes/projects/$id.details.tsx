import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  Rating,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core"
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Github,
  Globe,
  Lock,
  Pencil,
  ShieldCheck,
  Star,
  WandSparkles,
} from "lucide-react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { getProjectByIdQueryOptions } from "@/queries/project.queries"
import { authClient } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { rateProjectMutationOptions } from "@/queries/project-rating.queries"

export const Route = createFileRoute("/projects/$id/details")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(
      getProjectByIdQueryOptions(params.id)
    )
    return data
  },
  component: ProjectDetails,
})

function ProjectDetails() {
  const { id } = Route.useParams()
const { data: project } = useSuspenseQuery(getProjectByIdQueryOptions(id))
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(0)

  const rateMutation = useMutation({
    ...rateProjectMutationOptions(),
    onSuccess: () => {
      if (!project) return
      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryOptions(project.id).queryKey,
      })
    },
  })

  useEffect(() => {
    if (typeof project?.userRating === "number") {
      setRating(project.userRating)
    }
  }, [project?.userRating])

  if (!project) {
    return (
      <Container className="py-20 text-center">
        <Title order={2}>Project not found</Title>
      </Container>
    )
  }

  const hasRated = project.userRating !== null

  const handleSubmitRating = async () => {
    if (!session.data?.user || !rating) return

    try {
      await rateMutation.mutateAsync({
        projectId: project.id,
        rating,
      })
      
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      <Stack gap="xl">
        <Paper
          radius="2xl"
          p="xl"
          withBorder
          className="overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
        >
          <Group justify="space-between" align="flex-start" className="gap-4">
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
                  <WandSparkles size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">
                  Project Details
                </Text>
              </Group>

              <Title order={1} className="text-3xl md:text-5xl">
                {project.title}
              </Title>

              <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Explore the project details, technologies used, useful links, and
                community rating.
              </Text>
            </Stack>

            <Group gap="xs">
  <Link to="/projects">
    <Button
      variant="light"
      radius="xl"
      leftSection={<ArrowLeft size={16} />}
    >
      Back to Projects
    </Button>
  </Link>

  {session.data?.user?.role === "admin" && (
    <Link to="/projects/$id/edit" params={{ id: project.id }}>
      <Button
        variant="light"
        color="indigo"
        radius="xl"
        leftSection={<Pencil size={16} />}
      >
        Edit Project
      </Button>
    </Link>
  )}
</Group>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
          <div className="lg:col-span-2">
            <Card
              radius="2xl"
              withBorder
              padding="md"
              className="overflow-hidden shadow-sm"
            >
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  radius="xl"
                  fit="cover"
                  className="max-h-[460px] w-full"
                />
              ) : (
                <div className="flex h-[340px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                  No project image
                </div>
              )}
            </Card>

            <Paper radius="2xl" withBorder p="xl" mt="lg" className="shadow-sm">
              <Stack gap="lg">
                <div>
                  <Title order={3} className="mb-2">
                    About this project
                  </Title>
                  <Text className="leading-8 text-slate-700 dark:text-slate-300">
                    {project.description}
                  </Text>
                </div>

                <Divider />

                <div>
                  <Group gap="xs" mb="sm">
                    <ThemeIcon variant="light" color="indigo" radius="xl">
                      <ShieldCheck size={16} />
                    </ThemeIcon>
                    <Text fw={700}>Main Technologies Used</Text>
                  </Group>

                  <Group gap="sm" wrap="wrap">
                    {project.technologies?.map((tech: string) => (
                      <Badge
                        key={tech}
                        size="lg"
                        radius="xl"
                        variant="light"
                        color="indigo"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </Group>
                </div>
              </Stack>
            </Paper>
          </div>

          <Stack gap="lg">
            <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="yellow" radius="xl">
                      <Star size={16} />
                    </ThemeIcon>
                    <Text fw={700} size="lg">
                      Project Rating
                    </Text>
                  </Group>

                  <Badge variant="light" color="yellow" radius="xl">
                    {project.totalRatings} votes
                  </Badge>
                </Group>

                <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
                  <Group justify="space-between" align="end">
                    <div>
                      <Text size="sm" c="dimmed">
                        Average rating
                      </Text>
                      <Title order={2} className="text-4xl">
                        {project.averageRating}/10
                      </Title>
                    </div>

                    <div className="text-right">
                      <Text size="sm" c="dimmed">
                        Total ratings
                      </Text>
                      <Text fw={700} size="xl">
                        {project.totalRatings}
                      </Text>
                    </div>
                  </Group>

                  <Rating
                    value={Math.round(project.averageRating)}
                    readOnly
                    count={10}
                    mt="md"
                  />
                </div>

                <Divider />

                {session.data?.user ? (
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Text fw={700}>
                        {hasRated ? "Update your rating" : "Rate this project"}
                      </Text>

                      {hasRated && (
                        <Badge radius="xl" color="green" variant="light">
                          Your rating: {project.userRating}/10
                        </Badge>
                      )}
                    </Group>

                    <Text size="sm" c="dimmed">
                      Give a score from 1 to 10.
                    </Text>

                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <Rating
                        count={10}
                        value={rating}
                        onChange={setRating}
                        size="lg"
                      />
                    </div>

                    <Text size="sm" c="dimmed">
                      Selected rating: {rating || 0}/10
                    </Text>

                    <Button
                      radius="xl"
                      onClick={handleSubmitRating}
                      loading={rateMutation.isPending}
                      disabled={!rating}
                      leftSection={<Star size={16} />}
                    >
                      {hasRated ? "Update Rating" : "Submit Rating"}
                    </Button>
                  </Stack>
                ) : (
                  <Paper
                    radius="xl"
                    p="md"
                    className="border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <Group align="flex-start" gap="sm">
                      <ThemeIcon variant="light" color="gray" radius="xl">
                        <Lock size={16} />
                      </ThemeIcon>

                      <div>
                        <Text fw={700}>Login required</Text>
                        <Text size="sm" c="dimmed">
                          Sign in to rate this project.
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                )}
              </Stack>
            </Paper>

            <Paper radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="md">
                <Text fw={700} size="lg">
                  Project Info
                </Text>

                <Group justify="space-between" align="center">
                  <Text c="dimmed">Visibility</Text>
                  <Badge
                    color={project.isPublic ? "green" : "gray"}
                    variant="light"
                    radius="xl"
                  >
                    {project.isPublic ? "Public" : "Private"}
                  </Badge>
                </Group>

                <Divider />

                <Group justify="space-between" align="flex-start">
                  <Group gap="xs">
                    <Github size={16} className="mt-1 text-slate-500" />
                    <Text c="dimmed">GitHub</Text>
                  </Group>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[68%] break-all text-right text-blue-600 hover:underline"
                  >
                    {project.githubUrl}
                  </a>
                </Group>

                <Group justify="space-between" align="flex-start">
                  <Group gap="xs">
                    <Globe size={16} className="mt-1 text-slate-500" />
                    <Text c="dimmed">Website</Text>
                  </Group>

                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[68%] break-all text-right text-blue-600 hover:underline"
                  >
                    {project.websiteUrl}
                  </a>
                </Group>

                <Divider />

                <Group gap="xs">
                  <CalendarDays size={16} className="text-slate-500" />
                  <Text size="sm" c="dimmed">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </Text>
                </Group>

                <Group gap="xs">
                  <CalendarDays size={16} className="text-slate-500" />
                  <Text size="sm" c="dimmed">
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Stack>
            </Paper>

            <Group grow>
              {project.websiteUrl && (
                <Button
                  component="a"
                  href={project.websiteUrl}
                  target="_blank"
                  radius="xl"
                  leftSection={<Globe size={16} />}
                >
                  Live Demo
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  component="a"
                  href={project.githubUrl}
                  target="_blank"
                  radius="xl"
                  variant="light"
                  leftSection={<Github size={16} />}
                >
                  GitHub
                </Button>
              )}
            </Group>

            <Link to="/projects">
              <Button
                fullWidth
                variant="subtle"
                radius="xl"
                rightSection={<ExternalLink size={16} />}
              >
                View More Projects
              </Button>
            </Link>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

export default ProjectDetails