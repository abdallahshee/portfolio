import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "@mantine/form"
import {
  TextInput,
  Button,
  Paper,
  Stack,
  FileInput,
  Group,
  Image,
  Badge,
  Container,
  Text,
  Card,
  Divider,
  ThemeIcon,
  SimpleGrid,
  Select,
  Loader,
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
  Tags,
  Sparkles,
  ArrowLeft,
  PencilLine,
  Clock3,
  NotebookPen,
} from "lucide-react"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { useServerFn } from "@tanstack/react-start"

import { ArticleSchema, type ArticleRequest } from "@/db/validations/article.types"
import { getArticleBySlug } from "@/server/article.functions"
import { useQuery } from "@tanstack/react-query"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type EditorMode = "create" | "edit"

interface CategoryOption {
  id: string
  name: string
}

interface ArticleEditorProps {
  mode: EditorMode
  slug?: string
  initialData?: Partial<ArticleRequest> | null
  loading?: boolean
  onCancel: () => void
  onSubmit: (values: ArticleRequest, imageFile: File | null) => Promise<void> | void
}

const defaultArticleValues: ArticleRequest = {
  title: "",
  userId: "",
  content: "",
  coverImage: null,
  tags: [],
  categoryId: null,
}

export default function ArticleEditor({
  mode,
  slug,
  initialData,
  loading = false,
  onCancel,
  onSubmit,
}: ArticleEditorProps) {
  const isEdit = mode === "edit"
  const getArticleFn = useServerFn(getArticleBySlug)
  const turndownService = useRef<any>(null)
  const { data: categories } = useQuery(getAllCategoriesQueryOption())
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.coverImage ?? null)
  const [fetchingArticle, setFetchingArticle] = useState(false)
  const supabase = getSupabaseBrowserClient()
  const mergedInitialValues = useMemo<ArticleRequest>(() => {
    return {
      ...defaultArticleValues,
      ...initialData,
      coverImage: initialData?.coverImage ?? null,
      categoryId: initialData?.categoryId ?? null,
      tags: initialData?.tags ?? [],
    }
  }, [initialData])

  const form = useForm<ArticleRequest>({
    initialValues: mergedInitialValues,
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
    content: mergedInitialValues.content,
    onUpdate: ({ editor }) => {
      form.setFieldValue("content", editor.getHTML())
    },
  })

  useEffect(() => {
    import("turndown").then((mod) => {
      turndownService.current = new mod.default()
    })
  }, [])

  useEffect(() => {
    form.setValues(mergedInitialValues)
    setPreviewUrl(mergedInitialValues.coverImage)

    if (editor) {
      const nextContent = mergedInitialValues.content || ""
      if (editor.getHTML() !== nextContent) {
        editor.commands.setContent(nextContent)
      }
    }
  }, [mergedInitialValues, editor])

  useEffect(() => {
    if (!imageFile) return

    const objectUrl = URL.createObjectURL(imageFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [imageFile])

  useEffect(() => {
    if (!isEdit || initialData || !slug) return

    let isMounted = true

    const fetchArticle = async () => {
      try {
        setFetchingArticle(true)
        const article = await getArticleFn({ data: { slug } })

        if (!isMounted || !article) return

        const nextValues: ArticleRequest = {
          title: article.title ?? "",
          userId: article.userId ?? "",
          content: article.content ?? "",
          coverImage: article.coverImage ?? null,
          tags: article.tags ?? [],
          categoryId: article?.categoryId ?? null,
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
  }, [isEdit, initialData, slug, getArticleFn, editor])

  const handleAddTag = () => {
    const newTag = tagInput.trim()
    if (!newTag) return

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

  const handleRemoveTag = (tagToRemove: string) => {
    form.setFieldValue(
      "tags",
      form.values.tags.filter((tag) => tag !== tagToRemove)
    )
  }

  const handleSubmit = async (values: ArticleRequest) => {
    const markdownContent =
      turndownService.current && values.content
        ? turndownService.current.turndown(values.content)
        : values.content

    await onSubmit(
      {
        ...values,
        content: markdownContent,
      },
      imageFile
    )
    // if(state)
  }

  const isBusy = loading || fetchingArticle

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
                    {isEdit ? <PencilLine size={18} /> : <NotebookPen size={18} />}
                  </ThemeIcon>
                  <Text fw={600} c="dimmed" size="sm">
                    {isEdit ? "Blog Editor" : "Blog Studio"}
                  </Text>
                </Group>

                <div className="title2">
                  {isEdit ? "Edit Blog Post" : "Create a New Blog Post"}
                </div>

                <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  {isEdit
                    ? "Refine your article, update the cover image, improve the content, and keep your tags organized before publishing changes."
                    : "Write, format, and publish a professional article with a cover image, rich text content, and organized tags."}
                </Text>
              </Stack>

              <Button
                variant="light"
                radius="md"
                size="sm"
                leftSection={<ArrowLeft size={16} />}
                onClick={onCancel}
              >
                Back
              </Button>
            </Group>
          </Paper>

          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
            <div className="lg:col-span-2">
              <Paper radius="2xl" p="xl" withBorder className="shadow-sm">
                {isBusy ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <Group gap="sm">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        {fetchingArticle ? "Loading article..." : "Processing..."}
                      </Text>
                    </Group>
                  </div>
                ) : (
                  <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon variant="light" color="blue" radius="xl">
                            <FileText size={16} />
                          </ThemeIcon>
                          <div className="title3">Post Details</div>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {isEdit
                            ? "Update the core details of your blog post."
                            : "Add the main details for your article."}
                        </Text>
                      </div>

                      <TextInput
                        label="Blog Title"
                        placeholder="My awesome blog"
                        leftSection={<FileText size={16} />}
                        radius="md"
                        size="sm"

                        {...form.getInputProps("title")}
                      />

                      <Select
                        label="Category"
                        placeholder="Select a category"
                        leftSection={<FileText size={16} />}
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


                      <FileInput
                        label={isEdit ? "Blog Image" : "Cover Image"}
                        placeholder={
                          isEdit ? "Update blog image" : "Upload blog image"
                        }
                        leftSection={<ImagePlus size={16} />}
                        accept="image/*"
                        radius="md"
                        size="sm"
                        value={imageFile}
                        onChange={setImageFile}
                      />

                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt="Blog cover preview"
                            h={240}
                            radius="xl"
                            fit="contain"
                          />
                        ) : (
                          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-500 dark:border-slate-700">
                            {isEdit
                              ? "No cover image available"
                              : "No cover image selected"}
                          </div>
                        )}
                      </div>

                      <Divider />

                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon variant="light" color="grape" radius="xl">
                            <PenSquare size={16} />
                          </ThemeIcon>
                          <div className="title3">Content</div>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {isEdit
                            ? "Edit and format your article content below."
                            : "Use the editor below to write and format your post."}
                        </Text>
                      </div>

                      <RichTextEditor editor={editor}>
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

                        <RichTextEditor.Content className="min-h-[320px]" />
                      </RichTextEditor>

                      {form.errors.content && (
                        <Text c="red" size="sm">
                          {form.errors.content}
                        </Text>
                      )}

                      <Divider />

                      <div>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon variant="light" color="teal" radius="xl">
                            <Tags size={16} />
                          </ThemeIcon>
                          <div className="title3">Tags</div>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {isEdit
                            ? "Update tags to better organize and surface your article."
                            : "Add relevant tags to make your article easier to discover."}
                        </Text>
                      </div>

                      <div>
                        <Group align="flex-end">
                          <TextInput
                            label="New Tag"
                            size="sm"
                            placeholder="Enter a tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.currentTarget.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddTag()
                              }
                            }}
                            className="flex-1"
                            radius="md"
                          />
                          <Button type="button" onClick={handleAddTag} radius="md">
                            Add
                          </Button>
                        </Group>

                        {form.values.tags.length > 0 && (
                          <Group mt="sm">
                            {form.values.tags.map((tag) => (
                              <Badge
                                key={tag}
                                size="lg"
                                radius="xl"
                                variant="light"
                                className="cursor-pointer"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                {tag} ×
                              </Badge>
                            ))}
                          </Group>
                        )}
                      </div>

                      <Group justify="flex-end" mt="md">
                        <Button
                          variant="default"
                          type="button"
                          radius="md"
                          size="sm"
                          onClick={onCancel}
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
                          {isEdit ? "Save Changes" : "Create Blog"}
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                )}
              </Paper>
            </div>

            <Stack gap="lg">
              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="yellow" radius="xl">
                    <Sparkles size={16} />
                  </ThemeIcon>
                  <div className="title3">{isEdit ? "Editing Tips" : "Writing Tips"}</div>
                </Group>

                <Stack gap="sm">
                  {isEdit ? (
                    <>
                      <Text size="sm" c="dimmed">
                        Refresh the title to make it clearer and more engaging.
                      </Text>
                      <Text size="sm" c="dimmed">
                        Replace the cover image if you want a stronger visual first impression.
                      </Text>
                      <Text size="sm" c="dimmed">
                        Break long sections with headings for easier reading.
                      </Text>
                      <Text size="sm" c="dimmed">
                        Update tags to match the final direction of the article.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text size="sm" c="dimmed">
                        Use a clear, attention-grabbing title.
                      </Text>
                      <Text size="sm" c="dimmed">
                        Add a strong cover image to improve presentation.
                      </Text>
                      <Text size="sm" c="dimmed">
                        Break content into short sections with headings.
                      </Text>
                      <Text size="sm" c="dimmed">
                        Use tags that match the main topic of your article.
                      </Text>
                    </>
                  )}
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="gray" radius="xl">
                    <Clock3 size={16} />
                  </ThemeIcon>
                  <div className="title3">
                    {isEdit ? "Edit Summary" : "Publishing Checklist"}
                  </div>
                </Group>

                <Stack gap="xs">
                  {isEdit ? (
                    <>
                      <Text size="sm" c="dimmed">
                        Current title:
                      </Text>
                      <Text fw={600}>{form.values.title || "Untitled post"}</Text>
                      <Divider my="xs" />
                      <Text size="sm" c="dimmed">
                        Total tags: {form.values.tags.length}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Cover image: {previewUrl ? "Available" : "Not set"}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text size="sm" c="dimmed">
                        • Title added
                      </Text>
                      <Text size="sm" c="dimmed">
                        • Cover image selected
                      </Text>
                      <Text size="sm" c="dimmed">
                        • Content formatted
                      </Text>
                      <Text size="sm" c="dimmed">
                        • Tags attached
                      </Text>
                    </>
                  )}
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <div className="title3 mb-1">
                  Quick Preview
                </div>

                <Stack gap="xs">
                  <Text fw={600}>
                    {form.values.title ||
                      (isEdit
                        ? "Your edited blog title will appear here"
                        : "Your blog title will appear here")}
                  </Text>

                  <Text size="sm" c="dimmed" lineClamp={4}>
                    {editor?.getText() ||
                      (isEdit
                        ? "Edit your content to see a short text preview here."
                        : "Start writing to see a quick text preview of your article.")}
                  </Text>

                  {form.values.tags.length > 0 && (
                    <Group mt="xs">
                      {form.values.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="dot" color="indigo">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Stack>
              </Card>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  )
}