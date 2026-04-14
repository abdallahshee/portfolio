import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { useForm } from "@mantine/form"
import {
  TextInput,
  Button,
  Paper,
  Stack,
  FileInput,
  Group,
  Image,
  Container,
  Text,
  Card,
  Divider,
  ThemeIcon,
  SimpleGrid,
  Select,
  List,
  RingProgress,
  Center,
  Loader,
  Textarea,
  Badge,
} from "@mantine/core"
import { RichTextEditor, Link } from "@mantine/tiptap"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import SubScript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import {
  Save,
  ImagePlus,
  FileText,
  PenSquare,
  Sparkles,
  ArrowLeft,
  PencilLine,
  CheckCircle2,
  Circle,
  Tags,
  Plus,
  X,
} from "lucide-react"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { ArticleSchema, type ArticleRequest } from "@/db/validations/article.types"
import { useQuery } from "@tanstack/react-query"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { getArticleBySlug } from "@/server/article.functions"
import { useServerFn } from "@tanstack/react-start"
import { AuthenticatedMiddleware } from "@/server/middleware"
import { useArticleUpdateMutationOption } from "@/db/mutations/article.mutations"
import { notifications } from "@mantine/notifications"

export const Route = createFileRoute("/articles/$slug/edit")({
  server: { middleware: [AuthenticatedMiddleware] },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllCategoriesQueryOption())
  },
  component: RouteComponent,
})

const defaultValues: ArticleRequest = {
  title: "",
  content: "",
  coverImage: null,
  categoryId: null,
  tags: [],
  excerpt: "",
}

