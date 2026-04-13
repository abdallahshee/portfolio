import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Badge,
  Button,
  Container,
  Group,
  Pagination,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core'
import {
  getMyPaginatedArticlesQueryOptions,
  searchArticlesQueryOptions,
} from '@/db/queries/article.queries'
import { BookOpen, Search, X, PenLine, SlidersHorizontal } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { ArticleCard } from '@/components/ArticleCard'
import ArticleCardSkeleton from '@/components/ArticleCardSkeleton'


export const Route = createFileRoute('/articles/my-articles')({
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
      getMyPaginatedArticlesQueryOptions({ page: deps.page, limit: 6 })
    )
  },
  component: BlogsPage,
})

const PAGE_SIZE = 6
const GRID_MIN_HEIGHT = 900
type StatusFilter = 'all' | 'published' | 'pending' | 'draft'

function BlogsPage() {
  const navigate = useNavigate()
  const { page } = Route.useSearch()
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [debouncedSearch] = useDebouncedValue(searchInput, 200)

  const isSearching = debouncedSearch.trim().length > 0

  const { data: paginatedData, isLoading: paginatedLoading, isPlaceholderData } = useQuery(
    getMyPaginatedArticlesQueryOptions({ page, limit: PAGE_SIZE })
  )

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...searchArticlesQueryOptions(debouncedSearch, 1, PAGE_SIZE),
    enabled: isSearching,
  })

  const data = isSearching ? searchData : paginatedData
  const isLoading = isSearching ? searchLoading : paginatedLoading

  const allArticles = (data?.articles ?? []).filter(Boolean)
  const articles = allArticles.filter((blog: any) => {
    if (statusFilter === 'all') return true
    return blog.status === statusFilter
  })

  const pagination = (data as any)?.pagination ?? { page: 1, totalPages: 1, total: 0 }
  const totalPages = pagination.totalPages

  const handleSearchChange = (value: string) => setSearchInput(value)

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
          <div className="heading">My Articles</div>
          <Text c="dimmed">
            You have written {allArticles.length} article{allArticles.length !== 1 ? 's' : ''}
          </Text>
        </div>
      </div>

      {/* Search + Filter toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-4">

        {/* Search */}
        <div className="flex-1" style={{ minWidth: 220, maxWidth: 400 }}>
          <Text size="sm" fw={500} c="dimmed" mb={5} className="uppercase tracking-widest">
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
              {articles.length} result{articles.length !== 1 ? 's' : ''} for &quot;{debouncedSearch}&quot;
            </Text>
          )}
        </div>

        {/* Filter pills + action buttons */}
        <div>
          <Group gap="xs" mb={5} align="center">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <Text size="xs" fw={500} c="dimmed" className="uppercase tracking-widest">
              Filter by status
            </Text>
          </Group>
          <Group gap="xs">
            {(['all', 'published', 'pending', 'draft'] as const).map((status) => {
              const label =
                status === 'all' ? 'All'
                  : status === 'published' ? 'Published'
                    : status === 'pending' ? 'Pending'
                      : 'Draft'
              return (
                <Badge
                  key={status}
                  variant={statusFilter === status ? 'filled' : 'light'}
                  color="blue"
                  radius="md"
                  size="sm"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => setStatusFilter(status)}
                >
                  {label}
                </Badge>
              )
            })}

            <Link to="/articles/create" className="no-underline">
              <Button size="sm" radius="md" variant="filled" color="green" leftSection={<PenLine size={14} />}>
                Write Article
              </Button>
            </Link>
            <Link to="/articles" search={{ page: 1 }}>
              <Button variant="filled" color="blue" size="sm" radius="md">
                Back to All Articles
              </Button>
            </Link>
          </Group>
        </div>
      </div>

      {/* Result count */}
      {!isLoading && articles.length > 0 && (
        <Text size="sm" c="dimmed">
          Showing <strong>{articles.length}</strong>
          {statusFilter !== 'all' ? ` ${getStatusConfig(statusFilter).label}` : ''} article{articles.length !== 1 ? 's' : ''}
          {isSearching ? ` for "${debouncedSearch}"` : ''}
        </Text>
      )}

      <div className="border-b border-blue-500" />

      {/* ✅ Fixed-height content area */}
      <div
        style={{ minHeight: GRID_MIN_HEIGHT }}
        className={`transition-opacity duration-200 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}
      >
        {isLoading ? (
          // ✅ Skeleton grid while loading
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>

        ) : articles.length === 0 ? (
          // ✅ Empty state — single, clean, no duplication
          <div
            className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700"
            style={{ minHeight: GRID_MIN_HEIGHT }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <ThemeIcon size={72} radius="md" variant="light" color="grape">
                <BookOpen size={36} />
              </ThemeIcon>
              <div className="title2">
                {isSearching
                  ? `No articles found for "${debouncedSearch}"`
                  : statusFilter !== 'all'
                    ? `No ${getStatusConfig(statusFilter).label.toLowerCase()} articles`
                    : "You haven't written any articles yet"}
              </div>
              <Text c="dimmed" maw={400}>
                {statusFilter !== 'all'
                  ? 'Try another filter or clear filters to see all your articles.'
                  : 'Start writing your first article!'}
              </Text>
              {(isSearching || statusFilter !== 'all') && (
                <Button
                  variant="subtle"
                  size="sm"
                  radius="md"
                  color="grape"
                  onClick={() => { handleSearchChange(''); setStatusFilter('all') }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>

        ) : (
          // ✅ Articles grid
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to="/articles/$slug"
                params={{ slug: article.slug }}
                className="no-underline"
              >
                <ArticleCard article={article} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isSearching && statusFilter === 'all' && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={totalPages}
            color="grape"
            onChange={(p) => navigate({ to: '/articles/my-articles', search: { page: p } })}
          />
        </Group>
      )}
    </Container>
  )
}