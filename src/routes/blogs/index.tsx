import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Avatar,
  Badge,
  Button,
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
import { Heart, MessageCircle, Search, X, ArrowRight, PenLine, BookMarked } from 'lucide-react'
import {
  getPaginatedBlogsQueryOptions,
  searchBlogsQueryOptions,
} from '@/queries/blog.queries'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

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
  const { data: session } = authClient.useSession()

  const isSearching = debouncedSearch.trim().length > 0
  const isAuthenticated = !!session?.user

  const { data: paginatedData, isLoading: paginatedLoading, isPlaceholderData } = useQuery(
    getPaginatedBlogsQueryOptions(page, PAGE_SIZE)
  )

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...searchBlogsQueryOptions(debouncedSearch, 1, PAGE_SIZE),
    enabled: isSearching,
  })

  const data = isSearching ? searchData : paginatedData
  const isLoading = isSearching ? searchLoading : paginatedLoading
  const blogs = data?.blogs ?? []
  const pagination = data?.pagination ?? { page: 1, totalPages: 1, total: 0 }
  const totalPages = pagination.totalPages

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  return (
    <Container size="xl" className="space-y-8 py-10">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="light" color="grape">Blog</Badge>
          <Title order={1}>Articles & Writing</Title>
          <Text c="dimmed" className="max-w-2xl">
            Thoughts, tutorials, and practical notes on building modern web applications.
          </Text>
        </div>

        {/* Auth action buttons */}
        {isAuthenticated && (
          <Group gap="sm" className="flex-shrink-0 self-end">
            <Link to="/blogs/$userId" search={{ page: 1 }} params={{ userId: session.user.id }} className="no-underline">
              <Button
                variant="light"
                color="grape"
                radius="xl"
                leftSection={<BookMarked size={15} />}
              >
                My Articles
              </Button>
            </Link>
            <Link to="/blogs/create" className="no-underline">
              <Button
                variant="filled"
                color="grape"
                radius="xl"
                leftSection={<PenLine size={15} />}
              >
                Write Article
              </Button>
            </Link>
          </Group>
        )}
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap items-end gap-4">


        <div className="flex-1" style={{ minWidth: 220, maxWidth: 400 }}>
          <Text size="xs" fw={500} c="dimmed" mb={5} className="uppercase tracking-widest">
            Search
          </Text>
          <TextInput
            size="sm"
            radius="md"
            placeholder="Search by title, tag, or excerpt…"

            leftSection={<Search size={16} />}
            rightSection={
              searchInput ? (
                <button onClick={() => handleSearchChange('')}>
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              ) : null
            }
            value={searchInput}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
          />
          {isSearching && (
            <Text size="xs" c="dimmed" mt={4}>
              {isLoading
                ? 'Searching…'
                : `${(data as any)?.total ?? 0} result${((data as any)?.total ?? 0) !== 1 ? 's' : ''} for "${debouncedSearch}"`}
            </Text>
          )}
        </div>
      </div>
      {/* Empty state */}
      {!isLoading && blogs.length === 0 && (
        <div className="py-24 text-center">
          <Title order={3} c="dimmed">
            {isSearching ? `No articles found for "${debouncedSearch}"` : 'No articles yet'}
          </Title>
          {isAuthenticated && !isSearching && (
            <Link to="/blogs/create" className="no-underline">
              <Button mt="lg" variant="light" color="grape" leftSection={<PenLine size={15} />}>
                Write the first article
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Grid */}
      <div
        className={`grid gap-8 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 ${isPlaceholderData ? 'opacity-60' : 'opacity-100'
          }`}
      >
        {blogs.map((blog: any) => (
          <Card
            key={blog.id}
            withBorder
            radius="xl"
            shadow="sm"
            className="flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Stack gap="md">
              {/* Cover image */}
              <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-sm bg-gray-100">
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    h={200}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="h-[200px] w-full rounded-sm bg-slate-100 dark:bg-slate-800" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Title order={4} lineClamp={2}>
                  {blog.title}
                </Title>

                <Text size="sm" c="dimmed" lineClamp={3}>
                  {blog.excerpt}
                </Text>

                {/* Tags */}
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

              {/* Author + stats */}
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

            {/* Read button */}
            <Link
              to="/blogs/$slug/details"
              params={{ slug: blog.slug }}
              className="no-underline"
            >
              <Button
                fullWidth
                mt="md"
                radius="xl"
                variant="gradient"
                color="blue"
                rightSection={<ArrowRight size={15} />}
              >
                Read Article
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!isSearching && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={totalPages}
            color="green"
            onChange={(p) => navigate({ to: '/blogs', search: { page: p } })}
          />
        </Group>
      )}
    </Container>
  )
}