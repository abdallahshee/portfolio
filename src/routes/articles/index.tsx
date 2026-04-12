import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  Avatar, Box, Button, Card, Container, Group,
  Image, Pagination, Skeleton, Stack, TextInput, ThemeIcon,
} from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import {
  getPaginatedArticlesQueryOptions,
  searchArticlesQueryOptions,
} from "@/db/queries/article.queries"
import { BookMarked, BookOpen, Heart, MessageCircle, PenLine, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import classes from "../../css/article.module.css"
import moment from "moment"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"


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

// ✅ skeleton card for loading state
function ArticleCardSkeleton() {
  return (
    <Card withBorder radius="md" p={0} style={{ width: "100%", height: 400, display: "flex", flexDirection: "column" }}>
      <Skeleton height={200} radius={0} />
      <Stack p="md" gap="sm" style={{ flex: 1 }}>
        <Skeleton height={12} width="30%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="90%" mt="auto" />
        <Skeleton height={12} width="70%" />
        <Group justify="space-between" mt="xs">
          <Group gap={6}>
            <Skeleton height={22} width={22} radius="xl" />
            <Skeleton height={12} width={80} />
          </Group>
          <Skeleton height={12} width={60} />
        </Group>
      </Stack>
    </Card>
  )
}

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

  const rawBlogs = data?.blogs ?? paginatedData?.blogs
  const blogs = Array.isArray(rawBlogs) ? rawBlogs : []

  const pagination = data?.pagination ?? paginatedData?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const totalPages = pagination.totalPages

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }

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
            placeholder="Search by title, tag, or excerpt…"
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
            <Link
              to="/articles/my-articles"
              search={{ page: 1 }}
              className="no-underline"
            >
              <Button variant="filled" color="green" radius="md" leftSection={<BookMarked size={15} />}>
                My Articles
              </Button>
            </Link>
            <Link to="/articles/create" className="no-underline">
              <Button variant="filled" color="blue" radius="md" leftSection={<PenLine size={15} />}>
                Write Article
              </Button>
            </Link>
          </Group>
        )}
      </div>
      <div className="mb-12 border-b border-blue-500" />
      {/* ✅ loading skeletons */}
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        // ✅ empty state
        <div className="flex justify-center px-4 py-16 sm:py-24">
          <Stack align="center" gap="md">
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
        // ✅ articles grid
        <div
          className={`min-h-[420px] transition-opacity duration-200 sm:min-h-[560px] md:min-h-[720px] lg:min-h-[900px] ${isPlaceholderData || isFetching ? "opacity-80" : "opacity-100"
            }`}
        >
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center px-4 sm:min-h-[480px] md:min-h-[640px]">
              <Stack align="center" gap="md">
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
                  <Button
                    variant="filled"
                    color="grape"
                    radius="md"
                    onClick={() => handleSearchChange("")}
                  >
                    Clear Search
                  </Button>
                )}
              </Stack>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((article) => (
                <Link
                  key={article.id}
                  to="/articles/$slug"
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
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        padding: "1rem",
                      }}
                    >
                      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-pink-600/80 dark:text-pink-300/80">
                        {article.categoryName}
                      </div>

                      <div className="mb-3 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {article.title}
                      </div>

                      <p className="mb-auto line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {article.excerpt}
                      </p>

                      <Group justify="space-between" align="center" wrap="nowrap" gap="xs" mt={12} className="min-w-0">
                        <Group gap={6} wrap="nowrap" className="min-w-0">
                          <Avatar size={22} src={article.authorImage} alt={article.authorName!} radius="xl" className="shrink-0" />
                          <span className="min-w-0 truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                            {article.authorName}
                          </span>
                        </Group>
                        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                          {moment(article.createdAt).format("MMM D, YYYY")}
                        </span>
                      </Group>

                      <Group
                        gap="xs"
                        mt={8}
                        pt={8}
                        style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
                      >
                        <Group gap={4}>
                          <Heart size={13} opacity={0.5} />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {article.likes}
                          </span>
                        </Group>
                        <Group gap={4}>
                          <MessageCircle size={13} opacity={0.5} />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {article.comments}
                          </span>
                        </Group>
                      </Group>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

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