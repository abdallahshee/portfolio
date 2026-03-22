import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useForm } from "@mantine/form"
import {
  TextInput,
  Button,
  Paper,
  Title,
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
} from "@mantine/core"
import { RichTextEditor, Link } from "@mantine/tiptap"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Superscript from "@tiptap/extension-superscript"
import SubScript from "@tiptap/extension-subscript"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import TurndownService from "turndown"
import {
  Save,
  ImagePlus,
  FileText,
  PenSquare,
  Tags,
  Sparkles,
  ArrowLeft,
  NotebookPen,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { uploadImage } from "@/lib/utils"
import { AuthMiddleware } from "@/server/middleware"
import { useBlogCreateMutation } from "@/db/mutations/blog.mutations"
import type { BlogRequest } from "@/db/schema"
import { getAllCategoriesQueryOption } from "@/db/queries/category.queries"
import { useQuery } from "@tanstack/react-query"


export const Route = createFileRoute("/blogs/create")({
  server: {
    middleware: [AuthMiddleware],
  },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllCategoriesQueryOption())
  },
  component: RouteComponent,
})

const turndownService = new TurndownService()

function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const createBlogMutation = useBlogCreateMutation()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { data: categories } = useQuery(getAllCategoriesQueryOption())
  const form = useForm<BlogRequest>({
    initialValues: {
      title: "",
      content: "",
      coverImage: null,
      tags: [],
      categoryId: null
    },
  })

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
    content: form.values.content || "",
    onUpdate: ({ editor }) => {
      form.setFieldValue("content", editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && form.values.content !== editor.getHTML()) {
      editor.commands.setContent(form.values.content || "")
    }
  }, [editor])

  const handleSubmit = async (values: BlogRequest) => {
    try {
      setLoading(true)

      let imageUrl = ""
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const defaultUrl =
        "https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg"

      const { coverImage, content, ...rest } = values
      const markdownContent = turndownService.turndown(content)

      const inputValues = {
        title: rest.title,
        tags: rest.tags,
        content: markdownContent,
        coverImage: imageUrl || defaultUrl,
        categoryId: rest.categoryId
      }

      await createBlogMutation.mutateAsync(inputValues)


    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const previewUrl = useMemo(() => {
    if (!imageFile) return null
    return URL.createObjectURL(imageFile)
  }, [imageFile])

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
                    <NotebookPen size={18} />
                  </ThemeIcon>
                  <Text fw={600} c="dimmed" size="sm">
                    Blog Studio
                  </Text>
                </Group>

                <Title order={1} className="text-3xl md:text-5xl">
                  Create a New Blog Post
                </Title>

                <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Write, format, and publish a professional article with a cover
                  image, rich text content, and organized tags.
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

          <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
            <div className="lg:col-span-2">
              <Paper radius="2xl" p="xl" withBorder className="shadow-sm">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="lg">
                    <div>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon variant="light" color="blue" radius="xl">
                          <FileText size={16} />
                        </ThemeIcon>
                        <Title order={3}>Post Details</Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Add the main details for your article.
                      </Text>
                    </div>

                    <TextInput
                      label="Blog Title"
                      placeholder="My awesome blog"
                      leftSection={<FileText size={16} />}
                      radius="md"
                      size="md"
                      {...form.getInputProps("title")}
                      required
                    />


                    <FileInput
                      label="Cover Image"
                      placeholder="Upload blog image"
                      leftSection={<ImagePlus size={16} />}
                      accept="image/*"
                      radius="md"
                      size="md"
                      onChange={(e) => {
                        setImageFile(e)
                      }}
                    />
                    <Select
                      label="Category"
                      placeholder="Select a category"
                      leftSection={<FileText size={16} />}
                      radius="md"
                      size="md"
                      data={categories?.map((cat) => ({
                        label: cat.name,
                        value: String(cat.id),
                      })) ?? []}
                      {...form.getInputProps("categoryId")}
                      required
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
                          No cover image selected
                        </div>
                      )}
                    </div>

                    <Divider />

                    <div>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon variant="light" color="grape" radius="xl">
                          <PenSquare size={16} />
                        </ThemeIcon>
                        <Title order={3}>Content</Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Use the editor below to write and format your post.
                      </Text>
                    </div>

                    <div>
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
                    </div>

                    <Divider />

                    <div>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon variant="light" color="teal" radius="xl">
                          <Tags size={16} />
                        </ThemeIcon>
                        <Title order={3}>Tags</Title>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Add relevant tags to make your article easier to discover.
                      </Text>
                    </div>

                    <div>
                      <Group align="flex-end">
                        <TextInput
                          label="New Tag"
                          placeholder="Enter a tag"
                          value={tagInput}
                          onChange={(event) =>
                            setTagInput(event.currentTarget.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
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
                        Create Blog
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Paper>
            </div>

            <Stack gap="lg">
              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="yellow" radius="xl">
                    <Sparkles size={16} />
                  </ThemeIcon>
                  <Title order={4}>Writing Tips</Title>
                </Group>

                <Stack gap="sm">
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
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Title order={4} mb="sm">
                  Publishing Checklist
                </Title>

                <Stack gap="xs">
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
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Title order={4} mb="sm">
                  Quick Preview
                </Title>

                <Stack gap="xs">
                  <Text fw={600}>
                    {form.values.title || "Your blog title will appear here"}
                  </Text>
                  <Text size="sm" c="dimmed" lineClamp={4}>
                    {editor?.getText() ||
                      "Start writing to see a quick text preview of your article."}
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