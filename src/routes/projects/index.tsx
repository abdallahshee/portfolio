import { getProjectsQueryOptions, searchProjectsQueryOptions } from '@/db/queries/project.queries'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  Text,
  Button,
  Image,
  Group,
  Stack,
  Badge,
  Title,
  Container,
  Rating,
  Pagination,
  TextInput,
  SegmentedControl,
} from '@mantine/core'
import { Globe, Github, Search, X, FolderKanban, ListFilter } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'

const PAGE_SIZE = 6

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getProjectsQueryOptions(1, PAGE_SIZE))
  },
  component: RouteComponent,
})

type FilterValue = 'all' | 'public' | 'private'

function RouteComponent() {
  const { data: session } = authClient.useSession()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [filter, setFilter] = useState<FilterValue>('all')
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)

  const isSearching = debouncedSearch.trim().length > 0

  const { data, isLoading, isPlaceholderData } = useQuery(
    isSearching
      ? searchProjectsQueryOptions(debouncedSearch, page, PAGE_SIZE)
      : getProjectsQueryOptions(page, PAGE_SIZE)
  )

  const allProjects = data?.projects ?? []
  const totalPages = data?.totalPages ?? 1

  // Filter client-side by isPublic
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

  return (
    <Container size="xl" className="space-y-8 py-10">

      {/* Page Header */}
      <div className="mb-10 max-w-2xl">
        <Title order={1} className="mb-4 text-4xl font-bold">
          Projects I've Built
        </Title>
        <Text size="lg" c="dimmed">
          Here is a collection of applications and platforms I have designed
          and developed. These projects showcase my ability to build scalable,
          production-ready web applications using modern technologies like
          React, TanStack Start, Drizzle ORM, and PostgreSQL.
        </Text>
      </div>

      {/* Search + Filter row */}
      {/* Search + Filter row */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1" style={{ minWidth: 240, maxWidth: 420 }}>
          <Text size="xs" fw={500} c="dimmed" mb={5} className="uppercase tracking-widest">
            Search
          </Text>
          <TextInput
            placeholder="Search by title, technology, or description…"
            size="sm"
            radius="md"
            leftSection={<Search size={14} />}
            rightSection={
              searchInput ? (
                <button onClick={() => handleSearchChange("")}>
                  <X size={13} className="text-slate-400 hover:text-slate-600" />
                </button>
              ) : null
            }
            value={searchInput}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
          />
          {isSearching && (
            <Text size="xs" c="dimmed" mt={4}>
              {isLoading
                ? "Searching…"
                : `${data?.total ?? 0} result${(data?.total ?? 0) !== 1 ? "s" : ""} for "${debouncedSearch}"`}
            </Text>
          )}
        </div>

        {/* Filter */}
        <div>
          <Group gap="xs" mb={5} align="center">
            <ListFilter size={12} className="text-slate-400" />
            <Text size="xs" fw={500} c="dimmed" className="uppercase tracking-widest">
              Filter by status
            </Text>
          </Group>
          <SegmentedControl
            value={filter}
            onChange={handleFilterChange}
            radius="xl"
            size="md"
            data={[
              { label: 'All', value: 'all' },
              { label: 'Open Source', value: 'public' },
              { label: 'Private', value: 'private' },
            ]}
          />
        </div>
      </div>

      <div className="mb-12 border-b border-gray-200" />

      {/* Filter result count */}
      {filter !== 'all' && (
        <Text size="sm" c="dimmed" mb="md">
          Showing {projects.length} {filter === 'public' ? 'open source' : 'private'}{' '}
          {projects.length === 1 ? 'project' : 'projects'}
        </Text>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="py-24 text-center">
          <Title order={3} c="dimmed">
            {isSearching
              ? `No projects found for "${debouncedSearch}"`
              : filter !== 'all'
                ? `No ${filter === 'public' ? 'open source' : 'private'} projects found`
                : "No projects yet"}
          </Title>
          {(isSearching || filter !== 'all') && (
            <Button
              variant="subtle"
              mt="md"
              onClick={() => {
                handleSearchChange("")
                setFilter('all')
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      <div
        className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isPlaceholderData ? 'opacity-60' : 'opacity-100'
          }`}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            shadow="sm"
            padding="lg"
            radius="lg"
            withBorder
            className="flex h-full flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
          >
            <Stack gap="sm">
              {/* Image */}
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
                  <Text size="sm" c="dimmed">No image</Text>
                )}
              </div>

              {/* Title */}
              <Title order={4}>{project.title}</Title>

              {/* Rating */}
              <Group gap="xs">
                <Rating value={project.averageRating} fractions={2} readOnly size="sm" />
                <Text size="xs" c="dimmed">
                  {project.averageRating > 0
                    ? `${project.averageRating} (${project.totalRatings})`
                    : "No ratings yet"}
                </Text>
              </Group>

              {/* Status Badge */}
              <Group gap="sm">
                <Badge
                  color={project.isPublic ? "blue" : "green"}
                  variant="light"
                  className="w-fit"
                >
                  {project.isPublic ? "Open Source" : "Private Project"}
                </Badge>
              </Group>

              {/* Description */}
              <Text size="sm" c="dimmed" lineClamp={3}>
                {project.description}
              </Text>

              {/* Technologies */}
              <Stack gap="xs" mt="xs">
                <Text size="sm" fw={500}>Technologies</Text>
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
                          ? { outline: "1.5px solid var(--mantine-color-indigo-4)" }
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
              <Link
                to="/projects/$id/details"
                params={{ id: project.id }}
                className="no-underline"
              >
                <Button
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

      {/* Pagination — hide when filter is active since it's client-side */}
      {!isSearching && filter === 'all' && totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={page}
            variant='gradient'
            color='green'
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