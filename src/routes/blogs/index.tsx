import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Pagination,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import {
  getPaginatedBlogsQueryOptions,
  searchBlogsQueryOptions,
} from "@/db/queries/blog.queries"
import { BookMarked, Heart, MessageCircle, PenLine, Search, X } from "lucide-react"
import { useState } from "react"
import classes from "../../css/article.module.css"
import moment from "moment"

export const Route = createFileRoute("/blogs/")({
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
      getPaginatedBlogsQueryOptions(deps.page, 6)
    )
  },
  component: BlogsPage,
})

const PAGE_SIZE = 6

function BlogsPage() {
  const navigate = useNavigate()
  const { page } = Route.useSearch()
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)
  const { data: session } = authClient.useSession()

  const hasSearch = debouncedSearch.trim().length > 0
  const isAuthenticated = !!session?.user

  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    isFetching: paginatedFetching,
    isPlaceholderData,
  } = useQuery({
    ...getPaginatedBlogsQueryOptions(page, PAGE_SIZE),
    placeholderData: (previousData) => previousData,
  })

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useQuery({
    ...searchBlogsQueryOptions(debouncedSearch, 1, PAGE_SIZE),
    enabled: hasSearch,
    placeholderData: (previousData) => previousData,
  })

  const data = hasSearch ? searchData ?? paginatedData : paginatedData
  const isLoading = hasSearch ? searchLoading : paginatedLoading
  const isFetching = hasSearch ? searchFetching : paginatedFetching

  const blogs = data?.blogs || paginatedData?.blogs || []
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="light" color="grape">
            Blog
          </Badge>
          <Title order={1}>Articles & Writing</Title>
          <Text c="dimmed" className="max-w-2xl">
            Thoughts, tutorials, and practical notes on building modern web applications.
          </Text>
        </div>

        {isAuthenticated && (
          <Group gap="sm" className="flex-shrink-0 self-end">
            <Link
              to="/blogs/$userId"
              search={{ page: 1 }}
              params={{ userId: session.user.id }}
              className="no-underline"
            >
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
                : `${pagination.total ?? 0} result${(pagination.total ?? 0) !== 1 ? "s" : ""
                } for "${debouncedSearch}"`}
            </Text>
          )}
        </div>
      </div>

      {!isLoading && blogs.length === 0 && (
        <div className="py-24 text-center">
          <Title order={3} c="dimmed">
            {hasSearch ? `No articles found for "${debouncedSearch}"` : "No articles yet"}
          </Title>

          {isAuthenticated && !hasSearch && (
            <Link to="/blogs/create" className="no-underline">
              <Button mt="lg" variant="light" color="grape" leftSection={<PenLine size={15} />}>
                Write the first article
              </Button>
            </Link>
          )}
        </div>
      )}

      <div
        className={`grid gap-8 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3 ${isPlaceholderData || isFetching ? "opacity-80" : "opacity-100"
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
                    <Avatar size={22} src={article.authorImage} alt={article.authorName!} radius="xl" />
                    <Text size="xs" fw={500}>
                      {article.authorName}
                    </Text>
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

      {!hasSearch && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={totalPages}
            color="green"
            variant="gradient"
            onChange={(p) => navigate({ to: "/blogs", search: { page: p } })}
          />
        </Group>
      )}
    </Container>
  )
}