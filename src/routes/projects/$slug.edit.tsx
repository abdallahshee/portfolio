import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Slider,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  FileInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import {
  AlertCircle,
  ArrowLeft,
  FolderPen,
  Globe,
  ImageIcon,
  LayoutPanelTop,
  Save,
} from "lucide-react"
import { useMemo, useState } from "react"
import { getProjectBySlugQueryOptions } from "@/db/queries/project.queries"
import type { UpdateProjectRequest } from "@/db/validations/project.types"
import { UpdateProjectSchema } from "@/db/validations/project.types"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { useUpdateProjectMutation } from "@/db/queries/project.mutations"
import { uploadProjectImage } from "@/server/middleware"


export const Route = createFileRoute("/projects/$slug/edit")({
  beforeLoad: async (ctx) => {
    if (!ctx.context.user) {
      throw redirect({ to: "/unauthorized" })
    }
  },
  loader: async ({ context, params }) => {
    return await context.queryClient.fetchQuery(
      getProjectBySlugQueryOptions(params.slug)
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const project = Route.useLoaderData()
  const { slug } = Route.useParams()
  const router = useRouter()

  const updateMutation = useUpdateProjectMutation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [techInput, setTechInput] = useState("")

  const form = useForm<UpdateProjectRequest>({
    initialValues: {
      slug,
      title: project?.title ?? "",
      description: project?.description ?? "",
      imageUrl: project?.imageUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
      isFeatured: project?.isFeatured ?? false,
      progress: project?.progress ?? 0,
      technologies: project?.technologies ?? [],
    },
    validate: zod4Resolver(UpdateProjectSchema),
  })

  const previewImage = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    if (form.values.imageUrl) return form.values.imageUrl
    return null
  }, [file, form.values.imageUrl])

  const addTechnology = (value: string) => {
    const tech = value.trim()
    if (!tech) return
    if (form.values.technologies.includes(tech)) return
    form.setFieldValue("technologies", [...form.values.technologies, tech])
  }

  const removeTechnology = (tech: string) => {
    form.setFieldValue(
      "technologies",
      form.values.technologies.filter((t) => t !== tech)
    )
  }

  const handleSubmit = async (values: UpdateProjectRequest) => {
    try {
      setLoading(true)
      setError(null)

      let uploadedImageUrl = values.imageUrl

      // 👇 same base64 upload logic as create
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

      await updateMutation.mutateAsync({
        ...values,
        imageUrl: uploadedImageUrl, // 👈 use the uploaded URL, not previewImage
      })

      router.navigate({to:'/projects'})
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 py-10">
      <Stack gap="xl">

        {/* HEADER */}
        <Paper radius="xl" p="xl" withBorder>
          <Group justify="space-between">
            <Stack gap={6}>
              <Group gap="xs">
                <ThemeIcon variant="light" color="indigo" radius="xl">
                  <FolderPen size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">Admin Panel</Text>
              </Group>
              <div className="title3">Edit Project</div>
              <Text size="sm" c="dimmed">Update project details and image</Text>
            </Stack>
            <Button
              variant="light"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => router.history.back()}
            >
              Back
            </Button>
          </Group>
        </Paper>

        {/* ERROR ALERT */}
        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Failed to update project"
            color="red"
            radius="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">

          {/* FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="lg">

                {/* BASIC INFO */}
                <Card radius="xl" withBorder p="xl">
                  <Stack gap="lg">
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="blue">
                        <LayoutPanelTop size={16} />
                      </ThemeIcon>
                      <Text fw={600}>Basic Information</Text>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <TextInput
                        label="Project Title"
                        radius="md"
                        size="sm"
                        {...form.getInputProps("title")}
                      />
                      <TextInput
                        label="Live URL"
                        radius="md"
                        size="sm"
                        leftSection={<Globe size={15} />}
                        {...form.getInputProps("liveUrl")}
                      />
                      <TextInput
                        label="GitHub URL"
                        radius="md"
                        size="sm"
                        leftSection={<Globe size={15} />}
                        {...form.getInputProps("githubUrl")}
                      />
                    </SimpleGrid>

                    <Textarea
                      label="Description"
                      minRows={4}
                      autosize
                      radius="md"
                      size="sm"
                      {...form.getInputProps("description")}
                    />

                    {/* PROGRESS */}
                    <div className="space-y-2">
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>Project Progress</Text>
                        <Text size="sm" c="dimmed">{form.values.progress}%</Text>
                      </Group>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        {...form.getInputProps("progress")}
                      />
                    </div>

                    <Checkbox
                      label="Featured project"
                      {...form.getInputProps("isFeatured", { type: "checkbox" })}
                    />

                    {/* TECHNOLOGIES */}
                    <div className="space-y-3">
                      <Group justify="space-between">
                        <Text fw={500} size="sm">Technologies</Text>
                        <Text size="xs" c="dimmed">
                          {form.values.technologies.length} added
                        </Text>
                      </Group>
                      <TextInput
                        size="sm"
                        radius="md"
                        placeholder="Add technology and press Enter"
                        value={techInput}
                        onChange={(e) => setTechInput(e.currentTarget.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTechnology(techInput)
                            setTechInput("")
                          }
                        }}
                      />
                      <Text size="xs" c="dimmed">Press Enter to add a technology</Text>
                      {form.values.technologies.length > 0 && (
                        <Group gap="xs">
                          {form.values.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              radius="xl"
                              variant="light"
                              color="blue"
                              className="cursor-pointer"
                              onClick={() => removeTechnology(tech)}
                            >
                              {tech} ✕
                            </Badge>
                          ))}
                        </Group>
                      )}
                    </div>
                  </Stack>
                </Card>

                {/* IMAGE */}
                <Card radius="xl" withBorder p="xl">
                  <Stack gap="md">
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="orange">
                        <ImageIcon size={16} />
                      </ThemeIcon>
                      <Text fw={600}>Project Image</Text>
                    </Group>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt={form.values.title || "Project image"}
                          radius="lg"
                          h={260}
                          fit="cover"
                        />
                      ) : (
                        <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                          <ImageIcon size={28} className="text-slate-300 dark:text-slate-600" />
                          <Text size="sm" c="dimmed">No image selected</Text>
                        </div>
                      )}
                    </div>

                    <FileInput
                      label="Upload new image"
                      placeholder="Choose image"
                      radius="md"
                      size="sm"
                      accept="image/*"
                      leftSection={<ImageIcon size={15} />}
                      value={file}
                      onChange={(f) => {
                        setFile(f)
                        if (f) form.setFieldValue("imageUrl", "")
                      }}
                    />
                  </Stack>
                </Card>

                {/* SUBMIT */}
                <Paper radius="xl" withBorder p="lg">
                  <Group justify="space-between">
                    <Text fw={600} size="sm">Save changes?</Text>
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
                        Save changes
                      </Button>
                    </Group>
                  </Group>
                </Paper>

              </Stack>
            </form>
          </div>

          {/* SIDEBAR PREVIEW */}
          <Stack gap="lg">
            <Card radius="xl" withBorder p="xl">
              <Stack gap="md">
                <Text fw={600}>Live Preview</Text>

                {previewImage && (
                  <Image
                    src={previewImage}
                    radius="lg"
                    h={160}
                    fit="cover"
                  />
                )}

                <Text fw={500}>
                  {form.values.title || "Untitled project"}
                </Text>

                <Text size="xs" c="dimmed" lineClamp={4}>
                  {form.values.description || "No description yet."}
                </Text>

                {/* Progress */}
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" c="dimmed">Progress</Text>
                    <Text size="xs" fw={500}>{form.values.progress}%</Text>
                  </Group>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${form.values.progress}%` }}
                    />
                  </div>
                </div>

                {form.values.technologies.length > 0 && (
                  <Group gap="xs">
                    {form.values.technologies.map((t) => (
                      <Badge key={t} size="xs" variant="light" color="blue">
                        {t}
                      </Badge>
                    ))}
                  </Group>
                )}

                {form.values.isFeatured && (
                  <Badge variant="light" color="yellow" size="sm">
                    Featured
                  </Badge>
                )}
              </Stack>
            </Card>
          </Stack>

        </SimpleGrid>
      </Stack>
    </div>
  )
}