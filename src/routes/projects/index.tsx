import { getProjectsQueryOptions, searchProjectsQueryOptions } from '@/queries/project.queries'
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
} from '@mantine/core'
import { Globe, Github, ArrowRight, Search, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import type { Project } from '@/db/project.schema'

const PAGE_SIZE = 6

export const Route = createFileRoute('/projects/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getProjectsQueryOptions(1, PAGE_SIZE))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session } = authClient.useSession()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)

  const isSearching = debouncedSearch.trim().length > 0

  // Use search query when there's a search term, otherwise use normal paginated query
  const { data, isLoading, isPlaceholderData } = useQuery(
    isSearching
      ? searchProjectsQueryOptions(debouncedSearch, page, PAGE_SIZE)
      : getProjectsQueryOptions(page, PAGE_SIZE)
  )

  const projects = data?.projects ?? []
  const totalPages = data?.totalPages ?? 1

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1) // reset to page 1 on new search
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container size="xl" className="py-16">

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

      {/* Search bar */}
      <div className="mb-8 max-w-lg">
        <TextInput
          placeholder="Search by title, technology, or description…"
          size="md"
          radius="xl"
          leftSection={<Search size={16} />}
          rightSection={
            searchInput ? (
              <button onClick={() => handleSearchChange("")}>
                <X size={15} className="text-slate-400 hover:text-slate-600" />
              </button>
            ) : null
          }
          value={searchInput}
          onChange={(e) => handleSearchChange(e.currentTarget.value)}
        />
        {isSearching && (
          <Text size="xs" c="dimmed" mt="xs" ml="xs">
            {isLoading
              ? "Searching…"
              : `${data?.total ?? 0} result${(data?.total ?? 0) !== 1 ? "s" : ""} for "${debouncedSearch}"`}
          </Text>
        )}
      </div>

      <div className="mb-12 border-b border-gray-200" />

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="py-24 text-center">
          <Title order={3} c="dimmed">
            {isSearching ? `No projects found for "${debouncedSearch}"` : "No projects yet"}
          </Title>
          {isSearching && (
            <Button
              variant="subtle"
              mt="md"
              onClick={() => handleSearchChange("")}
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      <div
        className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${
          isPlaceholderData ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            shadow="sm"
            padding="lg"
            radius="lg"
            withBorder
            className="flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
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

              {/* Status Badge + GitHub */}
              <Group gap="sm">
                <Badge
                  color={project.isPublic ? "green" : "gray"}
                  variant="light"
                  className="w-fit"
                >
                  {project.isPublic ? "Open Source" : "Private Project"}
                </Badge>
                {project.isPublic && project.githubUrl && (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    variant="subtle"
                    leftSection={<Github size={18} />}
                    size="xs"
                  >
                    View Source
                  </Button>
                )}
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
                      // Highlight matched tech when searching
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

            {/* Action Buttons */}
            <Stack mt="md" gap="xs">
              <Group grow>
                <Button
                  component="a"
                  href={project.websiteUrl}
                  target="_blank"
                  leftSection={<Globe size={16} />}
                  variant="light"
                >
                  Live Demo
                </Button>
                <Link to="/projects/$id/details" params={{ id: project.id }}>
                  <Button fullWidth rightSection={<ArrowRight size={16} />}>
                    Details
                  </Button>
                </Link>
              </Group>
            </Stack>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={page}
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