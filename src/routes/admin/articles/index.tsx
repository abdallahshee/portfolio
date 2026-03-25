import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Avatar, Badge, Pagination, Text, Title,
  TextInput, Group, Paper, Skeleton, Table,
  Tooltip, ActionIcon,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  Search, X, Heart, MessageCircle,
  FileText, Calendar, Trash2,
} from 'lucide-react'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { getPaginatedArticlesQueryOptions } from '@/db/queries/article.queries'

export const Route = createFileRoute('/admin/articles/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getPaginatedArticlesQueryOptions(1, 10))
  },
  component: RouteComponent,
})

const PAGE_SIZE = 10

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 300)
  const router = useRouter()

  const { data, isLoading } = useQuery(getPaginatedArticlesQueryOptions(page, PAGE_SIZE))

  // ✅ safely extract blogs array and pagination
  const rawBlogs = data?.blogs
  const allBlogs = Array.isArray(rawBlogs) ? rawBlogs : []
  const pagination = data?.pagination

  const filtered = debouncedSearch.trim()
    ? allBlogs.filter((b) =>
        b.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.authorName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.categoryName?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allBlogs

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title order={2}>Articles</Title>
          <Text size="sm" c="dimmed">
            {pagination?.total ?? 0} total articles
          </Text>
        </div>
        <Link to="/articles/create" className="no-underline">
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
            <FileText size={15} />
            New Article
          </button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 400 }}>
        <TextInput
          placeholder="Search by title, author, or category…"
          size="sm"
          radius="md"
          leftSection={<Search size={14} />}
          rightSection={
            searchInput ? (
              <button onClick={() => setSearchInput('')}>
                <X size={13} className="text-slate-400 hover:text-slate-600" />
              </button>
            ) : null
          }
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.currentTarget.value)
            setPage(1)
          }}
        />
      </div>

      {/* Table */}
      <Paper withBorder radius="xl" className="overflow-hidden overflow-x-auto">
        <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg" style={{ minWidth: 800 }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Article</Table.Th>
              <Table.Th>Author</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Engagement</Table.Th>
              <Table.Th>Published</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Table.Tr key={i}>
                  <Table.Td><Skeleton height={40} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={20} width={120} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={20} width={80} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={20} width={80} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={20} width={100} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={32} width={80} radius="md" /></Table.Td>
                </Table.Tr>
              ))
            ) : filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText size={40} className="mb-3 text-slate-300" />
                    <Text fw={500} c="dimmed">
                      {debouncedSearch
                        ? `No articles matching "${debouncedSearch}"`
                        : 'No articles yet'
                      }
                    </Text>
                  </div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((article) => (
                <Table.Tr
                  key={article.id}
                  onClick={() => router.navigate({
                    to: '/admin/articles/$slug',
                    params: { slug: article.slug },
                  })}
                  className="cursor-pointer"
                >
                  {/* Title + cover */}
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap" style={{ maxWidth: 320 }}>
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="h-10 w-16 flex-shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                          <FileText size={16} className="text-slate-400" />
                        </div>
                      )}
                      <Text size="sm" fw={500} lineClamp={2} className="min-w-0">
                        {article.title}
                      </Text>
                    </Group>
                  </Table.Td>

                  {/* Author */}
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <Avatar
                        src={article.authorImage || undefined}
                        alt={article.authorName || 'Author'}
                        size={28}
                        radius="xl"
                      />
                      <Text size="sm" className="whitespace-nowrap">
                        {article.authorName ?? '—'}
                      </Text>
                    </Group>
                  </Table.Td>

                  {/* Category */}
                  <Table.Td>
                    {article.categoryName ? (
                      <Badge variant="light" color="grape" radius="xl" size="sm">
                        {article.categoryName}
                      </Badge>
                    ) : (
                      <Text size="sm" c="dimmed">—</Text>
                    )}
                  </Table.Td>

                  {/* Engagement */}
                  <Table.Td>
                    <Group gap="sm">
                      <Group gap={4}>
                        <Heart size={13} className="text-rose-400" />
                        <Text size="xs" c="dimmed">{article.likes}</Text>
                      </Group>
                      <Group gap={4}>
                        <MessageCircle size={13} className="text-indigo-400" />
                        <Text size="xs" c="dimmed">{article.comments}</Text>
                      </Group>
                    </Group>
                  </Table.Td>

                  {/* Date */}
                  <Table.Td>
                    <Group gap={6}>
                      <Calendar size={13} className="text-slate-400" />
                      <Text size="xs" c="dimmed" className="whitespace-nowrap">
                        {moment(article.createdAt).format('MMM D, YYYY')}
                      </Text>
                    </Group>
                  </Table.Td>

                  {/* Actions */}
                  <Table.Td onClick={(e) => e.stopPropagation()}>
                    <Group gap="xs">
                      <Tooltip label="Delete article" position="top">
                        <ActionIcon
                          variant="light"
                          color="red"
                          radius="lg"
                          size="md"
                          onClick={() => {
                            // wire up delete mutation here
                          }}
                        >
                          <Trash2 size={15} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination */}
      {!debouncedSearch && (pagination?.totalPages ?? 1) > 1 && (
        <Group justify="center">
          <Pagination
            value={page}
            total={pagination?.totalPages ?? 1}
            onChange={(p) => {
              setPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            radius="md"
            color="indigo"
          />
        </Group>
      )}
    </div>
  )
}