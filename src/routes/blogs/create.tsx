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

import { Save, ImagePlus, FileText } from "lucide-react"
import { useEffect, useState } from "react"

import { uploadImage } from "@/lib/utils"
import { useServerFn } from "@tanstack/react-start"
import { createBlog } from "@/server/blog.functions"
import { AuthMiddleware } from "@/server/middleware"
import { useBlogCreateMutation } from "@/db/mutations/blog.mutations"

interface BlogForm {
  title: string
  content: string
  coverImage: File | null
  tags: string[]

}

export const Route = createFileRoute("/blogs/create")({
  server: {
    middleware: [AuthMiddleware],
  },
  component: RouteComponent,
})

const turndownService = new TurndownService()

function RouteComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
 
  const [tagInput, setTagInput] = useState("")
  const createBlogMutation=useBlogCreateMutation()
  const form = useForm<BlogForm>({
    initialValues: {
      title: "",
      content: "",
      coverImage: null,
      tags: [],
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

      const markdownContent = turndownService.turndown(content)
      // console.log("Data is here " + JSON.stringify({ ...rest, defaultUrl, markdownContent }))
      const inputValues={
          title: rest.title,
          tags: rest.tags,
          content: markdownContent,
          coverImage: defaultUrl,
      }
      await createBlogMutation.mutateAsync(inputValues)
   
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const previewUrl = form.values.coverImage
    ? URL.createObjectURL(form.values.coverImage)
    : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper
        className="w-full max-w-3xl p-6 shadow-md rounded-lg"
        radius="md"
        withBorder
      >
        <Title order={2} className="mb-6 text-center">
          Create Blog Post
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                w={700}
                h={200}
                radius="sm"
                className="mx-auto"
              />
            )}
            <TextInput
              label="Blog Title"
              placeholder="My awesome blog"
              leftSection={<FileText size={16} />}
              {...form.getInputProps("title")}
              required
            />


            <FileInput
              label="Cover Image"
              placeholder="Upload Blog image"
              leftSection={<ImagePlus size={16} />}
              accept="image/*"
              {...form.getInputProps("coverImage")}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Content
              </label>

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

                <RichTextEditor.Content className="min-h-[300px]" />
              </RichTextEditor>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>

              <Group align="flex-end">
                <TextInput
                  placeholder="Enter a tag"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleAddTag()
                    }
                  }}
                  className="flex-1"
                />

                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </Group>

              {form.values.tags.length > 0 && (
                <Group mt="sm">
                  {form.values.tags.map((tag) => (
                    <Badge
                      key={tag}
                      size="lg"
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
                onClick={() => router.history.back()}
              >
                Cancel
              </Button>

              <Button
                type="submit"
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
  )
}