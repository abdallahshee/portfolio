// src/components/ArticleCard.tsx
import { Badge, Group, Text, Paper, Image, Box } from '@mantine/core'
import { Calendar, Folder,Star } from 'lucide-react'

type ArticleCardProps = {
  id: string
  title: string
  excerpt: string | null
  coverImage: string | null
  category: string
  featured: boolean
  updatedAt: Date
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function ArticleCard({
  id,
  title,
  excerpt,
  coverImage,
  category,
  featured,
  updatedAt,
}: ArticleCardProps) {
  return (
 
      <Paper
        withBorder
        radius="md"
        className="group overflow-hidden transition-shadow duration-200 hover:shadow-md cursor-pointer h-full flex flex-col"
      >
        {/* Cover Image */}
        <Box className="overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              h={180}
              fit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Box
              h={180}
              className="flex items-center justify-center bg-[var(--mantine-color-default-border)]"
            >
              <Text size="xs" c="dimmed">No cover image</Text>
            </Box>
          )}
        </Box>

        {/* Body */}
        <Box p="md" className="flex flex-col flex-1">
          {/* Badges */}
          <Group gap="xs" mb="sm">
            <Badge
              variant="light"
              color="teal"
              size="sm"
              leftSection={<Folder size={10} />}
              tt="capitalize"
            >
              {category}
            </Badge>
            {featured && (
              <Badge
                variant="light"
                color="yellow"
                size="sm"
                leftSection={<Star size={10} />}
              >
                Featured
              </Badge>
            )}
          </Group>

          {/* Title */}
          <div className="mb-1 h-0.5 w-6 rounded-full bg-[rgba(79,184,178,0.8)]" />
          <Text fw={700} size="md" lh={1.3} mb="xs" lineClamp={2}>
            {title}
          </Text>

          {/* Excerpt */}
          {excerpt && (
            <Text size="sm" c="dimmed" lh={1.6} lineClamp={3} className="flex-1">
              {excerpt}
            </Text>
          )}

          {/* Footer */}
          <Group gap={6} mt="md">
            <Calendar size={13} className="text-[rgba(79,184,178,0.9)]" />
            <Text size="xs" c="dimmed">
              {formatDate(updatedAt)}
            </Text>
          </Group>
        </Box>
      </Paper>

  )
}