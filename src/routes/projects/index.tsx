import { getAllProjectsQueryOptions, searchProjectsQueryOptions } from '@/db/queries/project.queries'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
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
    <Container size="xl" className="max-w-full space-y-6 px-0 py-6 sm:space-y-8 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-6 max-w-2xl sm:mb-10">
        <div className="heading">
          Built for Real-World Use
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7 dark:text-slate-400">
          A selection of applications and platforms brought to life from initial concept
          to final delivery. Each project highlights my approach to creating dependable,
          well-structured systems that are built to scale and easy to use.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="w-full min-w-0 sm:flex-1" style={{ maxWidth: 420 }}>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Search
          </div>
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
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {isFetching
                ? 'Searching…'
                : `${data?.total ?? 0} result${(data?.total ?? 0) !== 1 ? 's' : ''} for "${debouncedSearch}"`}
            </p>
          )}
        </div>

        <div className="w-full shrink-0 sm:w-auto">
          <Group gap="xs" mb={5} align="center" wrap="wrap">
            <ListFilter size={12} className="text-slate-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm dark:text-slate-400">
              Filter by status
            </span>
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
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Showing {projects.length}{' '}
          {filter === 'public' ? 'open source' : filter === 'private' ? 'private' : ''}{' '}
          {projects.length === 1 ? 'project' : 'projects'}
        </p>
      )}

      {/* Projects Section */}
      <div
        className={`min-h-[420px] transition-opacity duration-200 sm:min-h-[560px] md:min-h-[720px] lg:min-h-[900px] ${
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
          <div className="flex min-h-[320px] flex-col items-center justify-center px-4 pt-10 sm:min-h-[480px] sm:pt-16 md:min-h-[640px]">
            <ThemeIcon size={72} radius="md" variant="light" color="indigo">
              <FolderOpen size={36} />
            </ThemeIcon>

            <div className="title2 mt-4">No projects found</div>

            {isSearching ? (
              <>
                <p className="mx-auto max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
                  No projects matched <strong>&quot;{debouncedSearch}&quot;</strong>. Try a different
                  search term or clear the search.
                </p>
                <Button variant="light" color="indigo" onClick={() => handleSearchChange('')}>
                  Clear Search
                </Button>
              </>
            ) : filter !== 'all' ? (
              <>
                <p className="mx-auto max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
                  No {filter === 'public' ? 'open source' : 'private'} projects found.
                </p>
                <Button variant="light" color="indigo" onClick={() => handleFilterChange('all')}>
                  Show All Projects
                </Button>
              </>
            ) : (
              <p className="mx-auto max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
                No projects have been added yet.
              </p>
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
                className="flex h-full min-w-0 cursor-pointer flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Stack gap="sm" className="min-w-0">
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
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {project.averageRating > 0
                        ? `${project.averageRating} (${project.totalRatings})`
                        : 'No ratings yet'}
                    </span>
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

                  <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                    {project.description}
                  </p>

                  <Stack gap="xs" mt="xs">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Technologies
                    </div>
                    {/* <Group gap="xs">
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
                    </Group> */}
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