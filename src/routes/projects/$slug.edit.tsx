import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  FileInput,
} from "@mantine/core"

import { useForm } from "@mantine/form"

import {
  ArrowLeft,
  FolderPen,
  Globe,
  LayoutPanelTop,
  Save,
  ImageIcon,
} from "lucide-react"

import { useMemo, useState } from "react"

import {
  getProjectBySlugQueryOptions,
} from "@/db/queries/project.queries"

import type { UpdateProjectRequest } from "@/db/validations/project.types"
import { UpdateProjectSchema } from "@/db/validations/project.types"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { useUpdateProjectMutation } from "@/db/queries/project.mutations"

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

  // ─────────────────────────────
  // IMAGE FILE STATE
  // ─────────────────────────────
  const [file, setFile] = useState<File | null>(null)

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

  // ─────────────────────────────
  // IMAGE PREVIEW (FILE OR URL)
  // ─────────────────────────────
  const previewImage = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    if (form.values.imageUrl) return form.values.imageUrl
    return null
  }, [file, form.values.imageUrl])

  // ─────────────────────────────
  // TECHNOLOGIES
  // ─────────────────────────────
  const [techInput, setTechInput] = useState("")

  const addTechnology = (value: string) => {
    const tech = value.trim()
    if (!tech) return
    if (form.values.technologies.includes(tech)) return

    form.setFieldValue("technologies", [
      ...form.values.technologies,
      tech,
    ])
  }

  const removeTechnology = (tech: string) => {
    form.setFieldValue(
      "technologies",
      form.values.technologies.filter((t) => t !== tech)
    )
  }

  // ─────────────────────────────
  // SUBMIT
  // ─────────────────────────────
  const handleSubmit = async (values: UpdateProjectRequest) => {
    try {
      setLoading(true)

      /**
       * 🔥 If you have upload logic, plug it here:
       * const uploadedUrl = await uploadImage(file)
       */

      await updateMutation.mutateAsync({
        ...values,
        imageUrl: file ? previewImage ?? "" : values.imageUrl,
      })

      router.history.back()
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
                <Text fw={600} c="dimmed" size="sm">
                  Admin Panel
                </Text>
              </Group>

              <div className="text-3xl font-bold">Edit Project</div>

              <Text size="sm" c="dimmed">
                Update project details and image
              </Text>
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
                        {...form.getInputProps("title")}
                      />

                      <TextInput
                        label="Live URL"
                        leftSection={<Globe size={15} />}
                        {...form.getInputProps("liveUrl")}
                      />

                      <TextInput
                        label="GitHub URL"
                        leftSection={<Globe size={15} />}
                        {...form.getInputProps("githubUrl")}
                      />
                    </SimpleGrid>

                    <Textarea
                      label="Description"
                      minRows={4}
                      autosize
                      {...form.getInputProps("description")}
                    />

                    <Checkbox
                      label="Featured project"
                      {...form.getInputProps("isFeatured", {
                        type: "checkbox",
                      })}
                    />

                    {/* TECHNOLOGIES */}
                    <div className="space-y-3">
                      <Group justify="space-between">
                        <Text fw={600}>Technologies</Text>
                        <Text size="xs" c="dimmed">
                          {form.values.technologies.length} items
                        </Text>
                      </Group>

                      <TextInput
                        placeholder="Add technology and press Enter"
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
                    </div>
                  </Stack>
                </Card>

                {/* IMAGE UPLOAD + PREVIEW */}
                <Card radius="xl" withBorder p="xl">
                  <Stack gap="md">

                    <Group gap="xs">
                      <ThemeIcon variant="light" color="orange">
                        <ImageIcon size={16} />
                      </ThemeIcon>
                      <Text fw={600}>Project Image</Text>
                    </Group>

                    <FileInput
                      label="Upload image"
                      placeholder="Choose image"
                      accept="image/*"
                      value={file}
                      onChange={(f) => {
                        setFile(f)
                        if (f) form.setFieldValue("imageUrl", "")
                      }}
                    />

                    {previewImage && (
                      <Image
                        src={previewImage}
                        radius="lg"
                        h={260}
                        fit="cover"
                      />
                    )}
                  </Stack>
                </Card>

                {/* SUBMIT */}
                <Paper radius="xl" withBorder p="lg">
                  <Group justify="space-between">
                    <Text fw={600}>Save changes?</Text>

                    <Group>
                      <Button
                        variant="default"
                        onClick={() => router.history.back()}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        loading={loading}
                        leftSection={<Save size={16} />}
                      >
                        Save
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
              <Text fw={600}>Preview</Text>

              <Text fw={500} mt="sm">
                {form.values.title || "Untitled project"}
              </Text>

              <Text size="xs" c="dimmed" mt="sm" lineClamp={4}>
                {form.values.description}
              </Text>

              <Group gap="xs" mt="md">
                {form.values.technologies.map((t) => (
                  <Badge key={t} size="xs" variant="light">
                    {t}
                  </Badge>
                ))}
              </Group>
            </Card>
          </Stack>

        </SimpleGrid>
      </Stack>
    </div>
  )
}