// src/routes/articles/$articleId/edit.tsx
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
  Loader,
  Center,
} from '@mantine/core'
import { Upload, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SupportedArticleCategories } from '@/db/utils'
import { ArticleCreateSchema, type ArticleRequest } from '@/db/validations/article.types'
import { splitGroupingsSchema } from 'node_modules/@tanstack/router-plugin/dist/esm/core/config'

export const Route = createFileRoute('/articles/$slug/edit')({
  component: RouteComponent,
})

const categoryOptions = SupportedArticleCategories.map((cat) => ({
  value: cat,
  label: cat.charAt(0).toUpperCase() + cat.slice(1),
}))

function RouteComponent() {
  const { slug } = Route.useParams()
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  // Replace with your actual fetch / query logic
  useEffect(() => {
    async function loadArticle() {
      try {
        setIsLoading(true)
        // const article = await fetchArticleById(articleId)
        const article = {
          title: 'Sample Article',
          content: 'Sample content...',
          excerpt: 'Sample excerpt',
          coverImage: 'https://placehold.co/1200x630',
          category: SupportedArticleCategories[0],
          featured: false,
        } // ← replace with real fetch

        form.setValues(article)
        if (article.coverImage) setPreview(article.coverImage)
      } finally {
        setIsLoading(false)
      }
    }
    loadArticle()
  }, [slug])

  const handleCoverImageChange = (file: File | null) => {
    // Only revoke if it's a blob (locally created), not a remote URL
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
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
    console.log('Update article', splitGroupingsSchema, values)
    // call your update mutation here
  }

  if (isLoading) {
    return (
      <Center className="min-h-[60vh]">
        <Loader color="teal" />
      </Center>
    )
  }

  return (
    <div className="mx-auto max-w-3xl py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 h-1 w-10 rounded-full bg-[rgba(79,184,178,0.8)]" />
        <Title order={1} fw={700} fz="2rem">
          Edit Article
        </Title>
        <Text c="dimmed" mt={6} size="sm">
          Update the details below and save your changes.
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
                  description="Upload a new image to replace the current one. Recommended: 1200×630px."
                  placeholder="Click to upload a new image"
                  accept="image/png,image/jpeg,image/webp"
                  leftSection={<Upload size={16} />}
                  clearable
                  onChange={handleCoverImageChange}
                  error={form.errors.coverImage}
                />

                {preview && (
                  <Box
                    mt="sm"
                    className="relative overflow-hidden rounded-md border border-solid border-[var(--mantine-color-default-border)]"
                  >
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
            <Button
              variant="default"
              type="button"
              onClick={() => form.reset()}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: 'rgba(79,184,178,0.85)', color: '#fff' }}
              styles={{ root: { '&:hover': { backgroundColor: 'rgba(79,184,178,1)' } } }}
            >
              Save Changes
            </Button>
          </Group>

        </Stack>
      </form>
    </div>
  )
}