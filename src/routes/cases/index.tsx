import { createFileRoute } from '@tanstack/react-router'
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
  Text,
  Divider,
} from '@mantine/core'
import {
  Search,
  X,
  FolderOpen,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import { Suspense, useState } from 'react'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { Link, redirect } from '@tanstack/react-router'
import { getPaginatedCasesQueryOptions } from '@/db/queries/case.queries'
import moment from 'moment'

const PAGE_SIZE = 6

export const Route = createFileRoute('/cases/')({
  beforeLoad: async ({ context }) => {
    const isAdmin = context.isAdmin
    if (!isAdmin) {
      throw redirect({
        to: "/unauthorized",
      })
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      getPaginatedCasesQueryOptions(1, PAGE_SIZE, '')
    )
  },
  component: RouteComponent,
})

// ── SKELETON ──
function CasesGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} shadow="sm" padding="lg" radius="lg" withBorder>
          <Stack gap="sm">
            <Skeleton height={20} width="60%" radius="md" />
            <Skeleton height={14} width="40%" radius="md" />
            <Skeleton height={14} radius="md" />
            <Skeleton height={14} width="80%" radius="md" />
            <Skeleton height={14} width="60%" radius="md" />
            <Group gap="xs" mt="sm">
              <Skeleton height={22} width={70} radius="xl" />
              <Skeleton height={22} width={70} radius="xl" />
            </Group>
            <Skeleton height={34} mt="sm" radius="md" />
          </Stack>
        </Card>
      ))}
    </div>
  )
}

// ── CASE STUDY CARD ──
function CaseStudyCard({ caseItem }: { caseItem: any }) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      className="group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <Stack gap="sm" className="flex-1">
        {/* Title */}
        <div className="line-clamp-2 font-bold text-slate-900 dark:text-slate-50">
          {caseItem.title}
        </div>

        {/* Overview */}
        {caseItem.overview && (
          <Text size="sm" c="dimmed" lineClamp={3} className="leading-relaxed">
            {caseItem.overview}
          </Text>
        )}

        <Divider />

        {/* Meta */}
        <Group gap="xs" justify="space-between">
          <Group gap={6}>
            <CalendarDays size={13} className="text-slate-400" />
            <Text size="xs" c="dimmed">
              {moment(caseItem.startDate).format('MMM YYYY')} —{' '}
              {moment(caseItem.endDate).format('MMM YYYY')}
            </Text>
          </Group>
        </Group>

        {/* Technologies */}
        {caseItem.technologies && caseItem.technologies.length > 0 && (
          <Group gap="xs" wrap="wrap">
            {caseItem.technologies.slice(0, 3).map((tech: string) => (
              <Badge key={tech} variant="light" color="indigo" radius="md" size="sm">
                {tech}
              </Badge>
            ))}
            {caseItem.technologies.length > 3 && (
              <Badge variant="light" color="gray" radius="md" size="sm">
                +{caseItem.technologies.length - 3}
              </Badge>
            )}
          </Group>
        )}
      </Stack>

      {/* CTA */}
      <Link
        to="/projects/$slug/details"
        params={{ slug: caseItem }}
        className="mt-4 block"
      >
        <Button
          variant="light"
          color="indigo"
          radius="md"
          size="sm"
          fullWidth
          rightSection={<ArrowRight size={14} />}
        >
          View Project
        </Button>
      </Link>
    </Card>
  )
}

// ── CASES GRID ──
function CasesGrid({
  page,
  query,
  onQueryChange,
}: {
  page: number
  query: string
  onQueryChange: (value: string) => void
}) {
  const { data } = useSuspenseQuery(
    getPaginatedCasesQueryOptions(page, PAGE_SIZE, query)
  )

  const cases = data?.cases ?? []

  if (cases.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-4 pt-10 sm:min-h-[480px]">
        <ThemeIcon size={72} radius="md" variant="light" color="indigo">
          <FolderOpen size={36} />
        </ThemeIcon>
        <div className="title2 text-center">No case studies found</div>
        {query ? (
          <>
            <Text c="dimmed" size="sm" ta="center" className="max-w-md">
              No case studies matched <strong>&quot;{query}&quot;</strong>. Try
              a different search term or clear the search.
            </Text>
            <Button
              variant="light"
              color="indigo"
              onClick={() => onQueryChange('')}
            >
              Clear Search
            </Button>
          </>
        ) : (
          <Text c="dimmed" size="sm" ta="center" className="max-w-md">
            No case studies have been added yet.
          </Text>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseItem) => (
        <CaseStudyCard key={caseItem.id} caseItem={caseItem} />
      ))}
    </div>
  )
}

// ── ROUTE COMPONENT ──
function RouteComponent() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 200)

  // plain useQuery for totalPages + isFetching only — does not block render
  const { data, isFetching } = useQuery(
    getPaginatedCasesQueryOptions(page, PAGE_SIZE, debouncedSearch)
  )

  const totalPages = data?.totalPages ?? 1

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container
      size="xl"
      className="max-w-full space-y-6 px-0 py-6 sm:space-y-8 sm:py-8 md:py-10"
    >
      {/* ── PAGE HEADER ── */}
      <div className="mb-6 max-w-2xl sm:mb-10">
        <div className="heading">Case Studies</div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7 dark:text-slate-400">
          A deep dive into the problems, solutions, and outcomes behind each
          project — documenting the thinking and engineering decisions that
          shaped the final product.
        </p>
      </div>

      {/* ── SEARCH ── */}
      <div className="w-full max-w-md">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Search
        </div>
        <TextInput
          placeholder="Search by title or project ID…"
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
        {debouncedSearch && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {isFetching
              ? 'Searching…'
              : `${data?.total ?? 0} result${(data?.total ?? 0) !== 1 ? 's' : ''
              } for "${debouncedSearch}"`}
          </p>
        )}
      </div>

      <div className="border-b border-blue-500" />

      {/* ── RESULT COUNT ── */}
      {data && data.cases.length > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {data.cases.length}{' '}
          {data.cases.length === 1 ? 'case study' : 'case studies'}
        </p>
      )}

      {/* ── GRID ── */}
      <div
        className={`min-h-[420px] transition-opacity duration-200 sm:min-h-[560px] md:min-h-[720px] lg:min-h-[900px] ${isFetching ? 'opacity-80' : 'opacity-100'
          }`}
      >
        <Suspense fallback={<CasesGridSkeleton />}>
          <CasesGrid
            page={page}
            query={debouncedSearch}
            onQueryChange={handleSearchChange}
          />
        </Suspense>
      </div>

      {/* ── PAGINATION ── */}
      {!isFetching && totalPages > 1 && (
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