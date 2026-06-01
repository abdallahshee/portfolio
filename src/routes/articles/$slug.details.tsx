// src/routes/articles/$articleId/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import {
  Title,
  Text,
  Badge,
  Group,
  Divider,
  Loader,
  Center,
  Box,
  Image,
} from '@mantine/core'
import { Calendar, RefreshCw, Folder, Star } from 'lucide-react'

export const Route = createFileRoute('/articles/$slug/details')({
  component: RouteComponent,
})

// Replace with your actual select schema type
type ArticleDetail = {
  title: string
  content: string
  coverImage: string | null
  // slug: string
  category: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function RouteComponent() {
  const { slug } = Route.useParams()

  // Replace with your actual fetch / query
  const isLoading = false
  const article: ArticleDetail = {
    title: 'Building a Portfolio with React and TanStack Router',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    coverImage: 'https://placehold.co/1200x630',
    category: 'tutorial',
    featured: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-01'),
  }

  if (isLoading) {
    return (
      <Center className="min-h-[60vh]">
        <Loader color="teal" />
      </Center>
    )
  }

  return (
    <article className="mx-auto max-w-5xl py-10">

      {/* Category + Featured */}
      <Group gap="xs" mb="md">
        <Badge
          variant="light"
          color="teal"
          leftSection={<Folder size={11} />}
          tt="capitalize"
        >
          {article.category}
        </Badge>
        {article.featured && (
          <Badge
            variant="light"
            color="yellow"
            leftSection={<Star size={11} />}
          >
            Featured
          </Badge>
        )}
      </Group>

      {/* Title */}
      <div className="mb-2 h-1 w-10 rounded-full bg-[rgba(79,184,178,0.8)]" />
      <Title order={1} fw={800} fz={{ base: '1.8rem', sm: '2.4rem' }} lh={1.2} mb="md">
        {article.title}
      </Title>

      {/* Meta */}
      <Group gap="lg" mb="xl">
        <Group gap={6}>
          <Calendar size={14} className="text-[rgba(79,184,178,0.9)]" />
          <Text size="xs" c="dimmed">
            Published {formatDate(article.createdAt)}
          </Text>
        </Group>
        {article.updatedAt > article.createdAt && (
          <Group gap={6}>
            <RefreshCw size={14} className="text-[rgba(79,184,178,0.9)]" />
            <Text size="xs" c="dimmed">
              Updated {formatDate(article.updatedAt)}
            </Text>
          </Group>
        )}
      </Group>

      <Divider mb="xl" />

      {/* Cover Image */}
      {article.coverImage && (
        <Box mb="xl" className="overflow-hidden rounded-lg border border-solid border-[var(--mantine-color-default-border)]">
          <Image
            src={article.coverImage}
            alt={article.title}
            h={400}
            fit="cover"
            radius="md"
          />
        </Box>
      )}

      {/* Content */}
      <Box className="prose prose-neutral dark:prose-invert max-w-none">
        {article.content.split('\n\n').map((paragraph, i) => (
          <Text
            key={i}
            size="md"
            lh={1.9}
            mb="lg"
            className="text-[var(--mantine-color-text)]"
          >
            {paragraph}
          </Text>
        ))}
      </Box>

      <Divider mt="xl" mb="md" />

      {/* Footer meta */}
      <Divider mt="xl" mb="md" />
      <Text size="xs" c="dimmed">
        Last updated {formatDate(article.updatedAt)}
      </Text>

    </article>
  )
}