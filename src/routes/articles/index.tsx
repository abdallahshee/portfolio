// src/routes/articles/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Title,
  Text,
  SimpleGrid,
  Pagination,
  Center,
  Loader,
  Box,
  Group,
  Select,
} from '@mantine/core'
import { useState } from 'react'
import { ArticleCard } from '@/components/ArticleCard'
import { SupportedArticleCategories } from '@/db/utils'

export const Route = createFileRoute('/articles/')({
  component: RouteComponent,
})

const ARTICLES_PER_PAGE = 6

type ArticleSummary = {
  id: string
  title: string
  slug:string
  excerpt: string | null
  coverImage: string | null
  category: string
  featured: boolean
  updatedAt: Date
}

// Replace with your actual fetch / query
const MOCK_ARTICLES: ArticleSummary[] = Array.from({ length: 20 }, (_, i) => ({
  id: `article-${i + 1}`,
  slug:"gtrdfer",
  title: `Article Number ${i + 1}: Building Great Things`,
  excerpt: 'A short summary of what this article is about, giving the reader enough context to decide if they want to read more.',
  coverImage: i % 3 === 0 ? null : `https://placehold.co/1200x630?text=Article+${i + 1}`,
  category: SupportedArticleCategories[i % SupportedArticleCategories.length],
  featured: i % 5 === 0,
  updatedAt: new Date(Date.now() - i * 86400000 * 3),
}))

const categoryFilterOptions = [
  { value: 'all', label: 'All Categories' },
  ...SupportedArticleCategories.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  })),
]

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const isLoading = false // replace with query loading state

  const filtered = MOCK_ARTICLES.filter((a) =>
    categoryFilter === 'all' ? true : a.category === categoryFilter
  )

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const paginated = filtered.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  )

  const handleCategoryChange = (value: string | null) => {
    setCategoryFilter(value ?? 'all')
    setPage(1) // reset to first page on filter change
  }

  if (isLoading) {
    return (
      <Center className="min-h-[60vh]">
        <Loader color="teal" />
      </Center>
    )
  }

  return (
    <div className="mx-auto max- py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 h-1 w-10 rounded-full bg-[rgba(79,184,178,0.8)]" />
        <Title order={1} fw={700} fz="2rem">
          Articles
        </Title>
        <Text c="dimmed" mt={6} size="sm">
          Thoughts, tutorials, and opinions on things I care about.
        </Text>
      </div>

      {/* Filters */}
      <Group justify="flex-end" mb="xl">
        <Select
          placeholder="All Categories"
          data={categoryFilterOptions}
          value={categoryFilter}
          onChange={handleCategoryChange}
          size="sm"
          w={180}
          clearable={false}
        />
      </Group>

      {/* Grid */}
      {paginated.length > 0 ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing="lg"
          mb="xl"
        >
          {paginated.map((article) => (
            <Link to='/articles/$slug/details' params={{slug:article.slug}}>
            <ArticleCard key={article.id} {...article} />
            </Link>
          ))}
        </SimpleGrid>
      ) : (
        <Center className="min-h-[30vh]">
          <Box ta="center">
            <Text fw={500} mb={4}>No articles found</Text>
            <Text size="sm" c="dimmed">Try a different category filter.</Text>
          </Box>
        </Center>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Center mt="xl">
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            color="teal"
            radius="md"
          />
        </Center>
      )}

    </div>
  )
}