function RouteComponent() {
  const router = useRouter()
  const { slug } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const [fetchingArticle, setFetchingArticle] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const turndownService = useRef<any>(null)
  const getArticleFn = useServerFn(getArticleBySlug)
  const updateBlogMutation = useArticleUpdateMutationOption()
  const { data: categories } = useQuery(getAllCategoriesQueryOption())

  const form = useForm<ArticleRequest>({
    initialValues: defaultValues,
    validate: zod4Resolver(ArticleSchema),
    validateInputOnBlur: true,
  })

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      form.setFieldValue("content", editor.getHTML())
    },
  })

  const characterCount = (editor?.getText() ?? "").trim().length

  useEffect(() => {
    import("turndown").then((mod) => {
      turndownService.current = new mod.default()
    })
  }, [])

  useEffect(() => {
    if (!slug) return
    let isMounted = true

    const fetchArticle = async () => {
      try {
        setFetchingArticle(true)
        const article = await getArticleFn({ data: { slug } })
        if (!isMounted || !article) return

        const nextValues: ArticleRequest = {
          title: article.title ?? "",
          content: article.content ?? "",
          coverImage: article.coverImage ?? null,
          categoryId: article.categoryId ?? null,
          tags: article.tags ?? [],
          excerpt: article.excerpt ?? "",
        }

        form.setValues(nextValues)
        setPreviewUrl(nextValues.coverImage)

        if (editor) {
          editor.commands.setContent(nextValues.content || "")
        }
      } catch (error) {
        console.error("Failed to fetch article:", error)
      } finally {
        if (isMounted) setFetchingArticle(false)
      }
    }

    fetchArticle()

    return () => {
      isMounted = false
    }
  }, [slug, editor])

  useEffect(() => {
    if (!imageFile) return
    const objectUrl = URL.createObjectURL(imageFile)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  const handleAddTag = () => {
    const newTag = tagInput.trim()
    if (!newTag) return

    if (form.values.tags.length >= 4) {
      notifications.show({
        title: "Tag limit reached",
        message: "You can add a maximum of 4 tags.",
        color: "orange",
      })
      return
    }

    const exists = form.values.tags.some(
      (t) => t.toLowerCase() === newTag.toLowerCase()
    )
    if (exists) {
      setTagInput("")
      return
    }

    form.setFieldValue("tags", [...form.values.tags, newTag])
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    // ✅ prevent removing the last tag
    if (form.values.tags.length <= 1) {
      notifications.show({
        title: "Cannot remove",
        message: "At least one tag is required.",
        color: "red",
      })
      return
    }
    form.setFieldValue(
      "tags",
      form.values.tags.filter((t) => t !== tagToRemove)
    )
  }

  const handleSubmit = async (values: ArticleRequest) => {
    try {
      setLoading(true)

      const markdownContent =
        turndownService.current && values.content
          ? turndownService.current.turndown(values.content)
          : values.content

      const coverImage =
        values.coverImage ||
        "https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg"

      await updateBlogMutation.mutateAsync({
        slug,
        title: values.title,
        content: markdownContent,
        coverImage,
        categoryId: values.categoryId,
        tags: values.tags,
        excerpt: values.excerpt,
      })

      router.history.back()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const checklist = [
    { label: "Title added", done: form.values.title.trim().length > 0 },
    { label: "Category selected", done: !!form.values.categoryId },
    { label: "Cover image available", done: !!previewUrl },
    { label: "At least one tag", done: form.values.tags.length >= 1 },
    { label: "Content written", done: (editor?.getText() ?? "").trim().length > 20 },
  ]

  const completedCount = checklist.filter((c) => c.done).length
  const progressValue = Math.round((completedCount / checklist.length) * 100)

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="xl">
        <Stack gap="xl">
          {/* Header */}
          <Paper
            radius="xl"
            p="xl"
            withBorder
            className="overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="center">
              <Group gap="md">
                <ThemeIcon variant="light" color="indigo" radius="xl" size={48}>
                  <PencilLine size={22} />
                </ThemeIcon>
                <div>
                  <Text fw={700} size="xl" className="leading-tight">
                    Edit Blog Post
                  </Text>
                  <Text size="sm" c="dimmed">
                    Update your article and save changes
                  </Text>
                </div>
              </Group>
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
            <div className="lg:col-span-2">
              <Paper radius="xl" p="xl" withBorder className="shadow-sm">
                {fetchingArticle ? (
                  <div className="flex min-h-[400px] items-center justify-center">
                    <Group gap="sm">
                      <Loader size="sm" color="indigo" />
                      <Text size="sm" c="dimmed">Loading article...</Text>
                    </Group>
                  </div>
                ) : (
                  <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="xl">

                      {/* Post Details */}
                      <Stack gap="md">
                        <Group gap="xs">
                          <ThemeIcon variant="light" color="blue" radius="lg" size={32}>
                            <FileText size={15} />
                          </ThemeIcon>
                          <Text fw={600} size="md">Post Details</Text>
                        </Group>

                        <SimpleGrid cols={{ base: 1 }} spacing="md">
                          <TextInput
                            label="Title"
                            placeholder="Give your post a clear title"
                            leftSection={<FileText size={15} />}
                            radius="md"
                            size="sm"
                            {...form.getInputProps("title")}
                          />
                          <Textarea
                            label="Excerpt"
                            placeholder="Give your post a catching excerpt"
                            rows={4}
                            radius="md"
                            size="sm"
                            {...form.getInputProps("excerpt")}
                          />
                          <Select
                            label="Category"
                            placeholder="Select a category"
                            radius="md"
                            size="sm"
                            data={categories?.map((cat) => ({
                              label: cat.name,
                              value: cat.id,
                            }))}
                            value={form.values.categoryId}
                            onChange={(value) =>
                              form.setFieldValue("categoryId", value || null)
                            }
                            error={form.errors.categoryId}
                            clearable
                          />
                        </SimpleGrid>
                      </Stack>

                      <Divider />

                      {/* Tags */}
                      <Stack gap="md">
                        <Group gap="xs">
                          <ThemeIcon variant="light" color="violet" radius="lg" size={32}>
                            <Tags size={15} />
                          </ThemeIcon>
                          <Text fw={600} size="md">Tags</Text>
                          <Text size="xs" c="dimmed" ml="auto">
                            {form.values.tags.length} / 4
                          </Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          Add 1 to 4 tags to help readers find your article.
                          The last tag cannot be removed.
                        </Text>

                        <Group align="flex-end">
                          <TextInput
                            placeholder="Add a tag e.g. React"
                            radius="md"
                            size="sm"
                            className="flex-1"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.currentTarget.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddTag()
                              }
                            }}
                            disabled={form.values.tags.length >= 4}
                            error={form.errors.tags as string}
                          />
                          <Button
                            type="button"
                            variant="light"
                            color="violet"
                            radius="md"
                            size="sm"
                            leftSection={<Plus size={14} />}
                            onClick={handleAddTag}
                            disabled={form.values.tags.length >= 4}
                          >
                            Add
                          </Button>
                        </Group>

                        {form.values.tags.length > 0 && (
                          <Group gap="xs">
                            {form.values.tags.map((tag) => {
                              const isLast = form.values.tags.length === 1
                              return (
                                <Badge
                                  key={tag}
                                  variant="light"
                                  color="violet"
                                  radius="xl"
                                  size="md"
                                  rightSection={
                                    !isLast ? (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="flex items-center opacity-60 hover:opacity-100 transition-opacity"
                                      >
                                        <X size={11} />
                                      </button>
                                    ) : (
                                      // ✅ show a disabled X when it's the last tag
                                      <span className="flex items-center opacity-20 cursor-not-allowed">
                                        <X size={11} />
                                      </span>
                                    )
                                  }
                                >
                                  {tag}
                                </Badge>
                              )
                            })}
                          </Group>
                        )}
                      </Stack>

                      <Divider />

                      {/* Cover Image */}
                      <Stack gap="md">
                        <Group gap="xs">
                          <ThemeIcon variant="light" color="orange" radius="lg" size={32}>
                            <ImagePlus size={15} />
                          </ThemeIcon>
                          <Text fw={600} size="md">Cover Image</Text>
                        </Group>

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt="Cover preview"
                              h={220}
                              radius="lg"
                              fit="cover"
                            />
                          ) : (
                            <div className="flex h-[180px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                              <ImagePlus size={28} className="text-slate-300 dark:text-slate-600" />
                              <Text size="sm" c="dimmed">No cover image available</Text>
                            </div>
                          )}
                        </div>
                        <FileInput
                          placeholder="Replace cover image"
                          leftSection={<ImagePlus size={15} />}
                          accept="image/*"
                          radius="md"
                          size="sm"
                          value={imageFile}
                          onChange={setImageFile}
                        />
                      </Stack>

                      <Divider />

                      {/* Content */}
                      <Stack gap="md">
                        <Group gap="xs">
                          <ThemeIcon variant="light" color="grape" radius="lg" size={32}>
                            <PenSquare size={15} />
                          </ThemeIcon>
                          <Text fw={600} size="md">Content</Text>
                        </Group>

                        <RichTextEditor editor={editor} style={{ borderRadius: 12 }}>
                          <RichTextEditor.Toolbar sticky stickyOffset={60}>
                            <RichTextEditor.ControlsGroup>
                              <RichTextEditor.Bold />
                              <RichTextEditor.Italic />
                              <RichTextEditor.Underline />
                              <RichTextEditor.Strikethrough />
                              <RichTextEditor.ClearFormatting />
                              <RichTextEditor.Highlight />
                              <RichTextEditor.Code />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                              <RichTextEditor.H1 />
                              <RichTextEditor.H2 />
                              <RichTextEditor.H3 />
                              <RichTextEditor.H4 />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                              <RichTextEditor.Blockquote />
                              <RichTextEditor.Hr />
                              <RichTextEditor.BulletList />
                              <RichTextEditor.OrderedList />
                              <RichTextEditor.Subscript />
                              <RichTextEditor.Superscript />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                              <RichTextEditor.Link />
                              <RichTextEditor.Unlink />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                              <RichTextEditor.AlignLeft />
                              <RichTextEditor.AlignCenter />
                              <RichTextEditor.AlignJustify />
                              <RichTextEditor.AlignRight />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                              <RichTextEditor.Undo />
                              <RichTextEditor.Redo />
                            </RichTextEditor.ControlsGroup>
                          </RichTextEditor.Toolbar>
                          <RichTextEditor.Content className="min-h-[360px]" />
                        </RichTextEditor>

                        <Text
                          size="xs"
                          ta="right"
                          c={characterCount > 1800 ? "red" : "dimmed"}
                        >
                          {characterCount}/6000 characters
                        </Text>

                        {form.errors.content && (
                          <Text c="red" size="sm">{form.errors.content}</Text>
                        )}
                      </Stack>

                      {/* Actions */}
                      <Group justify="flex-end" mt="sm">
                        <Button
                          variant="default"
                          type="button"
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
                    </Stack>
                  </form>
                )}
              </Paper>
            </div>

            {/* Sidebar */}
            <Stack gap="lg">
              <Card radius="xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="md">
                  <ThemeIcon variant="light" color="indigo" radius="lg" size={32}>
                    <CheckCircle2 size={15} />
                  </ThemeIcon>
                  <Text fw={600} size="md">Readiness</Text>
                </Group>

                <Center mb="md">
                  <RingProgress
                    size={100}
                    thickness={8}
                    roundCaps
                    sections={[{
                      value: progressValue,
                      color: progressValue === 100 ? "green" : "indigo",
                    }]}
                    label={
                      <Text ta="center" fw={700} size="sm">
                        {progressValue}%
                      </Text>
                    }
                  />
                </Center>

                <List spacing="xs" size="sm" center>
                  {checklist.map((item) => (
                    <List.Item
                      key={item.label}
                      icon={
                        item.done ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <Circle size={16} className="text-slate-300 dark:text-slate-600" />
                        )
                      }
                    >
                      <Text
                        size="sm"
                        c={item.done ? undefined : "dimmed"}
                        fw={item.done ? 500 : 400}
                      >
                        {item.label}
                      </Text>
                    </List.Item>
                  ))}
                </List>
              </Card>

              <Card radius="xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="md">
                  <ThemeIcon variant="light" color="yellow" radius="lg" size={32}>
                    <Sparkles size={15} />
                  </ThemeIcon>
                  <Text fw={600} size="md">Editing Tips</Text>
                </Group>
                <Stack gap="sm">
                  <Text size="sm" c="dimmed">
                    Refresh the title if the article direction has changed since you first wrote it.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Replace the cover image if you want a stronger visual first impression.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Break any long paragraphs into shorter ones for better readability.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Re-read the ending — a strong closing leaves a lasting impression.
                  </Text>
                </Stack>
              </Card>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  )
}