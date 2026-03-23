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
  Badge,
  SimpleGrid,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import {
  ArrowLeft,
  FolderPen,
  Globe,
  ImageIcon,
  Plus,
  Save,
  ShieldCheck,
  Trash,
  Wrench,
  Sparkles,
  Eye,
  Clock3,
  LayoutPanelTop,
} from "lucide-react"
import { getProjectByIdQueryOptions } from "@/db/queries/project.queries"
import { AdminMiddleware } from "@/server/middleware"
import { useState } from "react"
import type { ProjectRequest } from "@/db/schema"
import { useUpdateProjectMutation } from "@/db/mutations/project.mutations"

export const Route = createFileRoute("/admin/projects/$id/edit")({
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
  const updateMutation = useUpdateProjectMutation()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProjectRequest>({
    initialValues: {
      ...project!,
    },
  })

  const handleSubmit = async (values: ProjectRequest) => {
    try {
      setLoading(true)
      await updateMutation.mutateAsync({
        projectId: project?.id!,
        projectShema: { ...values },
      })
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
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="xl">
        <Stack gap="xl">
          <Paper
            radius="2xl"
            p="xl"
            withBorder
            className="overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="flex-start" className="gap-4">
              <Stack gap={8}>
                <Group gap="xs">
                  <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
                    <FolderPen size={18} />
                  </ThemeIcon>
                  <Text fw={600} c="dimmed" size="sm">
                    Admin Workspace
                  </Text>
                </Group>

                <Title order={1} className="text-3xl md:text-5xl">
                  Edit Project
                </Title>

                <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Update your project details, refine the description, adjust the
                  visibility, and keep the technologies and preview image current.
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

          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
            <div className="lg:col-span-2">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="lg">
                  <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                    <Stack gap="lg">
                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon variant="light" color="blue" radius="xl">
                            <LayoutPanelTop size={16} />
                          </ThemeIcon>
                          <Title order={3}>Basic Information</Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Update the core identity of the project.
                        </Text>
                      </div>

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
                        minRows={6}
                        autosize
                        radius="md"
                        size="md"
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
                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon variant="light" color="grape" radius="xl">
                            <Globe size={16} />
                          </ThemeIcon>
                          <Title order={3}>Project Link</Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Update the main public link for this project.
                        </Text>
                      </div>

                      <TextInput
                        label="URL"
                        placeholder="https://myproject.com"
                        radius="md"
                        size="md"
                        leftSection={<Globe size={16} />}
                        {...form.getInputProps("url")}
                      />
                    </Stack>
                  </Card>

                  <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                    <Stack gap="lg">
                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon variant="light" color="orange" radius="xl">
                            <ImageIcon size={16} />
                          </ThemeIcon>
                          <Title order={3}>Project Image</Title>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Update the image URL and check the preview before saving.
                        </Text>
                      </div>

                      <TextInput
                        label="Image URL"
                        placeholder="https://myproject.com/screenshot.png"
                        radius="md"
                        size="md"
                        {...form.getInputProps("imageUrl")}
                      />

                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                        {previewImage ? (
                          <Image
                            src={previewImage}
                            alt={form.values.title || "Project preview"}
                            radius="xl"
                            fit="contain"
                            h={320}
                          />
                        ) : (
                          <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                            No image preview available
                          </div>
                        )}
                      </div>
                    </Stack>
                  </Card>

                  <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                    <Stack gap="lg">
                      <div>
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

                        <Text size="sm" c="dimmed" mt="xs">
                          Add up to 4 technologies used in this project.
                        </Text>
                      </div>

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
            </div>

            <Stack gap="lg">
              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="yellow" radius="xl">
                    <Sparkles size={16} />
                  </ThemeIcon>
                  <Title order={4}>Editing Tips</Title>
                </Group>

                <Stack gap="sm">
                  <Text size="sm" c="dimmed">
                    Refresh the title if the project direction has changed.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Tighten the description so it focuses on the main value.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Make sure the image URL still points to a valid preview.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Keep only the most relevant technologies listed.
                  </Text>
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="gray" radius="xl">
                    <Clock3 size={16} />
                  </ThemeIcon>
                  <Title order={4}>Change Summary</Title>
                </Group>

                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    Current title:
                  </Text>
                  <Text fw={600}>
                    {form.values.title || "Untitled project"}
                  </Text>

                  <Divider my="xs" />

                  <Text size="sm" c="dimmed">
                    Technologies: {form.values.technologies.length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Image preview: {previewImage ? "Available" : "Missing"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Visibility: {form.values.isPublic ? "Public" : "Private"}
                  </Text>
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="indigo" radius="xl">
                    <Eye size={16} />
                  </ThemeIcon>
                  <Title order={4}>Quick Preview</Title>
                </Group>

                <Stack gap="sm">
                  <Text fw={600}>
                    {form.values.title || "Your project title will appear here"}
                  </Text>

                  <Text size="sm" c="dimmed" lineClamp={4}>
                    {form.values.description ||
                      "Update the project description to preview how the summary may look."}
                  </Text>

                  <Group gap="xs" wrap="wrap">
                    {form.values.technologies.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="light" color="indigo" radius="xl">
                        {tech}
                      </Badge>
                    ))}
                  </Group>

                  <Badge
                    variant="light"
                    color={form.values.isPublic ? "green" : "gray"}
                    radius="xl"
                    w="fit-content"
                  >
                    {form.values.isPublic ? "Public" : "Private"}
                  </Badge>
                </Stack>
              </Card>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  )
}