import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
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
  Box,
  Text,
  TextInput,
  Title,
  SegmentedControl,
} from '@mantine/core'

import {
  getMyPaginatedBlogsQueryOptions,
  searchBlogsQueryOptions,
} from '@/db/queries/blog.queries'
import { BookMarked, Heart, MessageCircle, Search, X, ArrowRight, PenLine, Pencil, SlidersHorizontal } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import classes from "../../css/article.module.css"
import moment from 'moment'

export const Route = createFileRoute('/blogs/$userId')({
  validateSearch: (search: Record<string, unknown>) => ({
    page:
      typeof search.page === 'number'
        ? search.page
        : typeof search.page === 'string'
          ? Number(search.page)
          : 1,
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ context, params, deps }) => {
    await context.queryClient.prefetchQuery(
      getMyPaginatedBlogsQueryOptions(params.userId, deps.page, 6)
    )
  },
  component: BlogsPage,
})

const PAGE_SIZE = 6
type StatusFilter = 'all' | 'published' | 'pending' | 'draft'

function BlogsPage() {
  const navigate = useNavigate()
  const { userId } = Route.useParams()
  const { page } = Route.useSearch()
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const isSearching = debouncedSearch.trim().length > 0
  const isOwner = session?.user?.id === userId

  const { data: paginatedData, isLoading: paginatedLoading, isPlaceholderData } = useQuery(
    getMyPaginatedBlogsQueryOptions(userId, page, PAGE_SIZE)
  )

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...searchBlogsQueryOptions(debouncedSearch, 1, PAGE_SIZE),
    enabled: isSearching,
  })

  const data = isSearching ? searchData : paginatedData
  const isLoading = isSearching ? searchLoading : paginatedLoading

  // Filter client-side by status
  const allBlogs = data?.blogs ?? []
  const blogs = allBlogs.filter((blog: any) => {
    if (statusFilter === 'all') return true
    return blog.status === statusFilter
  })

  const pagination = (data as any)?.pagination ?? { page: 1, totalPages: 1, total: 0 }
  const totalPages = pagination.totalPages

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

  const statusConfig: Record<'published' | 'pending' | 'draft', { color: string; label: string }> = {
    published: { color: 'green', label: 'Published' },
    pending: { color: 'yellow', label: 'Pending' },
    draft: { color: 'gray', label: 'Draft' },
  }

  const getStatusConfig = (status: string) =>
    statusConfig[status as keyof typeof statusConfig] ?? { color: 'gray', label: status }

  return (
    <Container size="xl" className="space-y-8 py-10">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="filled" color="blue" onClick={() => router.navigate({ to: "/blogs", search: { page: 1 } })} >Back to All Articles</Button>
          <Title order={1}>
            {isOwner ? 'My Articles' : 'Articles & Writing'}
          </Title>
          <Text c="dimmed" className="max-w-2xl">
            {isOwner
              ? `You have written ${allBlogs.length} article${allBlogs.length !== 1 ? 's' : ''}.`
              : 'Thoughts, tutorials, and practical notes on building modern web applications.'}
          </Text>
        </div>

        {isOwner && (
          <Link to="/blogs/create" className="no-underline self-end">
            <Button variant="filled" color="grape" radius="xl" leftSection={<PenLine size={15} />}>
              Write Article
            </Button>
          </Link>
        )}
      </div>

      {/* Search + Filter toolbar */}
      <div className="flex flex-wrap items-end gap-4">

        {/* Search */}
        <div className="flex-1" style={{ minWidth: 220, maxWidth: 400 }}>
          <Text size="xs" fw={500} c="dimmed" mb={5} className="uppercase tracking-widest">
            Search
          </Text>
          <TextInput
            placeholder="Search by title, tag, or excerpt…"
            size="sm"
            radius="md"
            leftSection={<Search size={14} />}
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
          {isSearching && !isLoading && (
            <Text size="xs" c="dimmed" mt={4}>
              {blogs.length} result{blogs.length !== 1 ? 's' : ''} for &quot;{debouncedSearch}&quot;
            </Text>
          )}
        </div>

        {/* Divider */}
        <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        {/* Status filter */}
        <div>

          <div>
            <Group gap="xs" mb={5} align="center">
              <SlidersHorizontal size={12} className="text-slate-400" />
              <Text size="xs" fw={500} c="dimmed" className="uppercase tracking-widest">
                Filter by status
              </Text>
            </Group>
            <Group gap="xs">
              {(['all', 'published', 'pending', 'draft'] as const).map((status) => {
                const label = status === 'all' ? 'All'
                  : status === 'published' ? 'Published'
                    : status === 'pending' ? 'Pending'
                      : 'Draft'

                return (
                  <Badge
                    key={status}
                    variant={statusFilter === status ? 'filled' : 'light'}
                    color="blue"
                    radius="xl"
                    size="lg"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => setStatusFilter(status)}
                  >
                    {label}
                  </Badge>
                )
              })}
            </Group>
          </div>
        </div>
      </div>

      {/* Result count */}
      {!isLoading && blogs.length > 0 && (
        <Text size="sm" c="dimmed">
          Showing <strong>{blogs.length}</strong>
          {statusFilter !== 'all' ? ` ${getStatusConfig(statusFilter).label}` : ''} article{blogs.length !== 1 ? 's' : ''}
          {isSearching ? ` for "${debouncedSearch}"` : ''}
        </Text>
      )}

      {/* Empty state */}
      {!isLoading && blogs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-24 text-center dark:border-slate-700">
          <Title order={3} c="dimmed" mb="xs">
            {isSearching
              ? `No articles found for "${debouncedSearch}"`
              : statusFilter !== 'all'
                ? `No ${getStatusConfig(statusFilter).label.toLowerCase()} articles`
                : isOwner
                  ? "You haven't written any articles yet"
                  : 'No articles yet'}
          </Title>
          <Text size="sm" c="dimmed" mb="lg">
            {statusFilter !== 'all'
              ? 'Try a different status filter.'
              : isOwner
                ? 'Start writing your first article!'
                : ''}
          </Text>
          {(isSearching || statusFilter !== 'all') && (
            <Button
              variant="subtle"
              color="grape"
              onClick={() => { handleSearchChange(''); setStatusFilter('all') }}
            >
              Clear filters
            </Button>
          )}
          {isOwner && !isSearching && statusFilter === 'all' && (
            <Link to="/blogs/create" className="no-underline">
              <Button variant="light" color="grape" leftSection={<PenLine size={15} />}>
                Write your first article
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
        {blogs.map((article) => (
          <Link
            key={article.id}
            to="/blogs/$slug/details"
            params={{ slug: article.slug }}
            className="no-underline"
          >
            <Card
              withBorder
              radius="md"
              p={0}
              className={classes.card}
              style={{ width: "100%", height: 400, display: "flex", flexDirection: "column" }}
            >
              <Box style={{ height: 200, overflow: "hidden", flexShrink: 0 }}>
                <Image
                  src={article.coverImage!}
                  alt={article.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </Box>

              <div
                className={classes.body}
                style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "1rem" }}
              >
                <Text tt="uppercase" opacity={0.6} fw={700} size="xs" c="grape" mb={4}>
                  technology
                </Text>

                <Text fw={600} size="sm" lineClamp={2} mb={6}>
                  {article.title}
                </Text>

                <Text size="xs" c="dimmed" lineClamp={2} mb="auto">
                  {article.excerpt}
                </Text>

                <Group justify="space-between" align="center" mt={12}>
                  <Group gap={6}>
                    <Avatar size={22} src={article.authorImage} alt={article.title!} radius="xl" />

                  </Group>

                  <Text size="xs" c="dimmed">
                    {moment(article.createdAt).format("MMM D, YYYY")}
                  </Text>
                </Group>

                <Group
                  gap="xs"
                  mt={8}
                  pt={8}
                  style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
                >
                  <Group gap={4}>
                    <Heart size={13} opacity={0.5} />
                    <Text size="xs" c="dimmed">{article.likes}</Text>
                  </Group>

                  <Group gap={4}>
                    <MessageCircle size={13} opacity={0.5} />
                    <Text size="xs" c="dimmed">{article.comments}</Text>
                  </Group>
                </Group>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination — hide when filter or search is active */}
      {!isSearching && statusFilter === 'all' && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={totalPages}
            color="grape"
            onChange={(p) => navigate({ to: '/blogs/$userId', params: { userId }, search: { page: p } })}
          />
        </Group>
      )}
    </Container>
  )
}