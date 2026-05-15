import {
  getPaginatedProjectsQueryOptions,
  searchProjectsQueryOptions,
} from '@/db/queries/project.queries'

import { ProjectCard } from '@/components/ProjectCard'
import type { Project } from '@/db/validations/project.types'

import { createFileRoute, Link } from '@tanstack/react-router'

import {
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Skeleton,
  TextInput,
} from '@mantine/core'

import { useDebouncedValue } from '@mantine/hooks'

import {
  FolderPlus,
  LayoutGrid,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

import {
  Suspense,
  useMemo,
  useState,
} from 'react'

import {
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'

const PAGE_SIZE = 6

type FilterValue = 'all' | 'featured'

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      getPaginatedProjectsQueryOptions(1, PAGE_SIZE)
    )
  },
  component: ProjectsPage,
})

// ─────────────────────────────────────────────
// FILTER OPTIONS
// ─────────────────────────────────────────────
const FILTER_OPTIONS = [
  { label: 'All', value: 'all', icon: LayoutGrid },
  { label: 'Featured', value: 'featured', icon: Star },
]

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} radius="xl" padding="md" withBorder>
          <Skeleton height={200} radius="lg" />
          <Skeleton height={24} width="60%" />
          <Skeleton height={14} />
        </Card>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// GRID
// ─────────────────────────────────────────────
function ProjectsGrid({
  page,
  search,
  filter,
  isSearching,
}: {
  page: number
  search: string
  filter: FilterValue
  isSearching: boolean
}) {
  const { data } = useSuspenseQuery(
    isSearching
      ? searchProjectsQueryOptions(search, page, PAGE_SIZE)
      : getPaginatedProjectsQueryOptions(page, PAGE_SIZE)
  )

  const projects = (data?.projects ?? []).filter((project: Project) => {
    if (filter === 'featured') return project.isFeatured
    return true
  })

  if (!projects.length) {
    return (
      <Card radius="xl" padding="xl" withBorder className="w-full border-dashed">
        <Group justify="center" className="py-10">
          <LayoutGrid size={40} />
        </Group>

        <p className="text-center text-slate-500">
          No projects found
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {projects.map((project: Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
function ProjectsPage() {
  const { user } = Route.useRouteContext()

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const [debouncedSearch] = useDebouncedValue(searchInput, 300)

  const isSearching = debouncedSearch.trim().length > 0

  const { data, isFetching } = useQuery(
    isSearching
      ? searchProjectsQueryOptions(debouncedSearch, page, PAGE_SIZE)
      : getPaginatedProjectsQueryOptions(page, PAGE_SIZE)
  )

  const allProjects = data?.projects ?? []
  const totalPages = data?.totalPages ?? 1

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project: Project) => {
      if (filter === 'featured') return project.isFeatured
      return true
    })
  }, [allProjects, filter])

  const featuredProjects = allProjects.filter(
    (p: Project) => p.isFeatured
  ).length

  const handleSearch = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const handleFilter = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-8 py-8 md:space-y-10 md:py-10">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] border bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-12">
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">
            <Badge
              size="lg"
              radius="xl"
              variant="light"
              color="blue"
              leftSection={<Sparkles size={12} />}
            >
              Portfolio Projects
            </Badge>

            <h1 className="title2">
              Building Modern Software
            </h1>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Explore production-ready projects built with modern technologies.
            </p>
          </div>

          {user && (
            <Button
              component={Link}
              to="/projects/new"
              radius="xl"
              leftSection={<FolderPlus size={18} />}
            >
              Create Project
            </Button>
          )}

        </div>
      </div>

      {/* CONTROLS */}
      <Card radius="xl" padding="lg" withBorder>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          {/* SEARCH */}
          <div className="w-full lg:max-w-lg space-y-3">

            {/* SEARCH LABEL */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <Search size={14} />
              Search Projects
            </div>

            {/* SEARCH INPUT */}
            <TextInput
              radius="xl"
              size="md"
              placeholder="Search projects..."
              leftSection={<Search size={16} />}
              value={searchInput}
              onChange={(e) => handleSearch(e.currentTarget.value)}
              rightSection={
                searchInput ? (
                  <button onClick={() => handleSearch('')}>
                    <X size={14} />
                  </button>
                ) : null
              }
            />

            {/* SEARCH RESULTS (UNDER INPUT) */}
            {isSearching && (
              <Badge variant="light" color="gray" radius="xl">
                {isFetching
                  ? 'Searching...'
                  : `Results for "${debouncedSearch}"`}
              </Badge>
            )}

          </div>

          {/* FILTER */}
          <div className="w-full lg:w-[260px] space-y-4">

            {/* FILTER LABEL */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <LayoutGrid size={14} />
              Filter
            </div>

            {/* FILTER PILLS */}
            <div className="flex gap-2">
              {FILTER_OPTIONS.map((option) => {
                const active = filter === option.value
                const Icon = option.icon

                return (
                  <Badge
                    key={option.value}
                    radius="xl"
                    size="lg"
                    variant={active ? 'filled' : 'light'}
                    color={active ? 'blue' : 'gray'}
                    className="cursor-pointer transition hover:scale-[1.03]"
                    leftSection={<Icon size={12} />}
                    onClick={() => handleFilter(option.value as FilterValue)}
                  >
                    {option.label}
                  </Badge>
                )
              })}
            </div>

          </div>

        </div>
      </Card>

      {/* GRID */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsGrid
          page={page}
          search={debouncedSearch}
          filter={filter}
          isSearching={isSearching}
        />
      </Suspense>

      {/* PAGINATION */}
      {!isSearching && filter === 'all' && totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={page}
            onChange={(value) => {
              setPage(value)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            total={totalPages}
            radius="xl"
          />
        </Group>
      )}

    </div>
  )
}