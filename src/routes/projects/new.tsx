import { createFileRoute, useRouter, redirect, useRouteContext } from "@tanstack/react-router"
import {
  Button,
  Card,
  Checkbox,
  Container,
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
  Slider,
  Badge
} from "@mantine/core"
import { schemaResolver, useForm } from "@mantine/form"
import {
  ArrowLeft,
  FolderPlus,
  Globe,
  ImagePlus,
  Save,
  ShieldCheck,
  FileText,
} from "lucide-react"
import { useMemo, useState } from "react"
import { CreateProjectSchema, type ProjectRequest } from "@/db/validations/project.types"
import { Alert } from "@mantine/core"
import { AlertCircle } from "lucide-react"
import { useProjectCreateMutation } from "@/db/queries/project.mutations"
import { uploadProjectImage } from "@/server/middleware"


export const Route = createFileRoute("/projects/new")({
  beforeLoad(ctx) {
    const currentUser = ctx.context.user
    if (!currentUser) {
      throw redirect({
        to: "/unauthorized",
      })
    }
  },

  component: RouteComponent,
})


function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const createProject = useProjectCreateMutation()
  const [error, setError] = useState<string | null>(null) // 👈 add this
  const [techInput, setTechInput] = useState('')
  const form = useForm<ProjectRequest>({
    initialValues: {
      title: "",
      progress: 0,
      technologies: [],
      githubUrl: "",
      liveUrl: "",
      description: "",
      imageUrl: "",
      isFeatured: false,
    },
    validate: schemaResolver(CreateProjectSchema,{sync:true}),
    validateInputOnBlur: true,
  })

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const addTechnology = (value: string) => {
    const clean = value.trim()

    if (!clean) return

    if (form.values.technologies.includes(clean)) return

    form.setFieldValue('technologies', [
      ...form.values.technologies,
      clean,
    ])
  }

  const removeTechnology = (tech: string) => {
    form.setFieldValue(
      'technologies',
      form.values.technologies.filter((t) => t !== tech)
    )
  }
  const handleSubmit = async (values: ProjectRequest) => {
    try {
      setLoading(true)
      setError(null) // 👈 clear previous error on each submit

      let uploadedImageUrl = values.imageUrl

      if (file) {
        const base64 = await new Promise<string>((res, rej) => {
          const reader = new FileReader()
          reader.onload = () => res(reader.result as string)
          reader.onerror = rej
          reader.readAsDataURL(file)
        })

        uploadedImageUrl = await uploadProjectImage({
          data: { base64, title: values.title, mimeType: file.type }
        })
      }

      await createProject.mutateAsync({
        ...values,
        imageUrl: uploadedImageUrl,
      })

      router.navigate({ to: "/projects" })

    } catch (err) {
      // 👇 extract a readable message and set it
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const titleLength = form.values.title.trim().length
  const descriptionLength = form.values.description.trim().length

  return (
    <div className="space-y-8 py-10">
      <Stack gap="xl">

        {/* Header */}
        <Paper
          radius="xl"
          p="xl"
          withBorder
          className="bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
        >
          <Group justify="space-between" align="flex-start">
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
                  <FolderPlus size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">Admin Panel</Text>
              </Group>
              <div className="title3">Create New Project</div>
              <Text size="sm" c="dimmed" className="max-w-2xl">
                Add a new project with its core details, public link, and cover image.
                The case study can be filled in separately after creation.
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
        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Failed to create project"
            color="red"
            radius="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">

            {/* Basic Information */}
            <Card radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="blue" radius="xl">
                    <FileText size={16} />
                  </ThemeIcon>
                  <div className="title3">Basic Information</div>
                </Group>


                <div>
                  <TextInput
                    label="Project Title"
                    placeholder="e.g. Fitness Booking Platform"
                    radius="md"
                    size="sm"
                    {...form.getInputProps("title")}
                  />
                  <Text size="xs" c="dimmed" mt={4}>
                    {titleLength} / 50
                  </Text>
                </div>

                <TextInput
                  label="Live Project URL"
                  placeholder="https://myproject.com"
                  radius="md"
                  size="sm"
                  leftSection={<Globe size={15} />}
                  {...form.getInputProps("liveUrl")}
                />

                <TextInput
                  label="GitHub URL"
                  placeholder="https://github.com/..."
                  radius="md"
                  size="sm"
                  leftSection={<Globe size={15} />}
                  {...form.getInputProps("githubUrl")}
                />

                {/* DESCRIPTION */}
                <div>
                  <Textarea
                    label="Description"
                    placeholder="What does this project do?"
                    minRows={4}
                    autosize
                    radius="md"
                    size="sm"
                    maxLength={800}
                    {...form.getInputProps("description")}
                  />

                  {/* CHARACTER COUNT */}
                  <Group justify="space-between" mt={4}>
                    <Text size="xs" c="dimmed">
                      Recommended: 100–800 characters
                    </Text>

                    <Text
                      size="xs"
                      fw={500}
                      c={
                        descriptionLength > 800
                          ? "red"
                          : descriptionLength > 700
                            ? "yellow"
                            : "dimmed"
                      }
                    >
                      {descriptionLength} / 800
                    </Text>
                  </Group>

                  {/* TECHNOLOGIES */}
                  <div className="mt-6 space-y-2">
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        Technologies
                      </Text>

                      <Text size="xs" c="dimmed">
                        {form.values.technologies.length} added
                      </Text>
                    </Group>

                    {/* INPUT */}
                    <TextInput
                      size="sm"
                      radius="md"
                      placeholder="e.g. React, Node.js, PostgreSQL"
                      value={techInput}
                      onChange={(e) =>
                        setTechInput(e.currentTarget.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()

                          addTechnology(techInput)

                          setTechInput("")
                        }
                      }}
                    />

                    <Text size="xs" c="dimmed">
                      Press Enter to add a technology
                    </Text>

                    {/* PILLS */}
                    {form.values.technologies.length > 0 && (
                      <Group gap="xs" mt={6}>
                        {form.values.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            radius="xl"
                            variant="light"
                            color="blue"
                            className="cursor-pointer"
                            onClick={() =>
                              removeTechnology(tech)
                            }
                          >
                            {tech} ✕
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </div>
                </div>

                {/* PROGRESS FIELD (NEW) */}
                <div className="space-y-2">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      Project Progress
                    </Text>
                    <Text size="sm" c="dimmed">
                      {form.values.progress}%
                    </Text>
                  </Group>

                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    {...form.getInputProps("progress")}
                  />
                </div>

                {/* CHECKBOXES */}
                <Group justify="space-between" wrap="nowrap">
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Checkbox
                      label="Featured project"
                      {...form.getInputProps("isFeatured", { type: "checkbox" })}
                    />
                    <Text size="xs" c="dimmed" ml={28}>
                      Highlight this project on homepage.
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            </Card>

            {/* Project Image */}
            <Card radius="xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="orange" radius="xl">
                    <ImagePlus size={16} />
                  </ThemeIcon>
                  <div className="title3">Project Image</div>
                </Group>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  {previewUrl || form.values.imageUrl ? (
                    <Image
                      src={previewUrl || form.values.imageUrl}
                      alt={form.values.title || "Project preview"}
                      radius="lg"
                      fit="cover"
                      h={260}
                    />
                  ) : (
                    <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                      <ImagePlus size={28} className="text-slate-300 dark:text-slate-600" />
                      <Text size="sm" c="dimmed">No image selected</Text>
                    </div>
                  )}
                </div>

                {form.errors.imageUrl && (
                  <Text size="sm" c="red">{form.errors.imageUrl}</Text>
                )}
              </Stack>
              <SimpleGrid cols={{ base: 1 }} spacing="md" mt='md'>
                <FileInput
                  label="Upload image"
                  placeholder="Choose a project image"
                  radius="md"
                  size="sm"
                  leftSection={<ImagePlus size={15} />}
                  accept="image/*"
                  value={file}
                  onChange={(f) => {
                    setFile(f)
                    // clear the URL field when a file is chosen
                    if (f) form.setFieldValue("imageUrl", "")
                  }}
                />

              </SimpleGrid>
            </Card>

            {/* Submit */}
            <Paper radius="xl" withBorder p="lg" className="shadow-sm">
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="green" radius="xl">
                    <ShieldCheck size={16} />
                  </ThemeIcon>
                  <Text fw={600} size="sm">Ready to create this project?</Text>
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
    </div>
  )
}