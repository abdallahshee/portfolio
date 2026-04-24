import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"
import {
  Badge,
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
  SimpleGrid,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import {
  ArrowLeft,
  FolderPen,
  Globe,
  ImageIcon,
  Save,
  ShieldCheck,
  Sparkles,
  Eye,
  Clock3,
  LayoutPanelTop,
  CheckCircle2,
  CircleDot,
} from "lucide-react"
import { getProjectBySlugQueryOptions } from "@/db/queries/project.queries"
import { useState } from "react"
import type { UpdateProjectRequest } from "@/db/validations/project.types"
import { UpdateProjectSchema } from "@/db/validations/project.types"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { useUpdateProjectMutation } from "@/db/queries/project.mutations"

export const Route = createFileRoute("/projects/$slug/edit")({
  beforeLoad: async (ctx) => {
    const isAdmin = ctx.context.isAdmin
    if (!isAdmin) {
      throw redirect({
        to: "/unauthorized",
      })
    }

  },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(
      getProjectBySlugQueryOptions(params.slug)
    )
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const project = Route.useLoaderData()
  const { slug } = Route.useParams()
  const router = useRouter()
  const updateMutation = useUpdateProjectMutation()
  const [loading, setLoading] = useState(false)

  const form = useForm<UpdateProjectRequest>({
    initialValues: {
      slug: slug,
      status: project?.status ?? "completed",
      title: project?.title ?? "",
      description: project?.description ?? "",
      imageUrl: project?.imageUrl ?? "",
      isPublic: project?.isPublic ?? false,
      url: project?.url ?? "",
    },
    validate: zod4Resolver(UpdateProjectSchema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: UpdateProjectRequest) => {
    try {
      setLoading(true)
      await updateMutation.mutateAsync(values)
      router.history.back()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const previewImage = form.values.imageUrl?.trim()
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
                  <FolderPen size={18} />
                </ThemeIcon>
                <Text fw={600} c="dimmed" size="sm">Admin Panel</Text>
              </Group>
              <div className="title3">Edit Project</div>
              <Text size="sm" c="dimmed" className="max-w-2xl">
                Update the project details, refine the description, adjust visibility,
                and refresh the image before saving changes.
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

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" className="items-start">

          {/* Main form — 2 cols */}
          <div className="lg:col-span-2">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="lg">

                {/* Basic Information */}
                <Card radius="xl" withBorder p="xl" className="shadow-sm">
                  <Stack gap="lg">
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="blue" radius="xl">
                        <LayoutPanelTop size={16} />
                      </ThemeIcon>
                      <div className="title3">Basic Information</div>
                    </Group>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <div>
                        <Text size="sm" fw={500} mb={6}>
                          Project Status
                        </Text>

                        <Group id="status" gap="xs">
                          {/* Progress */}
                          <Badge
                            variant={form.values.status === "progress" ? "filled" : "light"}
                            color="orange"
                            leftSection={<CircleDot size={14} />}
                            style={{ cursor: "pointer" }}
                            onClick={() => form.setFieldValue("status", "progress")}
                          >
                            In Progress
                          </Badge>

                          {/* Completed */}
                          <Badge
                            variant={form.values.status === "completed" ? "filled" : "light"}
                            color="green"
                            leftSection={<CheckCircle2 size={14} />}
                            style={{ cursor: "pointer" }}
                            onClick={() => form.setFieldValue("status", "completed")}
                          >
                            Completed
                          </Badge>
                        </Group>

                        {form.errors.status && (
                          <Text size="xs" c="red" mt={4}>
                            {form.errors.status}
                          </Text>
                        )}
                      </div>
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <div>
                        <TextInput
                          label="Project Title"
                          placeholder="My Awesome Project"
                          radius="md"
                          size="sm"
                          {...form.getInputProps("title")}
                        />
                        <Group justify="space-between" mt={4}>
                          <Text size="xs" c="dimmed">5–40 characters</Text>
                          <Text size="xs" c={titleLength > 40 || (titleLength > 0 && titleLength < 5) ? "red" : "dimmed"}>
                            {titleLength} / 40
                          </Text>
                        </Group>
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
                        <Text
                          size="xs"
                          c={descriptionLength > 160 || (descriptionLength > 0 && descriptionLength < 100) ? "red" : "dimmed"}
                        >
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
                        Public projects appear on your portfolio. Private ones remain for internal use only.
                      </Text>
                    </Stack>
                  </Stack>
                </Card>

                {/* Project Image */}
                <Card radius="xl" withBorder p="xl" className="shadow-sm">
                  <Stack gap="lg">
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="orange" radius="xl">
                        <ImageIcon size={16} />
                      </ThemeIcon>
                      <div className="title3">Project Image</div>
                    </Group>

                    <TextInput
                      label="Image URL"
                      placeholder="https://example.com/screenshot.png"
                      radius="md"
                      size="sm"
                      {...form.getInputProps("imageUrl")}
                    />

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                      {previewImage ? (
                        <Image
                          src={previewImage}
                          alt={form.values.title || "Project preview"}
                          radius="lg"
                          fit="cover"
                          h={260}
                        />
                      ) : (
                        <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                          <ImageIcon size={28} className="text-slate-300 dark:text-slate-600" />
                          <Text size="sm" c="dimmed">No image preview available</Text>
                        </div>
                      )}
                    </div>

                    {form.errors.imageUrl && (
                      <Text size="sm" c="red">{form.errors.imageUrl}</Text>
                    )}
                  </Stack>
                </Card>

                {/* Submit */}
                <Paper radius="xl" withBorder p="lg" className="shadow-sm">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <ThemeIcon variant="light" color="green" radius="xl">
                        <ShieldCheck size={16} />
                      </ThemeIcon>
                      <Text fw={600} size="sm">Ready to save your changes?</Text>
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
                        Save Changes
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              </Stack>
            </form>
          </div>

          {/* Sidebar */}
          <Stack gap="lg">

            {/* Change summary */}
            <Card radius="xl" withBorder p="xl" className="shadow-sm">
              <Group gap="xs" mb="md">
                <ThemeIcon variant="light" color="gray" radius="xl">
                  <Clock3 size={16} />
                </ThemeIcon>
                <div className="title3">Change Summary</div>
              </Group>
              <Stack gap="xs">
                <Text size="xs" c="dimmed">Current title</Text>
                <Text fw={500} size="sm">
                  {form.values.title || "Untitled project"}
                </Text>
                <Divider my="xs" />
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Image</Text>
                  <Text size="sm" c={previewImage ? "green" : "red"}>
                    {previewImage ? "Available" : "Missing"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Visibility</Text>
                  <Badge
                    variant="light"
                    color={form.values.isPublic ? "green" : "gray"}
                    radius="xl"
                    size="sm"
                  >
                    {form.values.isPublic ? "Public" : "Private"}
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Title length</Text>
                  <Text size="sm" c={titleLength > 40 ? "red" : "dimmed"}>
                    {titleLength} / 40
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Description length</Text>
                  <Text size="sm" c={descriptionLength > 160 || (descriptionLength > 0 && descriptionLength < 100) ? "red" : "dimmed"}>
                    {descriptionLength} / 160
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Quick preview */}
            <Card radius="xl" withBorder p="xl" className="shadow-sm">
              <Group gap="xs" mb="md">
                <ThemeIcon variant="light" color="indigo" radius="xl">
                  <Eye size={16} />
                </ThemeIcon>
                <div className="title3">Quick Preview</div>
              </Group>
              <Stack gap="sm">
                <Text fw={600} size="sm">
                  {form.values.title || "Your project title will appear here"}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={4}>
                  {form.values.description ||
                    "Update the description to see a preview of the project summary."}
                </Text>
                <Badge
                  variant="light"
                  color={form.values.isPublic ? "green" : "gray"}
                  radius="xl"
                  w="fit-content"
                  size="sm"
                >
                  {form.values.isPublic ? "Public" : "Private"}
                </Badge>
              </Stack>
            </Card>

            {/* Editing tips */}
            <Card radius="xl" withBorder p="xl" className="shadow-sm">
              <Group gap="xs" mb="md">
                <ThemeIcon variant="light" color="yellow" radius="xl">
                  <Sparkles size={16} />
                </ThemeIcon>
                <div className="title3">Editing Tips</div>
              </Group>
              <Stack gap="sm">
                <Text size="sm" c="dimmed">
                  Refresh the title if the project direction or positioning has changed.
                </Text>
                <Text size="sm" c="dimmed">
                  Tighten the description so it clearly communicates the main value in 100–160 characters.
                </Text>
                <Text size="sm" c="dimmed">
                  Make sure the image URL still points to a valid and accessible asset.
                </Text>
                <Text size="sm" c="dimmed">
                  Toggle visibility to control whether the project appears on your portfolio.
                </Text>
              </Stack>
            </Card>

          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}