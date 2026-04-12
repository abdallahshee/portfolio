import { createFileRoute, useRouter } from "@tanstack/react-router"
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  FileInput,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import {
  ArrowLeft,
  FolderPlus,
  Globe,
  ImagePlus,
  Plus,
  Save,
  ShieldCheck,
  Trash,
  Wrench,
  CalendarRange,
  FileText,
  Sparkles,
} from "lucide-react"

import { useMemo, useState } from "react"
import { ProjectSchema, type ProjectRequest } from "@/db/validations/project.types"
import { useProjectCreateMutation } from "@/db/mutations/project.mutations"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { AdminMiddleware } from "@/server/middleware/auth.middleware"

export const Route = createFileRoute("/admin/projects/create")({
  server: {
    middleware: [AdminMiddleware],
  },
  component: RouteComponent,
})


function RouteComponent() {
  const form = useForm<ProjectRequest>({
    initialValues: {
      title: "",
      url: "",
      description: "",
      imageUrl: "",
      isPublic: true,
    },
    validate: zod4Resolver(ProjectSchema),
    validateInputOnBlur: true,
  })

  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const createProject = useProjectCreateMutation()

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const handleSubmit = async (values: ProjectRequest) => {
    try {
      setLoading(true)

      let uploadedImageUrl = values.imageUrl || ""

      if (file) {
        // Replace with your upload logic
        // uploadedImageUrl = await uploadProjectImage(file)
      }

      await createProject.mutateAsync({
        ...values,
        imageUrl: uploadedImageUrl,
      })

      router.history.back()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const titleLength = form.values.title.trim().length
  const descriptionLength = form.values.description.trim().length
  // const completedTechnologies = form.values.technologies.filter((tech) => tech.trim().length > 0).length

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
                  <FolderPlus size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">
                  Admin Panel
                </Text>
              </Group>

              <div className="title3">Create New Project</div>

              <Text className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Add a new project with its core details, public link, image, date range,
                technologies used, and a strong case study so it is ready to display professionally.
              </Text>
            </Stack>

            <Button
              variant="light"
              radius="md"
              size="sm"
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
                    <FileText size={16} />
                  </ThemeIcon>
                  <div className="title3">Basic Information</div>
                </Group>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <div>
                    <TextInput
                      label="Project Title"
                      placeholder="e.g. Fitness Booking Platform"
                      radius="md"
                      size="sm"
                      {...form.getInputProps("title")}
                    />
                    <Text size="xs" c="dimmed" mt={4}>
                      {titleLength}/40 characters
                    </Text>
                  </div>

                  <TextInput
                    label="Live Project URL"
                    placeholder="https://myproject.com"
                    radius="md"
                    size="sm"
                    leftSection={<Globe size={16} />}
                    {...form.getInputProps("url")}
                  />
                </SimpleGrid>

                <div>
                  <Textarea
                    label="Short Description"
                    placeholder="Write a concise summary of the project"
                    minRows={4}
                    autosize
                    radius="md"
                    size="sm"
                    {...form.getInputProps("description")}
                  />
                  <Text size="xs" c="dimmed" mt={4}>
                    {descriptionLength}/160 characters
                  </Text>
                </div>

                <Checkbox
                  label="Make project public"
                  {...form.getInputProps("isPublic", { type: "checkbox" })}
                />

                <Text size="sm" c="dimmed">
                  Public projects can be shown on your portfolio. Private projects can still
                  be stored for internal/admin use.
                </Text>
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="grape" radius="xl">
                    <CalendarRange size={16} />
                  </ThemeIcon>
                  <div className="title3">Project Duration</div>
                </Group>

                <Text size="sm" c="dimmed">
                  Use the actual time range the project was actively worked on. The end date should not be before the start date.
                </Text>
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="orange" radius="xl">
                    <ImagePlus size={16} />
                  </ThemeIcon>
                  <div className="title3">Project Image</div>
                </Group>

                <FileInput
                  label="Upload Image"
                  placeholder="Choose project image"
                  radius="md"
                  size="sm"
                  leftSection={<ImagePlus size={16} />}
                  accept="image/*"
                  value={file}
                  onChange={(e) => setFile(e)}
                />

                <TextInput
                  label="Image URL"
                  placeholder="Or paste an image URL"
                  radius="md"
                  size="sm"
                  {...form.getInputProps("imageUrl")}
                />

                {previewUrl || form.values.imageUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                    <Image
                      src={previewUrl || form.values.imageUrl}
                      alt={form.values.title || "Project preview"}
                      radius="md"
                      fit="contain"
                      h={320}
                    />
                  </div>
                ) : (
                  <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40">
                    No image selected
                  </div>
                )}
              </Stack>
            </Card>

            {/* <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="teal" radius="xl">
                      <Wrench size={16} />
                    </ThemeIcon>
                    <div className="title3">Technologies</div>
                  </Group>

                  <Button
                    type="button"
                    variant="light"
                    radius="md"
                    size="sm"
                    leftSection={<Plus size={16} />}
                    onClick={addTechnology}
                    disabled={form.values.technologies.length >= MAX_TECHNOLOGIES}
                  >
                    Add Technology
                  </Button>
                </Group>

                <Text size="sm" c="dimmed">
                  Add between 1 and 5 technologies. Keep names concise and consistent.
                </Text>

                <Divider />

                <Stack gap="sm">
                  {form.values.technologies.map((_, index) => (
                    <Group key={index} align="end" gap="sm">
                      <TextInput
                        label={`Technology ${index + 1}`}
                        placeholder="e.g. React, Node.js, Tailwind"
                        radius="md"
                        size="sm"
                        className="flex-1"
                        {...form.getInputProps(`technologies.${index}`)}
                      />

                      <ActionIcon
                        color="red"
                        variant="light"
                        radius="md"
                        size="lg"
                        onClick={() => removeTechnology(index)}
                        disabled={form.values.technologies.length === 1}
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>

                <Text size="xs" c="dimmed">
                  {completedTechnologies}/{form.values.technologies.length} technology field
                  {form.values.technologies.length !== 1 ? "s" : ""} filled
                </Text>
              </Stack>
            </Card> */}

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="yellow" radius="xl">
                    <Sparkles size={16} />
                  </ThemeIcon>
                  <div className="title3">Case Study</div>
                </Group>

                <Textarea
                  label="Case Study"
                  placeholder="Explain the problem, goals, architecture, decisions made, and the outcome of the project..."
                  minRows={10}
                  autosize
                  radius="md"
                  size="sm"
                  {...form.getInputProps("caseStudy")}
                />
                <Text size="sm" c="dimmed">
                  A strong case study should explain what the project solves, how you approached it,
                  what technologies you chose, and the end result.
                </Text>
              </Stack>
            </Card>

            <Paper radius="2xl" withBorder p="lg" className="shadow-sm">
              <Group justify="space-between" className="gap-4">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="green" radius="xl">
                    <ShieldCheck size={16} />
                  </ThemeIcon>
                  <Text fw={600}>Ready to create this project?</Text>
                </Group>

                <Group>
                  <Button
                    type="button"
                    variant="default"
                    radius="md"
                    size="sm"
                    onClick={() => router.history.back()}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    radius="md"
                    size="sm"
                    loading={loading}
                    leftSection={<Save size={16} />}
                  >
                    Create Project
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