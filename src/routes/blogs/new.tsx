import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useForm } from "@mantine/form"
import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Title,
  Stack,
  FileInput,
  Switch,
  Select,
  TagsInput,
  Group
} from "@mantine/core"

import { Save, ImagePlus, FileText } from "lucide-react"
import { useState } from "react"
import type { BlogRequest } from "@/db/blog-schema"
import { uploadImage } from "@/lib/utils"

interface BlogForm {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: File
  tags: string[]
}

export const Route = createFileRoute("/blogs/new")({
  component: CreateBlogPage,
})

function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<BlogForm>({
    initialValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: null,
      tags: [],
    },
  })

  const handleSubmit = async (values: BlogForm) => {
    try {

      const imageUrl = await uploadImage(values.coverImage)

      router.navigate({
        to: "/account",
        search: {
          callbackUrl: "/projects",
        },
      })
    } catch (err: any) {

    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper
        className="w-full max-w-2xl p-6 shadow-md rounded-lg"
        radius="md"
        withBorder>
        <Title order={2} className="mb-6 text-center">
          Create Blog Post
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">

            {/* Title */}
            <TextInput
              label="Blog Title"
              placeholder="My awesome blog"
              leftSection={<FileText size={16} />}
              {...form.getInputProps("title")}
              required
            />

            {/* Slug */}
            <TextInput
              label="Slug"
              placeholder="my-awesome-blog"
              {...form.getInputProps("slug")}
              required
            />

            {/* Excerpt */}
            <Textarea
              label="Excerpt"
              placeholder="Short description of the blog"
              minRows={3}
              {...form.getInputProps("excerpt")}
              required
            />

            {/* Cover Image */}
            <FileInput
              label="Cover Image"
              placeholder="Upload cover image"
              leftSection={<ImagePlus size={16} />}
              accept="image/*"
              {...form.getInputProps("coverImage")}
            />

            {/* Content */}
            <Textarea
              label="Content (Markdown)"
              placeholder="Write your blog in markdown..."
              minRows={10}
              {...form.getInputProps("content")}
              required
            />

            {/* Tags */}
            <TagsInput
              label="Tags"
              placeholder="Add tags"
              {...form.getInputProps("tags")}
            />


            {/* Published toggle */}
            <Switch
              label="Publish immediately"
              {...form.getInputProps("published", { type: "checkbox" })}
            />

            {/* Actions */}
            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                onClick={() => router.navigate({ to: "/blogs" })}
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