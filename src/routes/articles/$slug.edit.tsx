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
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import TurndownService from "turndown"

import { uploadImage } from "@/lib/utils"
import { canEditBlogMiddleware } from "@/server/middleware"
import { getBlogBySlugForUpdateQueryOptions } from "@/db/queries/blog.queries"
import { blogUpdateMutationOption } from "@/db/mutations/blog.mutations"

interface BlogForm {
  title: string
  content: string
  coverImage: File | null
  tags: string[]
}

export const Route = createFileRoute("/articles/$slug/edit")({
  server: {
    middleware: [canEditBlogMiddleware],
  },
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      getBlogBySlugForUpdateQueryOptions(params.slug)
    )
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const turndownService = useRef(new TurndownService())
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const blog = Route.useLoaderData()
  const { slug } = Route.useParams()

  const form = useForm<BlogForm>({
    initialValues: {
      title: blog?.title ?? "",
      content: blog?.content ?? "",
      coverImage: null,
      tags: blog?.tags ?? [],
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

  const updateMutation = blogUpdateMutationOption()

  const handleSubmit = async (values: BlogForm) => {
    try {
      setLoading(true)

      let imageUrl = ""
      if (values.coverImage) {
        imageUrl = await uploadImage(values.coverImage)
      }

      const defaultUrl =
        "https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg"

      const { coverImage, content, ...rest } = values
      const markdownContent = turndownService.current.turndown(content)

      await updateMutation.mutateAsync({
        blogSchema: {
          title: rest.title,
          tags: rest.tags,
          content: markdownContent,
          coverImage: imageUrl || blog?.coverImage || defaultUrl,
        },
        slug,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const previewUrl = useMemo(() => {
    if (form.values.coverImage) {
      return URL.createObjectURL(form.values.coverImage)
    }
    return blog?.coverImage || null
  }, [form.values.coverImage, blog?.coverImage])

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
                    <PencilLine size={18} />
                  </ThemeIcon>
                  <Text fw={600} c="dimmed" size="sm">
                    Blog Editor
                  </Text>
                </Group>

                <Title order={1} className="text-3xl md:text-5xl">
                  Edit Blog Post
                </Title>

                <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Refine your article, update the cover image, improve the content,
                  and keep your tags organized before publishing changes.
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
                        Update the core details of your blog post.
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
                      label="Blog Image"
                      placeholder="Update blog image"
                      leftSection={<ImagePlus size={16} />}
                      accept="image/*"
                      radius="md"
                      size="md"
                      {...form.getInputProps("coverImage")}
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
                          No cover image available
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
                        Edit and format your article content below.
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
                        Update tags to better organize and surface your article.
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
                        Save Changes
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
                  <Title order={4}>Editing Tips</Title>
                </Group>

                <Stack gap="sm">
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
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Group gap="xs" mb="sm">
                  <ThemeIcon variant="light" color="gray" radius="xl">
                    <Clock3 size={16} />
                  </ThemeIcon>
                  <Title order={4}>Edit Summary</Title>
                </Group>

                <Stack gap="xs">
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
                </Stack>
              </Card>

              <Card radius="2xl" withBorder p="xl" className="shadow-sm">
                <Title order={4} mb="sm">
                  Quick Preview
                </Title>

                <Stack gap="xs">
                  <Text fw={600}>
                    {form.values.title || "Your edited blog title will appear here"}
                  </Text>

                  <Text size="sm" c="dimmed" lineClamp={4}>
                    {editor?.getText() ||
                      "Edit your content to see a short text preview here."}
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