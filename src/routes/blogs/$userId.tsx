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
  Text,
  TextInput,
  Title,
  SegmentedControl,
} from '@mantine/core'
import { Heart, MessageCircle, Search, X, ArrowRight, PenLine, Pencil, SlidersHorizontal } from 'lucide-react'
import {
  getMyPaginatedBlogsQueryOptions,
  searchBlogsQueryOptions,
} from '@/db/queries/blog.queries'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

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
          <Button variant="filled" color="blue" onClick={() => router.history.back} >Back to All Articles</Button>
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
          <Group gap="xs" mb={5} align="center">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <Text size="xs" fw={500} c="dimmed" className="uppercase tracking-widest">
              Filter by status
            </Text>
          </Group>
          <SegmentedControl
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
            radius="md"
            size="sm"
            data={[
              { label: 'All', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'Pending', value: 'pending' },
              { label: 'Draft', value: 'draft' },
            ]}
          />
        </div>

        {/* Active filter pill */}
        {statusFilter !== 'all' && (
          <Badge
            variant="light"
            color={getStatusConfig(statusFilter).color}
            radius="md"
            size="lg"
            className="self-end mb-0.5"
            rightSection={
              <button onClick={() => setStatusFilter('all')}>
                <X size={11} />
              </button>
            }
          >
            {getStatusConfig(statusFilter).label}: {blogs.length}
          </Badge>
        )}
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
        {blogs.map((blog: any) => (
          <Card
            key={blog.id}
            withBorder
            radius="xl"
            shadow="sm"
            className="flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Stack gap="md">
              <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                {blog.coverImage ? (
                  <Image src={blog.coverImage} alt={blog.title} h={200} className="w-full object-cover" />
                ) : (
                  <div className="h-[200px] w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
                )}
              </div>

              <div className="space-y-2">
                {/* Title + status badge on same row */}
                <Group justify="space-between" align="flex-start" gap="xs">
                  <Title order={4} lineClamp={2} className="flex-1 leading-tight">
                    {blog.title}
                  </Title>
                  {blog.status && (
                    <Badge
                      size="sm"
                      radius="md"
                      variant="light"
                      color={getStatusConfig(blog.status).color}
                      className="flex-shrink-0"
                    >
                      {blog.status}
                    </Badge>
                  )}
                </Group>

                <Text size="sm" c="dimmed" lineClamp={3}>{blog.excerpt}</Text>

                {blog.tags?.length > 0 && (
                  <Group gap="xs" mt="xs">
                    {blog.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} size="xs" variant="light" color="grape" radius="xl">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                )}
              </div>

              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <Avatar src={blog.authorImage || undefined} alt={blog.title} radius="xl" size="sm" />
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

            <Group grow mt="md" gap="xs">
              <Link to="/blogs/$slug/details" params={{ slug: blog.slug }} className="no-underline">
                <Button fullWidth radius="xl" variant="light" color="grape" rightSection={<ArrowRight size={15} />}>
                  Read
                </Button>
              </Link>
              {isOwner && (
                <Link to="/blogs/$slug/edit" params={{ slug: blog.slug }} className="no-underline">
                  <Button fullWidth radius="xl" variant="outline" color="grape" leftSection={<Pencil size={14} />}>
                    Edit
                  </Button>
                </Link>
              )}
            </Group>
          </Card>
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