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
} from "@mantine/core"
import { useForm } from "@mantine/form"
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
import { ProjectSchema, type ProjectRequest } from "@/db/validations/project.types"

import { zod4Resolver } from "mantine-form-zod-resolver"
import { useProjectCreateMutation } from "@/db/queries/project.mutations"
import { uploadProjectImage } from "@/lib/supabase/client"
import { getUserRole } from "@/server/user.functions"




export const Route = createFileRoute("/projects/new")({
  beforeLoad: async ({ context }) => {
    const isAdmin = context.isAdmin
    if (!isAdmin) {
      throw redirect({
        to: "/unauthorized",
      })
    }
  },
  loader: async ({ context }) => {
    console.log(context.isAdmin) // ← available here
  },
  component: RouteComponent,
})


function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const createProject = useProjectCreateMutation()

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

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const handleSubmit = async (values: ProjectRequest) => {
    try {
      setLoading(true)

      let uploadedImageUrl = values.imageUrl
      if (file) {
        uploadedImageUrl = await uploadProjectImage(file, values.title)
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

  return (
    <Container size="xl" className="space-y-8 py-10">
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

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <div>
                    <TextInput
                      label="Project Title"
                      placeholder="e.g. Fitness Booking Platform"
                      radius="md"
                      size="sm"
                      {...form.getInputProps("title")}
                    />
                    <Text size="xs" c={titleLength > 40 ? "red" : "dimmed"} mt={4} ta="right">
                      {titleLength} / 40
                    </Text>
                  </div>

                  <TextInput
                    label="Live Project URL"
                    placeholder="https://myproject.com"
                    radius="md"
                    size="sm"
                    leftSection={<Globe size={15} />}
                    {...form.getInputProps("url")}
                  />
                </SimpleGrid>

                <div>
                  <Textarea
                    label="Description"
                    placeholder="Write a concise summary of the project — what it does and who it is for."
                    minRows={4}
                    autosize
                    radius="md"
                    size="sm"
                    {...form.getInputProps("description")}
                  />
                  <Group justify="space-between" mt={4}>
                    <Text size="xs" c="dimmed">100–160 characters</Text>
                    <Text size="xs" c={descriptionLength > 160 || (descriptionLength > 0 && descriptionLength < 100) ? "red" : "dimmed"}>
                      {descriptionLength} / 160
                    </Text>
                  </Group>
                </div>

                <Stack gap={4}>
                  <Checkbox
                    label="Make project public"
                    {...form.getInputProps("isPublic", { type: "checkbox" })}
                  />
                  <Text size="xs" c="dimmed" ml={28}>
                    Public projects appear on your portfolio. Private projects are stored for admin use only.
                  </Text>
                </Stack>
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
    </Container>
  )
}