import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  Button, Container, Group,
  Pagination, Stack, TextInput, ThemeIcon,
} from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import {
  getPaginatedArticlesQueryOptions,
  searchArticlesQueryOptions,
} from "@/db/queries/article.queries"
import { BookMarked, BookOpen, PenLine, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

import { ArticleCard } from "@/components/ArticleCard"
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton"

export const Route = createFileRoute("/articles/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page:
      typeof search.page === "number"
        ? search.page
        : typeof search.page === "string"
          ? Number(search.page)
          : 1,
  }),
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: async ({ context, deps }) => {
    await context.queryClient.prefetchQuery(
      getPaginatedArticlesQueryOptions(deps.page, 6)
    )
  },
  component: BlogsPage,
})

const PAGE_SIZE = 6



function BlogsPage() {
  const navigate = useNavigate()
  const { page } = Route.useSearch()
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch] = useDebouncedValue(searchInput, 200)
  const supabase = getSupabaseBrowserClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data?.session ?? null)
      setIsSessionLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const hasSearch = debouncedSearch.trim().length > 0
  const isAuthenticated = !!session?.user

  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    isFetching: paginatedFetching,
    isPlaceholderData,
  } = useQuery({
    ...getPaginatedArticlesQueryOptions(page, PAGE_SIZE),
    placeholderData: (previousData) => previousData,
  })

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useQuery({
    ...searchArticlesQueryOptions(debouncedSearch, 1, PAGE_SIZE),
    enabled: hasSearch,
    placeholderData: (previousData) => previousData,
  })

  const data = hasSearch ? searchData ?? paginatedData : paginatedData
  const isLoading = hasSearch ? searchLoading : paginatedLoading
  const isFetching = hasSearch ? searchFetching : paginatedFetching

  const rawBlogs = data?.articles ?? paginatedData?.articles
  const articles = Array.isArray(rawBlogs) ? rawBlogs : []

  const pagination = data?.pagination ?? paginatedData?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const totalPages = pagination.totalPages

  const handleSearchChange = (value: string) => setSearchInput(value)

  // ✅ card height bumped to 520 to accommodate tags row

  const GRID_MIN_HEIGHT = 1080

  return (
    <Container size="xl" className="max-w-full space-y-6 px-0 py-6 sm:space-y-8 sm:py-8 md:py-10">

      {/* Header */}
      <div className="space-y-2">
        <div className="heading">Articles & Writing</div>
        <p className="max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Thoughts, tutorials, and practical notes on building modern web applications.
        </p>
      </div>

      {/* Search + Buttons row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="w-full min-w-0 sm:flex-1" style={{ maxWidth: 400 }}>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Search
          </div>
          <TextInput
            size="sm"
            radius="md"
            placeholder="Search by title or category"
            leftSection={<Search size={16} />}
            rightSection={
              searchInput ? (
                <button type="button" onClick={() => handleSearchChange("")}>
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              ) : null
            }
            value={searchInput}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
          />
          {hasSearch && (
            <p className="mt-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              {isFetching
                ? "Searching…"
                : `${pagination.total ?? 0} result${(pagination.total ?? 0) !== 1 ? "s" : ""} for "${debouncedSearch}"`
              }
            </p>
          )}
        </div>

        {isAuthenticated && (
          <Group gap="sm" wrap="wrap" className="w-full shrink-0 sm:w-auto sm:self-end">
            <Link to="/articles/my-articles" search={{ page: 1 }} className="no-underline">
              <Button variant="filled" color="green" radius="md" leftSection={<BookMarked size={15} />}>
                My Articles
              </Button>
            </Link>
            <Link to="/articles/new" className="no-underline">
              <Button variant="filled" color="blue" radius="md" leftSection={<PenLine size={15} />}>
                Write Article
              </Button>
            </Link>
          </Group>
        )}
      </div>

      <div className="border-b border-blue-500" />

      {/* Content area — fixed min-height keeps layout stable */}
      <div style={{ minHeight: GRID_MIN_HEIGHT }}>
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          // <div
          //   className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700"
          //   style={{ minHeight: GRID_MIN_HEIGHT }}
          // >
          <div className="flex min-h-[320px] flex-col items-center justify-center px-4 pt-10 sm:min-h-[480px] sm:pt-16 md:min-h-[640px]">
            <Stack align="center" gap="md" maw={400}>
              <ThemeIcon size={72} radius="md" variant="light" color="blue">
                <BookOpen size={36} />
              </ThemeIcon>
              <div className="title2 text-center">
                {hasSearch ? `No results for "${debouncedSearch}"` : "No articles yet"}
              </div>
              <p className="max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
                {hasSearch
                  ? "Try a different search term or clear the search to browse all articles."
                  : "No articles have been published yet. Check back soon."}
              </p>
              {hasSearch && (
                <Button variant="filled" color="grape" radius="md" onClick={() => handleSearchChange("")}>
                  Clear Search
                </Button>
              )}
            </Stack>
          </div>
        ) : (
          <div
            className={`grid gap-8 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 ${isPlaceholderData || isFetching ? "opacity-80" : "opacity-100"
              }`}
          >
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
      {!isLoading && !hasSearch && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={totalPages}
            color="green"
            variant="gradient"
            onChange={(p) => navigate({ to: "/articles", search: { page: p } })}
          />
        </Group>
      )}
    </Container>
  )
}