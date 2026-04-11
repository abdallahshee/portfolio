import { getAllProjectsQueryOptions, searchProjectsQueryOptions } from '@/db/queries/project.queries'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  Text,
  Button,
  Image,
  Group,
  Stack,
  Badge,
  Container,
  Rating,
  Pagination,
  TextInput,
  Skeleton,
  ThemeIcon,
} from '@mantine/core'
import { Search, X, FolderKanban, ListFilter, FolderOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

const PAGE_SIZE = 6

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllProjectsQueryOptions(1, PAGE_SIZE))
  },
  component: RouteComponent,
})

type FilterValue = 'all' | 'public' | 'private'

function RouteComponent() {
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

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')
  const [debouncedSearch] = useDebouncedValue(searchInput, 200)

  const isSearching = debouncedSearch.trim().length > 0

  const { data, isLoading, isFetching, isPlaceholderData } = useQuery(
    isSearching
      ? searchProjectsQueryOptions(debouncedSearch, page, PAGE_SIZE)
      : getAllProjectsQueryOptions(page, PAGE_SIZE)
  )

  const allProjects = data?.projects ?? []
  const totalPages = data?.totalPages ?? 1

  const projects = allProjects.filter((project) => {
    if (filter === 'public') return project.isPublic === true
    if (filter === 'private') return project.isPublic === false
    return true
  })

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value as FilterValue)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showSkeleton = isLoading || (isFetching && !isPlaceholderData)

  return (
    <Container size="xl" className="space-y-8 py-10">
      {/* Page Header */}
      <div className="mb-10 max-w-2xl">
        <div className="heading">
          Built for Real-World Use
        </div>
        <Text size="lg" c="dimmed">
          A selection of applications and platforms brought to life from initial concept
          to final delivery. Each project highlights my approach to creating dependable,
          well-structured systems that are built to scale and easy to use.
        </Text>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1" style={{ minWidth: 240, maxWidth: 420 }}>
          <Text size="sm" fw={500} c="dimmed" mb={5} className="uppercase tracking-widest">
            Search
          </Text>
          <TextInput
            placeholder="Search by title, technology, or description…"
            size="sm"
            radius="md"
            leftSection={<Search size={14} />}
            rightSection={
              searchInput ? (
                <button type="button" onClick={() => handleSearchChange('')}>
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              ) : null
            }
            value={searchInput}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
          />
          {isSearching && (
            <Text size="xs" c="dimmed" mt={4}>
              {isFetching
                ? 'Searching…'
                : `${data?.total ?? 0} result${(data?.total ?? 0) !== 1 ? 's' : ''} for "${debouncedSearch}"`}
            </Text>
          )}
        </div>

        <div>
          <Group gap="xs" mb={5} align="center">
            <ListFilter size={12} className="text-slate-400" />
            <Text size="sm" fw={500} c="dimmed" className="uppercase tracking-widest">
              Filter by status
            </Text>
          </Group>

          <Group gap="xs">
            {(['all', 'public', 'private'] as const).map((value) => {
              const label = value === 'all' ? 'All' : value === 'public' ? 'Open Source' : 'Private'
              const isActive = filter === value

              return (
                <Badge
                  key={value}
                  variant={isActive ? 'filled' : 'light'}
                  color="blue"
                  radius="md"
                  size="md"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleFilterChange(value)}
                >
                  {label}
                </Badge>
              )
            })}
          </Group>
        </div>
      </div>

      <div className="mb-12 border-b border-blue-500" />

      {/* Result count */}
      {!showSkeleton && projects.length > 0 && (
        <Text size="sm" c="dimmed" mb="md">
          Showing {projects.length}{' '}
          {filter === 'public' ? 'open source' : filter === 'private' ? 'private' : ''}{' '}
          {projects.length === 1 ? 'project' : 'projects'}
        </Text>
      )}

      {/* Projects Section */}
      <div
        className={`min-h-[900px] transition-opacity duration-200 ${
          isPlaceholderData || isFetching ? 'opacity-80' : 'opacity-100'
        }`}
      >
        {showSkeleton ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Card key={i} shadow="sm" padding="lg" radius="lg" withBorder>
                <Stack gap="sm">
                  <Skeleton height={180} radius="md" />
                  <Skeleton height={20} width="60%" radius="md" />
                  <Skeleton height={16} width="40%" radius="md" />
                  <Skeleton height={16} radius="md" />
                  <Skeleton height={16} width="80%" radius="md" />
                  <Skeleton height={36} mt="md" radius="xl" />
                </Stack>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex min-h-[900px] flex-col items-center justify-center pt-16">
            <ThemeIcon size={72} radius="md" variant="light" color="indigo">
              <FolderOpen size={36} />
            </ThemeIcon>

            <div className="title2 mt-4">No projects found</div>

            {isSearching ? (
              <>
                <Text c="dimmed" ta="center" maw={400}>
                  No projects matched <strong>&quot;{debouncedSearch}&quot;</strong>. Try a different
                  search term or clear the search.
                </Text>
                <Button variant="light" color="indigo" onClick={() => handleSearchChange('')}>
                  Clear Search
                </Button>
              </>
            ) : filter !== 'all' ? (
              <>
                <Text c="dimmed" ta="center" maw={400}>
                  No {filter === 'public' ? 'open source' : 'private'} projects found.
                </Text>
                <Button variant="light" color="indigo" onClick={() => handleFilterChange('all')}>
                  Show All Projects
                </Button>
              </>
            ) : (
              <Text c="dimmed" ta="center" maw={400}>
                No projects have been added yet.
              </Text>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                className="flex h-full cursor-pointer flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Stack gap="sm">
                  <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        height={180}
                        fit="cover"
                        className="h-full w-full transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <ThemeIcon size={56} radius="md" variant="light" color="gray">
                        <FolderKanban size={28} />
                      </ThemeIcon>
                    )}
                  </div>

                  <div className="title3">{project.title}</div>

                  <Group gap="xs">
                    <Rating value={project.averageRating} fractions={2} readOnly size="sm" />
                    <Text size="xs" c="dimmed">
                      {project.averageRating > 0
                        ? `${project.averageRating} (${project.totalRatings})`
                        : 'No ratings yet'}
                    </Text>
                  </Group>

                  <Group gap="sm">
                    <Badge
                      color={project.isPublic ? 'blue' : 'green'}
                      variant="light"
                      size="sm"
                      radius="md"
                      className="w-fit"
                    >
                      {project.isPublic ? 'Open Source' : 'Private Project'}
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {project.description}
                  </Text>

                  <Stack gap="xs" mt="xs">
                    <Text size="sm" fw={500}>
                      Technologies
                    </Text>
                    <Group gap="xs">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          size="sm"
                          variant="light"
                          color="indigo"
                          radius="md"
                          style={
                            isSearching &&
                            tech.toLowerCase().includes(debouncedSearch.toLowerCase())
                              ? { outline: '1.5px solid var(--mantine-color-indigo-4)' }
                              : {}
                          }
                        >
                          {tech}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Stack>

                <Stack mt="md" gap="xs">
                  <Link to="/projects/$id" params={{ id: project.id }} className="no-underline">
                    <Button
                      radius="md"
                      leftSection={<FolderKanban size={16} />}
                      variant="gradient"
                      fullWidth
                      color="blue"
                    >
                      View Project Details
                    </Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isFetching && !isSearching && filter === 'all' && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={page}
            variant="gradient"
            color="green"
            onChange={handlePageChange}
            total={totalPages}
            radius="md"
            withEdges
          />
        </Group>
      )}
    </Container>
  )
}