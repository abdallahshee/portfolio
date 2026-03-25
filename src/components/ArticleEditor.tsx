import { useForm } from "@mantine/form"
import {
  TextInput, Button, Paper, Title, Stack, FileInput,
  Group, Image, Badge, Container, Text, Card, Divider,
  ThemeIcon, SimpleGrid, Select, Loader,
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
  Save, ImagePlus, FileText, PenSquare, Tags,
  Sparkles, ArrowLeft, PencilLine, Clock3, NotebookPen,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { uploadImage } from "@/lib/utils"
import type { ArticleRequest } from "@/db/validations/article.types"

interface Category {
  id: string
  name: string
}

interface ArticleEditorProps {
  mode: "create" | "edit"
  initialValues?: ArticleRequest & { slug?: string }
  onSubmit: (values: ArticleRequest, imageUrl: string) => Promise<void>
  onCancel: () => void
  loading?: boolean
  categories?: Category[]
}

export default function ArticleEditor({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  categories = [],
}: ArticleEditorProps) {
  const isEdit = mode === "edit"
  const turndownService = useRef<any>(null)
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialValues?.coverImage ?? null
  )
  const [uploading, setUploading] = useState(false)

  // lazy load TurndownService only when needed
  useEffect(() => {
    import("turndown").then((mod) => {
      turndownService.current = new mod.default()
    })
  }, [])

  const form = useForm<ArticleRequest>({
    initialValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      coverImage: initialValues?.coverImage ?? "",
      tags: initialValues?.tags ?? [],
      categoryId: initialValues?.categoryId ?? "",
    },
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
    content: form.values.content,
    onUpdate: ({ editor }) => {
      form.setFieldValue("content", editor.getHTML())
    },
  })

  // sync editor content when initialValues change (edit mode)
  useEffect(() => {
    if (editor && initialValues?.content && editor.getHTML() !== initialValues.content) {
      editor.commands.setContent(initialValues.content)
    }
  }, [editor, initialValues?.content])

  // handle image file change — upload and set preview
  useEffect(() => {
    if (!imageFile) return

    let cancelled = false

    const upload = async () => {
      setUploading(true)
      try {
        const url = await uploadImage(imageFile)
        if (!cancelled) {
          setPreviewUrl(url)
          form.setFieldValue("coverImage", url)
        }
      } catch (err) {
        console.error("Image upload failed:", err)
      } finally {
        if (!cancelled) setUploading(false)
      }
    }

    upload()

    return () => { cancelled = true }
  }, [imageFile])

  const handleAddTag = () => {
    const newTag = tagInput.trim()
    if (!newTag) return
    const exists = form.values.tags.some(
      (tag) => tag.toLowerCase() === newTag.toLowerCase()
    )
    if (exists) { setTagInput(""); return }
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
    const markdownContent = turndownService.current
      ? turndownService.current.turndown(values.content)
      : values.content

    await onSubmit({ ...values, content: markdownContent }, values.coverImage ?? "")
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="xl">
        <Stack gap="xl">

          {/* Header */}
          <Paper radius="2xl" p="xl" withBorder
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
                <Title order={1} className="text-3xl md:text-5xl">
                  {isEdit ? "Edit Blog Post" : "Create a New Blog Post"}
                </Title>
                <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  {isEdit
                    ? "Refine your article, update the cover image, improve the content, and keep your tags organized before publishing changes."
                    : "Write, format, and publish a professional article with a cover image, rich text content, and organized tags."
                  }
                </Text>
              </Stack>
              <Button variant="light" radius="xl" leftSection={<ArrowLeft size={16} />} onClick={onCancel}>
                Back
              </Button>
            </Group>
          </Paper>

          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
            <div className="lg:col-span-2">
              <Paper radius="2xl" p="xl" withBorder className="shadow-sm">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="lg">

                    {/* Post Details */}
                    <div>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon variant="light" color="blue" radius="xl">
                          <FileText size={16} />
                        </ThemeIcon>
                        <Title order={3}>Post Details</Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {isEdit ? "Update the core details of your blog post." : "Add the main details for your article."}
                      </Text>
                    </div>

                    <TextInput
                      label="Blog Title"
                      placeholder="My awesome blog"
                      leftSection={<FileText size={16} />}
                      radius="md" size="md"
                      {...form.getInputProps("title")}
                      required
                    />

                    <Select
                      label="Category"
                      placeholder="Select a category"
                      leftSection={<FileText size={16} />}
                      radius="md" size="md"
                      data={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                      {...form.getInputProps("categoryId")}
                    />

                    <FileInput
                      label={isEdit ? "Blog Image" : "Cover Image"}
                      placeholder={isEdit ? "Update blog image" : "Upload blog image"}
                      leftSection={uploading ? <Loader size={16} /> : <ImagePlus size={16} />}
                      accept="image/*"
                      radius="md" size="md"
                      onChange={(file) => setImageFile(file)}
                      disabled={uploading}
                    />

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                      {uploading ? (
                        <div className="flex h-[220px] items-center justify-center gap-2 text-slate-500">
                          <Loader size="sm" />
                          <Text size="sm">Uploading image...</Text>
                        </div>
                      ) : previewUrl ? (
                        <Image src={previewUrl} alt="Blog cover preview" h={240} radius="xl" fit="contain" />
                      ) : (
                        <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-500 dark:border-slate-700">
                          {isEdit ? "No cover image available" : "No cover image selected"}
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* Content */}
                    <div>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon variant="light" color="grape" radius="xl">
                          <PenSquare size={16} />
                        </ThemeIcon>
                        <Title order={3}>Content</Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {isEdit ? "Edit and format your article content below." : "Use the editor below to write and format your post."}
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

                    <Divider />

                    {/* Tags */}
                    <div>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon variant="light" color="teal" radius="xl">
                          <Tags size={16} />
                        </ThemeIcon>
                        <Title order={3}>Tags</Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {isEdit
                          ? "Update tags to better organize and surface your article."
                          : "Add relevant tags to make your article easier to discover."
                        }
                      </Text>
                    </div>

                    <div>
                      <Group align="flex-end">
                        <TextInput
                          label="New Tag"
                          placeholder="Enter a tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.currentTarget.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); handleAddTag() }
                          }}
                          className="flex-1"
                          radius="md"
                        />
                        <Button type="button" onClick={handleAddTag} radius="md">Add</Button>
                      </Group>
                      {form.values.tags.length > 0 && (
                        <Group mt="sm">
                          {form.values.tags.map((tag) => (
                            <Badge key={tag} size="lg" radius="xl" variant="light"
                              className="cursor-pointer" onClick={() => handleRemoveTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </Group>
                      )}
                    </div>

                    <Group justify="flex-end" mt="md">
                      <Button variant="default" type="button" radius="xl" onClick={onCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" radius="xl" loading={loading}
                        disabled={uploading} leftSection={<Save size={16} />}
                      >
                        {isEdit ? "Save Changes" : "Create Blog"}
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Paper>
            </div>

            {/* Sidebar */}
            <Stack gap="lg">
              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="yellow" radius="xl">
                    <Sparkles size={16} />
                  </ThemeIcon>
                  <Title order={4}>{isEdit ? "Editing Tips" : "Writing Tips"}</Title>
                </Group>
                <Stack gap="sm">
                  {isEdit ? (
                    <>
                      <Text size="sm" c="dimmed">Refresh the title to make it clearer and more engaging.</Text>
                      <Text size="sm" c="dimmed">Replace the cover image if you want a stronger visual first impression.</Text>
                      <Text size="sm" c="dimmed">Break long sections with headings for easier reading.</Text>
                      <Text size="sm" c="dimmed">Update tags to match the final direction of the article.</Text>
                    </>
                  ) : (
                    <>
                      <Text size="sm" c="dimmed">Use a clear, attention-grabbing title.</Text>
                      <Text size="sm" c="dimmed">Add a strong cover image to improve presentation.</Text>
                      <Text size="sm" c="dimmed">Break content into short sections with headings.</Text>
                      <Text size="sm" c="dimmed">Use tags that match the main topic of your article.</Text>
                    </>
                  )}
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="gray" radius="xl">
                    <Clock3 size={16} />
                  </ThemeIcon>
                  <Title order={4}>{isEdit ? "Edit Summary" : "Publishing Checklist"}</Title>
                </Group>
                <Stack gap="xs">
                  {isEdit ? (
                    <>
                      <Text size="sm" c="dimmed">Current title:</Text>
                      <Text fw={600}>{form.values.title || "Untitled post"}</Text>
                      <Divider my="xs" />
                      <Text size="sm" c="dimmed">Total tags: {form.values.tags.length}</Text>
                      <Text size="sm" c="dimmed">Cover image: {previewUrl ? "Available" : "Not set"}</Text>
                    </>
                  ) : (
                    <>
                      <Text size="sm" c="dimmed">• Title added</Text>
                      <Text size="sm" c="dimmed">• Cover image selected</Text>
                      <Text size="sm" c="dimmed">• Content formatted</Text>
                      <Text size="sm" c="dimmed">• Tags attached</Text>
                    </>
                  )}
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Title order={4} mb="sm">Quick Preview</Title>
                <Stack gap="xs">
                  <Text fw={600}>
                    {form.values.title || (isEdit ? "Your edited blog title will appear here" : "Your blog title will appear here")}
                  </Text>
                  <Text size="sm" c="dimmed" lineClamp={4}>
                    {editor?.getText() || (isEdit
                      ? "Edit your content to see a short text preview here."
                      : "Start writing to see a quick text preview of your article."
                    )}
                  </Text>
                  {form.values.tags.length > 0 && (
                    <Group mt="xs">
                      {form.values.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="dot" color="indigo">{tag}</Badge>
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