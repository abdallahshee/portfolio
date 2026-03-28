import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  Avatar, Badge, Box, Button, Card, Container, Group,
  Image, Pagination, Skeleton, Stack, Text, TextInput, Title, ThemeIcon,
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
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)
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
    <Container size="xl" className="space-y-8 py-10">

      {/* Header */}
      <div className="space-y-2">
        <Badge variant="light" color="grape">Blog</Badge>
        <Title order={1}>Articles & Writing</Title>
        <Text c="dimmed" className="max-w-2xl">
          Thoughts, tutorials, and practical notes on building modern web applications.
        </Text>
      </div>

      {/* Search + Buttons row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
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
                <button type="button" onClick={() => handleSearchChange("")}>
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              ) : null
            }
            value={searchInput}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
          />
          {hasSearch && (
            <Text size="xs" c="dimmed" mt={4}>
              {isFetching
                ? "Searching…"
                : `${pagination.total ?? 0} result${(pagination.total ?? 0) !== 1 ? "s" : ""} for "${debouncedSearch}"`
              }
            </Text>
          )}
        </div>

        {isAuthenticated && (
          <Group gap="sm" className="flex-shrink-0 self-end">
            <Link
              to="/articles/$userId"
              search={{ page: 1 }}
              params={{ userId: session.user.id }}
              className="no-underline"
            >
              <Button variant="light" color="grape" radius="xl" leftSection={<BookMarked size={15} />}>
                My Articles
              </Button>
            </Link>
            <Link to="/articles/create" className="no-underline">
              <Button variant="filled" color="grape" radius="xl" leftSection={<PenLine size={15} />}>
                Write Article
              </Button>
            </Link>
          </Group>
        )}
      </div>

      {/* ✅ loading skeletons */}
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        // ✅ empty state
        <div className="flex justify-center py-24">
          <Stack align="center" gap="md">
            <ThemeIcon size={72} radius="xl" variant="light" color="grape">
              <BookOpen size={36} />
            </ThemeIcon>
            <Title order={3}>
              {hasSearch ? `No results for "${debouncedSearch}"` : "No articles yet"}
            </Title>
            <Text c="dimmed" ta="center" maw={400}>
              {hasSearch
                ? "Try a different search term or clear the search to browse all articles."
                : "No articles have been published yet. Check back soon."}
            </Text>
            {hasSearch ? (
              <Button variant="light" color="grape" onClick={() => handleSearchChange("")}>
                Clear Search
              </Button>
            ) : isAuthenticated ? (
              <Link to="/articles/create" className="no-underline">
                <Button variant="light" color="grape" leftSection={<PenLine size={15} />}>
                  Write the first article
                </Button>
              </Link>
            ) : null}
          </Stack>
        </div>
      ) : (
        // ✅ articles grid
        <div className={`grid gap-8 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 ${
          isPlaceholderData || isFetching ? "opacity-80" : "opacity-100"
        }`}>
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
                  style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "1rem" }}
                >
                  <Text tt="uppercase" opacity={0.6} fw={700} size="xs" c="grape" mb={4}>
                    {article.categoryName}
                  </Text>
                  <Text fw={600} size="sm" lineClamp={2} mb={6}>
                    {article.title}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={2} mb="auto">
                    {article.excerpt}
                  </Text>

                  <Group justify="space-between" align="center" mt={12}>
                    <Group gap={6}>
                      <Avatar size={22} src={article.authorImage} alt={article.authorName!} radius="xl" />
                      <Text size="xs" fw={500}>{article.authorName}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {moment(article.createdAt).format("MMM D, YYYY")}
                    </Text>
                  </Group>

                  <Group
                    gap="xs" mt={8} pt={8}
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