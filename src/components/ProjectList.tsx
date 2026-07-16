import { ProjectCard } from '@/components/ProjectCard'
import type { Project } from '@/db/validations/project.types'
import { Card, Badge, TextInput, Pagination } from '@mantine/core'
import { LayoutGrid, Search, Star, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'

const PAGE_SIZE = 6
type FilterValue = 'all' | 'featured'

const FILTER_OPTIONS = [
  { label: 'All', value: 'all', icon: LayoutGrid },
  { label: 'Featured', value: 'featured', icon: Star },
]

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const [debouncedSearch] = useDebouncedValue(searchInput, 300)
  const isSearching = debouncedSearch.trim().length > 0

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (filter === 'featured' && !project.isFeatured) return false
      if (isSearching && !project.title!.toLowerCase().includes(debouncedSearch.toLowerCase()))
        return false
      return true
    })
  }, [projects, filter, isSearching, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const handleFilter = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card radius="xl" padding="lg" withBorder>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <Search size={14} />
              Search projects
            </div>

            <TextInput
              radius="xl"
              size="md"
              placeholder="Search projects by title..."
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

            {isSearching && (
              <Badge variant="light" color="gray" radius="xl" className="w-fit">
                {`Results for "${debouncedSearch}"`}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <LayoutGrid size={14} />
              Filter
            </div>

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

      {paginated.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card radius="xl" padding="xl" withBorder className="w-full border-dashed">
          <div className="flex justify-center py-10">
            <LayoutGrid size={40} className="text-slate-400" />
          </div>
          <p className="text-center text-slate-500">No projects found</p>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination value={page} onChange={setPage} total={totalPages} radius="xl" />
        </div>
      )}
    </div>
  )
}