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
  Badge,
  Textarea,
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
  NotebookPen,
  CheckCircle2,
  Circle,
  Tags,
  Plus,
} from "lucide-react"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { ArticleSchema, type ArticleRequest } from "@/db/validations/article.types"
import { useQuery } from "@tanstack/react-query"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { useArticleCreateMutation } from "@/db/mutations/article.mutations"
import { AuthenticatedMiddleware } from "@/server/middleware/auth.middleware"

export const Route = createFileRoute("/articles/new")({
  server: { middleware: [AuthenticatedMiddleware] },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllCategoriesQueryOption())
  },
  component: RouteComponent,
})

const MAX_TAGS = 4

const defaultValues: ArticleRequest = {
  title: "",
  content: "",
  coverImage: null,
  categoryId: null,
  tags: [],
  excerpt: ""
}

function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [characterCount, setCharacterCount] = useState(0)

  const turndownService = useRef<any>(null)
  const createBlogMutation = useArticleCreateMutation()
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
      setCharacterCount(editor.getText().trim().length)
    },
  })

  useEffect(() => {
    import("turndown").then((mod) => {
      turndownService.current = new mod.default()
    })
  }, [])

  useEffect(() => {
    if (!imageFile) return
    const objectUrl = URL.createObjectURL(imageFile)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  const handleRemoveTag = (tagToRemove: string) => {
    if (form.values.tags.length <= 1) return

    form.setFieldValue(
      "tags",
      form.values.tags.filter((tag) => tag !== tagToRemove)
    )
  }

  const handleAddTag = () => {
    const newTag = tagInput.trim()
    if (!newTag) return

    if (form.values.tags.length >= MAX_TAGS) {
      setTagInput("")
      return
    }

    const exists = form.values.tags.some(
      (tag) => tag.toLowerCase() === newTag.toLowerCase()
    )

    if (exists) {
      setTagInput("")
      return
    }

    form.setFieldValue("tags", [...form.values.tags, newTag])
    setTagInput("")
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

      await createBlogMutation.mutateAsync({
        title: values.title,
        content: markdownContent,
        coverImage,
        categoryId: values.categoryId,
        tags: values.tags,
        excerpt: values.excerpt
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
    { label: "Cover image uploaded", done: !!previewUrl },
    { label: "Content written", done: characterCount > 20 },
    { label: "At least one tag added", done: form.values.tags.length > 0 },
  ]

  const completedCount = checklist.filter((c) => c.done).length
  const progressValue = Math.round((completedCount / checklist.length) * 100)

  return (
    <div className="">
      <Container size="xl">
        <Stack gap="xl">
          <Paper
            radius="md"
            p="xl"
            withBorder
            className="overflow-hidden shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="center">
              <Group gap="md">
                <ThemeIcon variant="light" color="indigo" radius="xl" size={48}>
                  <NotebookPen size={22} />
                </ThemeIcon>
                <div>
                  <div className="title3">
                    New Article Post
                  </div>
                  <Text size="sm" c="dimmed">
                    Write, format, and publish your article
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
              <Paper radius="md" p="xl" withBorder className="shadow-sm">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="xl">
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

                    <Stack gap="md">
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
                            <Text size="sm" c="dimmed">No image selected</Text>
                          </div>
                        )}
                      </div>

                      <Group gap="xs">
                        <ThemeIcon variant="light" color="orange" radius="lg" size={32}>
                          <ImagePlus size={15} />
                        </ThemeIcon>
                        <Text fw={600} size="md">Cover Image</Text>
                      </Group>

                      <FileInput
                        placeholder="Upload an image"
                        leftSection={<ImagePlus size={15} />}
                        accept="image/*"
                        radius="md"
                        size="sm"
                        value={imageFile}
                        onChange={setImageFile}
                      />
                    </Stack>

                    <Divider />

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

                    <Divider />

                    <Stack gap="md">
                      <Group gap="xs">
                        <ThemeIcon variant="light" color="teal" radius="lg" size={32}>
                          <Tags size={15} />
                        </ThemeIcon>
                        <Text fw={600} size="md">Tags</Text>
                      </Group>

                      <Group align="flex-end">
                        <TextInput
                          label={`Add Tag (${form.values.tags.length}/${MAX_TAGS})`}
                          placeholder="e.g. React, TypeScript, Backend"
                          radius="md"
                          size="sm"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.currentTarget.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddTag()
                            }
                          }}
                          className="flex-1"
                          disabled={form.values.tags.length >= MAX_TAGS}
                        />
                        <Button
                          type="button"
                          radius="md"
                          size="sm"
                          rightSection={<Plus size={16} />}
                          onClick={handleAddTag}
                          disabled={form.values.tags.length >= MAX_TAGS || !tagInput.trim()}
                        >
                          Add
                        </Button>
                      </Group>

                      <Text size="xs" c="dimmed">
                        You should add at least one tag and at most 4 tags.
                      </Text>

                      {form.values.tags.length > 0 && (
                        <Group gap="xs">
                          {form.values.tags.map((tag) => {
                            const canDelete = form.values.tags.length > 1

                            return (
                              <Badge
                                key={tag}
                                size="lg"
                                radius="md"
                                variant="light"
                                className={canDelete ? "cursor-pointer" : ""}
                                onClick={() => canDelete && handleRemoveTag(tag)}
                                styles={{
                                  root: {
                                    opacity: canDelete ? 1 : 0.7,
                                  },
                                }}
                              >
                                {canDelete ? `${tag} ×` : tag}
                              </Badge>
                            )
                          })}
                        </Group>
                      )}

                      {form.values.tags.length >= MAX_TAGS && (
                        <Text c="yellow" size="sm">
                          Maximum of 4 tags reached.
                        </Text>
                      )}

                      {form.errors.tags && (
                        <Text c="red" size="sm">
                          {form.errors.tags}
                        </Text>
                      )}
                    </Stack>

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
                        Publish Post
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Paper>
            </div>

            <Stack gap="lg">
              <Card radius="md" withBorder p="xl" className="shadow-sm">
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
                    sections={[{ value: progressValue, color: progressValue === 100 ? "green" : "indigo" }]}
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

              <Card radius="md" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="md">
                  <ThemeIcon variant="light" color="yellow" radius="lg" size={32}>
                    <Sparkles size={15} />
                  </ThemeIcon>
                  <Text fw={600} size="md">Writing Tips</Text>
                </Group>
                <Stack gap="sm">
                  <Text size="sm" c="dimmed">
                    Open with a hook — a question, stat, or bold claim that makes the reader want to continue.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Use headings every 3–4 paragraphs to break up long sections.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Pick a cover image that reflects the mood or topic of the article.
                  </Text>
                  <Text size="sm" c="dimmed">
                    Add a few clear tags so readers can discover the article more easily.
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