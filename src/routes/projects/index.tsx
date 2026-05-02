import { getPaginatedProjectsQueryOptions, searchProjectsQueryOptions } from '@/db/queries/project.queries'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  Button,
  Group,
  Stack,
  Badge,
  Container,
  Pagination,
  TextInput,
  Skeleton,
  ThemeIcon,
} from '@mantine/core'
import { Search, X, FolderOpen, ListFilter, FolderPlus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { ProjectCard } from '@/components/ProjectCard'
import type { Project } from '@/db/validations/project.types'

const PAGE_SIZE = 6

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getPaginatedProjectsQueryOptions(1, PAGE_SIZE))
  },
  component: RouteComponent,
})

type FilterValue = 'all' | 'public' | 'private'

// ── SKELETON ──
function ProjectsGridSkeleton() {
  return (
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
  )
}

// ── PROJECTS GRID ──
function ProjectsGrid({
  page,
  debouncedSearch,
  filter,
  isSearching,
  onSearchChange,
  onFilterChange,
}: {
  page: number
  debouncedSearch: string
  filter: FilterValue
  isSearching: boolean
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
}) {
  const { data } = useSuspenseQuery(
    isSearching
      ? searchProjectsQueryOptions(debouncedSearch, page, PAGE_SIZE)
      : getPaginatedProjectsQueryOptions(page, PAGE_SIZE)
  )

  const allProjects = data?.projects ?? []

  const projects = allProjects.filter((project: Project) => {
    if (filter === 'public') return project.isPublic === true
    if (filter === 'private') return project.isPublic === false
    return true
  })

  if (projects.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-4 pt-10 sm:min-h-[480px] sm:pt-16 md:min-h-[640px]">
        <ThemeIcon size={72} radius="md" variant="light" color="indigo">
          <FolderOpen size={36} />
        </ThemeIcon>
        <div className="title2 text-center">No projects found</div>
        {isSearching ? (
          <>
            <p className="max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
              No projects matched <strong>&quot;{debouncedSearch}&quot;</strong>. Try a different
              search term or clear the search.
            </p>
            <Button variant="light" color="indigo" onClick={() => onSearchChange('')}>
              Clear Search
            </Button>
          </>
        ) : filter !== 'all' ? (
          <>
            <p className="mx-auto max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
              No {filter === 'public' ? 'open source' : 'private'} projects found.
            </p>
            <Button variant="light" color="indigo" onClick={() => onFilterChange('all')}>
              Show All Projects
            </Button>
          </>
        ) : (
          <p className="mx-auto max-w-md px-2 text-center text-sm text-slate-600 sm:text-base dark:text-slate-400">
            No projects have been added yet.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <Link key={project.id} to="/projects/$slug/details" params={{ slug: project.slug! }}>
          <ProjectCard project={project} />
        </Link>
      ))}
    </div>
  )
}

// ── ROUTE COMPONENT ──
function RouteComponent() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')
  const [debouncedSearch] = useDebouncedValue(searchInput, 200)
  const { isAdmin } = Route.useRouteContext()
  const isSearching = debouncedSearch.trim().length > 0

  const { data, isFetching } = useQuery(
    isSearching
      ? searchProjectsQueryOptions(debouncedSearch, page, PAGE_SIZE)
      : getPaginatedProjectsQueryOptions(page, PAGE_SIZE)
  )

  const totalPages = data?.totalPages ?? 1

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

  return (
    <div className="max-w-full space-y-6 px-0 py-6 sm:space-y-8 sm:py-8 md:py-10">
      {/* ── PAGE HEADER ── */}
      <div className="mb-6 w-full sm:mb-10">
        <div className="heading">Real Projects, Real Software</div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7 dark:text-slate-400">
          A selection of applications and platforms brought to life from initial concept
          to final delivery. Each project highlights my approach to creating dependable,
          well-structured systems that are built to scale and easy to use.
        </p>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        {/* Left Side */}
        <div className="w-full min-w-0 sm:flex-1" style={{ maxWidth: 420 }}>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Search
          </div>

          <TextInput
            placeholder="Search by title or description…"
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

        {/* Right Side */}
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:items-end">
          {/* Create Project Button */}
          {isAdmin &&
            <Button
              component={Link}
              to="/projects/new"
              radius="md"
              size="sm"
              leftSection={<FolderPlus size={16} />}
              className="w-full sm:w-auto"
            >
              Create Project
            </Button>
          }
          {/* Filters */}
          <div className="w-full shrink-0 sm:w-auto">
            <Group gap="xs" mb={5} align="center" wrap="wrap">
              <ListFilter size={12} className="text-slate-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm dark:text-slate-400">
                Filter by status
              </span>
            </Group>

            <Group gap="xs">
              {(['all', 'public', 'private'] as const).map((value) => {
                const label =
                  value === 'all'
                    ? 'All'
                    : value === 'public'
                      ? 'Open Source'
                      : 'Private'

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
      </div>

      <div className="mb-12 border-b border-blue-500" />

      {/* ── RESULT COUNT ── */}
      {data && data.projects.length > 0 && (
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Showing {data.projects.length}{' '}
          {filter === 'public' ? 'open source' : filter === 'private' ? 'private' : ''}{' '}
          {data.projects.length === 1 ? 'project' : 'projects'}
        </p>
      )}

      {/* ── PROJECTS GRID ── */}
      <div className={`min-h-[420px] transition-opacity duration-200 sm:min-h-[560px] md:min-h-[720px] lg:min-h-[900px] ${isFetching ? 'opacity-80' : 'opacity-100'}`}>
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsGrid
            page={page}
            debouncedSearch={debouncedSearch}
            filter={filter}
            isSearching={isSearching}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </Suspense>
      </div>

      {/* ── PAGINATION ── */}
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
    </div>
  )
}