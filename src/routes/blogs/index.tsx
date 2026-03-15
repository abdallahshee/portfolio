import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Avatar,
  Badge,
  Card,
  Container,
  Group,
  Image,
  Pagination,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Heart, MessageCircle, Search, X } from 'lucide-react'
import {
  getPaginatedBlogsQueryOptions,
  searchBlogsQueryOptions,
} from '@/queries/blog.queries'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'

export const Route = createFileRoute('/blogs/')({
  validateSearch: (search: Record<string, unknown>) => ({
    page:
      typeof search.page === 'number'
        ? search.page
        : typeof search.page === 'string'
          ? Number(search.page)
          : 1,
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ context, deps }) => {
    await context.queryClient.prefetchQuery(
      getPaginatedBlogsQueryOptions(deps.page, 6)
    )
  },
  component: BlogsPage,
})

const PAGE_SIZE = 6

function BlogsPage() {
  const navigate = useNavigate()
  const { page } = Route.useSearch()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)

  const isSearching = debouncedSearch.trim().length > 0

  const { data, isLoading, isPlaceholderData } = useQuery(
    isSearching
      ? searchBlogsQueryOptions(debouncedSearch, 1, PAGE_SIZE)
      : getPaginatedBlogsQueryOptions(page, PAGE_SIZE)
  )

  const blogs = (data as any)?.blogs ?? []
  const pagination = (data as any)?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const totalPages = isSearching
    ? (data as any)?.totalPages ?? 1
    : pagination.totalPages

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  return (
    <Container size="xl" className="space-y-10 py-12">

      {/* Header */}
      <div className="space-y-2">
        <Badge variant="light" color="grape">
          Blog
        </Badge>
        <Title order={1}>Articles & Writing</Title>
        <Text c="dimmed" className="max-w-2xl">
          Thoughts, tutorials, and practical notes on building modern web
          applications.
        </Text>
      </div>

      {/* Search bar */}
      <div className="max-w-lg">
        <TextInput
          placeholder="Search by title, tag, or excerpt…"
          size="md"
          radius="xl"
          leftSection={<Search size={16} />}
          rightSection={
            searchInput ? (
              <button onClick={() => handleSearchChange('')}>
                <X size={15} className="text-slate-400 hover:text-slate-600" />
              </button>
            ) : null
          }
          value={searchInput}
          onChange={(e) => handleSearchChange(e.currentTarget.value)}
        />
        {isSearching && (
          <Text size="xs" c="dimmed" mt="xs" ml="xs">
            {isLoading
              ? 'Searching…'
              : `${(data as any)?.total ?? 0} result${((data as any)?.total ?? 0) !== 1 ? 's' : ''} for "${debouncedSearch}"`}
          </Text>
        )}
      </div>

      {/* Empty state */}
      {!isLoading && blogs.length === 0 && (
        <div className="py-24 text-center">
          <Title order={3} c="dimmed">
            {isSearching
              ? `No articles found for "${debouncedSearch}"`
              : 'No articles yet'}
          </Title>
        </div>
      )}

      {/* Grid */}
      <div
        className={`grid gap-8 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 ${
          isPlaceholderData ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {blogs.map((blog: any) => (
          <Link
            key={blog.id}
            to="/blogs/$slug/details"
            params={{ slug: blog.slug }}
            className="no-underline"
          >
            <Card
              withBorder
              radius="xl"
              shadow="sm"
              className="max-h-[500px] overflow-y-auto transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Stack gap="md">
                <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      h={200}
                      radius="lg"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-[200px] rounded-lg bg-gray-100" />
                  )}
                </div>

                <div className="space-y-2">
                  <Title order={4} lineClamp={2}>
                    {blog.title}
                  </Title>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {blog.excerpt}
                  </Text>

                  {/* Tags — highlight matched tag when searching */}
                  {blog.tags?.length > 0 && (
                    <Group gap="xs" mt="xs">
                      {blog.tags.slice(0, 3).map((tag: string) => (
                        <Badge
                          key={tag}
                          size="xs"
                          variant="light"
                          color="grape"
                          radius="xl"
                          style={
                            isSearching &&
                            tag.toLowerCase().includes(debouncedSearch.toLowerCase())
                              ? { outline: '1.5px solid var(--mantine-color-grape-4)' }
                              : {}
                          }
                        >
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </div>

                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <Avatar
                      src={blog.authorImage || undefined}
                      alt={blog.title}
                      radius="xl"
                      size="sm"
                    />
                    <Text size="xs" c="dimmed">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Text>
                  </Group>

                  <Group gap="md">
                    <Group gap={4}>
                      <Heart size={15} />
                      <Text size="sm">{blog.likes}</Text>
                    </Group>
                    <Group gap={4}>
                      <MessageCircle size={15} />
                      <Text size="sm">{blog.comments}</Text>
                    </Group>
                  </Group>
                </Group>
              </Stack>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination — hide when searching */}
      {!isSearching && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={totalPages}
            onChange={(p) => navigate({ to: '/blogs', search: { page: p } })}
          />
        </Group>
      )}
    </Container>
  )
}