import { createFileRoute, useRouter } from "@tanstack/react-router"
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import type { ProjectRequest } from "@/db/project.schema"
import {
  ArrowLeft,
  FolderPen,
  Globe,
  Github,
  ImageIcon,
  Plus,
  Save,
  ShieldCheck,
  Trash,
  Wrench,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { getProjectByIdQueryOptions } from "@/queries/project.queries"
import { updateProject } from "@/server/project.functions"
import { AdminMiddleware } from "@/server/middleware"
import { useState } from "react"

export const Route = createFileRoute("/projects/$id/edit")({
  server: {
    middleware: [AdminMiddleware],
  },

  loader: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(
      getProjectByIdQueryOptions(params.id)
    )
    return data
  },

  component: RouteComponent,
})

function RouteComponent() {
  const project = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const updateProjectFn = useServerFn(updateProject)
  const [loading, setLoading] = useState(false)

  const form = useForm<ProjectRequest>({
    initialValues: {
      ...project!,
    },
  })

  const handleSubmit = async (values: ProjectRequest) => {
    try {
      setLoading(true)

      await updateProjectFn({
        data: {
          projectId: project?.id!,
          projectShema: { ...values },
        },
      })

      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      await queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryOptions(project!.id).queryKey,
      })

      router.navigate({ to: "/projects" })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addTechnology = () => {
    if (form.values.technologies.length < 4) {
      form.setFieldValue("technologies", [...form.values.technologies, ""])
    }
  }

  const removeTechnology = (index: number) => {
    if (form.values.technologies.length > 1) {
      const updated = form.values.technologies.filter((_, i) => i !== index)
      form.setFieldValue("technologies", updated)
    }
  }

  const previewImage = form.values.imageUrl?.trim()

  return (
    <Container size="xl" className="space-y-8 py-10">
      <Stack gap="xl">
        <Paper
          radius="2xl"
          p="xl"
          withBorder
          className="bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
        >
          <Group justify="space-between" align="flex-start" className="gap-4">
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
                  <FolderPen size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">
                  Admin Panel
                </Text>
              </Group>

              <Title order={1} className="text-3xl md:text-4xl">
                Edit Project
              </Title>

              <Text className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Update project details, links, visibility, image preview, and
                technologies used.
              </Text>
            </Stack>

            <Button
              variant="light"
              radius="xl"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => router.history.back()}
            >
              Back
            </Button>
          </Group>
        </Paper>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="blue" radius="xl">
                    <FolderPen size={16} />
                  </ThemeIcon>
                  <Title order={3}>Basic Information</Title>
                </Group>

                <TextInput
                  label="Project Title"
                  placeholder="My Awesome Project"
                  radius="md"
                  size="md"
                  {...form.getInputProps("title")}
                />

                <Textarea
                  label="Description"
                  placeholder="Describe your project"
                  minRows={5}
                  radius="md"
                  size="md"
                  autosize
                  {...form.getInputProps("description")}
                />

                <Checkbox
                  label="Make project public"
                  {...form.getInputProps("isPublic", { type: "checkbox" })}
                />
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="grape" radius="xl">
                    <Globe size={16} />
                  </ThemeIcon>
                  <Title order={3}>Project Links</Title>
                </Group>

                <TextInput
                  label="Website URL"
                  placeholder="https://myproject.com"
                  radius="md"
                  size="md"
                  leftSection={<Globe size={16} />}
                  {...form.getInputProps("websiteUrl")}
                />

                <TextInput
                  label="GitHub URL"
                  placeholder="https://github.com/username/project"
                  radius="md"
                  size="md"
                  leftSection={<Github size={16} />}
                  {...form.getInputProps("githubUrl")}
                />
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="orange" radius="xl">
                    <ImageIcon size={16} />
                  </ThemeIcon>
                  <Title order={3}>Project Image</Title>
                </Group>

                <TextInput
                  label="Image URL"
                  placeholder="https://myproject.com/screenshot.png"
                  radius="md"
                  size="md"
                  {...form.getInputProps("imageUrl")}
                />

                {previewImage ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                    <Image
                      src={previewImage}
                      alt={form.values.title || "Project preview"}
                      radius="xl"
                      fit="contain"
                      h={320}
                    />
                  </div>
                ) : (
                  <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                    No image preview available
                  </div>
                )}
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="teal" radius="xl">
                      <Wrench size={16} />
                    </ThemeIcon>
                    <Title order={3}>Technologies</Title>
                  </Group>

                  <Button
                    type="button"
                    variant="light"
                    radius="xl"
                    size="sm"
                    leftSection={<Plus size={16} />}
                    onClick={addTechnology}
                    disabled={form.values.technologies.length >= 4}
                  >
                    Add Technology
                  </Button>
                </Group>

                <Text size="sm" c="dimmed">
                  Add up to 4 technologies used in this project.
                </Text>

                <Divider />

                <Stack gap="sm">
                  {form.values.technologies.map((_, index) => (
                    <Group key={index} align="end" gap="sm">
                      <TextInput
                        label={`Technology ${index + 1}`}
                        placeholder="e.g. React, Node.js, Tailwind"
                        radius="md"
                        className="flex-1"
                        {...form.getInputProps(`technologies.${index}`)}
                      />

                      <ActionIcon
                        color="red"
                        variant="light"
                        radius="xl"
                        size="lg"
                        onClick={() => removeTechnology(index)}
                        disabled={form.values.technologies.length === 1}
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>

            <Paper radius="2xl" withBorder p="lg" className="shadow-sm">
              <Group justify="space-between" className="gap-4">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="green" radius="xl">
                    <ShieldCheck size={16} />
                  </ThemeIcon>
                  <Text fw={600}>Ready to save your changes?</Text>
                </Group>

                <Group>
                  <Button
                    type="button"
                    variant="default"
                    radius="xl"
                    onClick={() => router.history.back()}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    radius="xl"
                    loading={loading}
                    leftSection={<Save size={16} />}
                  >
                    Update Project
                  </Button>
                </Group>
              </Group>
            </Paper>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}