// src/routes/articles/new.tsx
import { createFileRoute } from '@tanstack/react-router'
import { schemaResolver, useForm } from '@mantine/form'
import {
  TextInput,
  Textarea,
  Select,
  Switch,
  Button,
  Stack,
  Title,
  Text,
  Group,
  Paper,
  Divider,
  Box,
  Image,
  FileInput,
} from '@mantine/core'
import { Upload,UploadIcon,X } from 'lucide-react'
import { useState } from 'react'
import { SupportedArticleCategories } from '@/db/utils'
import { ArticleCreateSchema, type ArticleRequest } from '@/db/validations/article.types'

export const Route = createFileRoute('/articles/new')({
  component: RouteComponent,
})

const categoryOptions = SupportedArticleCategories.map((cat) => ({
  value: cat,
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
}))

function RouteComponent() {
  const [preview, setPreview] = useState<string | null>(null)

  const form = useForm<ArticleRequest>({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      category: SupportedArticleCategories[0],
      featured: false,
    },
    validate: schemaResolver(ArticleCreateSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const handleCoverImageChange = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      form.setFieldValue('coverImage', url)
    } else {
      setPreview(null)
      form.setFieldValue('coverImage', '')
    }
  }

  const handleSubmit = (values: ArticleRequest) => {
    console.log(values)
    // call your mutation / API here
  }

  return (
    <div className="mx-auto max-w-3xl py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 h-1 w-10 rounded-full bg-[rgba(79,184,178,0.8)]" />
        <Title order={1} fw={700} fz="2rem">
          New Article
        </Title>
        <Text c="dimmed" mt={6} size="sm">
          Fill in the details below to create and publish a new article.
        </Text>
      </div>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">

          {/* Content */}
          <Paper withBorder radius="md" p="xl">
            <Group gap="xs" mb={4}>
              <div className="h-3 w-3 rounded-sm bg-[rgba(79,184,178,0.7)]" />
              <Title order={5} fw={600}>Content</Title>
            </Group>
            <Text size="xs" c="dimmed" mb="md">
              The main body of your article.
            </Text>
            <Divider mb="md" />
            <Stack gap="md">
              <TextInput
                label="Title"
                placeholder="Give your article a compelling title"
                withAsterisk
                {...form.getInputProps('title')}
              />
              <Textarea
                label="Content"
                placeholder="Write your article content here..."
                withAsterisk
                autosize
                minRows={10}
                {...form.getInputProps('content')}
              />
              <Textarea
                label="Excerpt"
                description="A short summary shown in article previews."
                placeholder="Summarise your article in 1–2 sentences..."
                autosize
                minRows={3}
                {...form.getInputProps('excerpt')}
              />
            </Stack>
          </Paper>

          {/* Meta */}
          <Paper withBorder radius="md" p="xl">
            <Group gap="xs" mb={4}>
              <div className="h-3 w-3 rounded-sm bg-[rgba(79,184,178,0.7)]" />
              <Title order={5} fw={600}>Meta</Title>
            </Group>
            <Text size="xs" c="dimmed" mb="md">
              Additional details used for display and discovery.
            </Text>
            <Divider mb="md" />
            <Stack gap="md">

              {/* Cover Image */}
              <Box>
                <FileInput
                  label="Cover Image"
                  description="Recommended size: 1200×630px. JPG or PNG."
                  placeholder="Click to upload an image"
                  accept="image/png,image/jpeg,image/webp"
                  leftSection={<Upload size={16} />}
                  clearable
                  onChange={handleCoverImageChange}
                  error={form.errors.coverImage}
                />

                {/* Preview */}
                {preview && (
                  <Box mt="sm" className="relative overflow-hidden rounded-md border border-solid border-[var(--mantine-color-default-border)]">
                    <Image
                      src={preview}
                      alt="Cover preview"
                      radius="md"
                      h={200}
                      fit="cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleCoverImageChange(null)}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Box>
                )}
              </Box>

              <Select
                label="Category"
                placeholder="Pick a category"
                withAsterisk
                data={categoryOptions}
                {...form.getInputProps('category')}
              />
              <Box>
                <Text size="sm" fw={500} mb={6}>Featured</Text>
                <Switch
                  label="Pin this article to the top of the blog"
                  color="teal"
                  {...form.getInputProps('featured', { type: 'checkbox' })}
                />
              </Box>
            </Stack>
          </Paper>

          {/* Actions */}
          <Group justify="flex-end" gap="sm" pb="xl">
            <Button variant="default" type="button" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: 'rgba(79,184,178,0.85)', color: '#fff' }}
              styles={{ root: { '&:hover': { backgroundColor: 'rgba(79,184,178,1)' } } }}
            >
              Publish Article
            </Button>
          </Group>

        </Stack>
      </form>
    </div>
  )
}