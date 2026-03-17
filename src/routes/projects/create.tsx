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
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import {
  ArrowLeft,
  FolderPlus,
  Globe,
  Github,
  ImagePlus,
  Plus,
  Save,
  ShieldCheck,
  Trash,
  Wrench,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { uploadImage } from "@/lib/utils"
import { createProject } from "@/server/project.functions"
import { AdminMiddleware } from "@/server/middleware"
import { useMemo, useState } from "react"

interface ProjectCreateForm {
  title: string

  description: string
  imageUrl: File | null
  isPublic: boolean
  url: string
  rate: number
  technologies: string[]
}

export const Route = createFileRoute("/projects/create")({
  server: {
    middleware: [AdminMiddleware],
  },
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm<ProjectCreateForm>({
    initialValues: {
      title: "",
      url: "",
      description: "",
      rate: 1,
      imageUrl: null,
      isPublic: true,
      technologies: ["React"],
    },
  })

  const createProjectFn = useServerFn(createProject)
  const queryClient = useQueryClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const previewUrl = useMemo(() => {
    if (!form.values.imageUrl) return null
    return URL.createObjectURL(form.values.imageUrl)
  }, [form.values.imageUrl])

  const handleSubmit = async (values: ProjectCreateForm) => {
    try {
      setLoading(true)

      let url = ""
      if (values.imageUrl) {
        url = await uploadImage(values.imageUrl)
      }

      const { imageUrl, ...datas } = values

      await createProjectFn({
        data: {
          imageUrl: "DEFAULT",
          ...datas,
        },
      })

      await queryClient.invalidateQueries({ queryKey: ["projects"] })
      router.navigate({ to: "/projects" })
    } catch (err) {
      console.error(err)
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

              <Title order={1} className="text-3xl md:text-4xl">
                Create New Project
              </Title>

              <Text className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Add a new project with its details, links, image, visibility, and
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
                    <FolderPlus size={16} />
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
                    <ImagePlus size={16} />
                  </ThemeIcon>
                  <Title order={3}>Project Image</Title>
                </Group>

                <FileInput
                  label="Upload Image"
                  placeholder="Choose project image"
                  radius="md"
                  size="md"
                  leftSection={<ImagePlus size={16} />}
                  accept="image/*"
                  {...form.getInputProps("imageUrl")}
                />

                {previewUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                    <Image
                      src={previewUrl}
                      alt={form.values.title || "Project preview"}
                      radius="xl"
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
                    disabled={form.values.technologies.length >= 5}
                  >
                    Add Technology
                  </Button>
                </Group>

                <Text size="sm" c="dimmed">
                  Add up to 5 technologies used in this project.
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
                  <Text fw={600}>Ready to publish this project?</Text>
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