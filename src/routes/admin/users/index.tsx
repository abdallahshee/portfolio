import { createFileRoute } from '@tanstack/react-router'
import { getAllUsersQueryOptions } from "@/db/queries/user.queries"
import { Avatar, Badge, Container, Group, Pagination, Paper, Skeleton, Stack, Table, Text, TextInput, ThemeIcon, Title } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import { Search, ShieldCheck, User, Users, X } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchInput, 200)

  // ✅ pass debouncedSearch to query — resets page to 1 on new search
  const { data, isLoading, isFetching } = useQuery(
    getAllUsersQueryOptions(page, 6, debouncedSearch)
  )

  const users = data?.users ?? []
  const totalPages = data?.totalPages ?? 1
  const total = data?.total ?? 0

  // ✅ reset to page 1 when search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container size="xl" className="py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Stack gap={4}>
          <Group gap="sm">
            <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
              <Users size={18} />
            </ThemeIcon>
            <Title order={2} className="text-2xl font-bold">Users</Title>
          </Group>
          <Text c="dimmed" size="sm">
            {isLoading
              ? 'Loading...'
              : debouncedSearch
                ? `${total} result${total !== 1 ? 's' : ''} for "${debouncedSearch}"`
                : `${total} registered user${total !== 1 ? 's' : ''}`
            }
          </Text>
        </Stack>

        {/* ✅ search input */}
        <TextInput
          placeholder="Search by name or email…"
          leftSection={<Search size={14} />}
          rightSection={
            searchInput ? (
              <button type="button" onClick={() => setSearchInput('')}>
                <X size={13} className="text-slate-400 hover:text-slate-600" />
              </button>
            ) : null
          }
          radius="xl"
          size="sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          style={{ minWidth: 280 }}
        />
      </div>

      {/* Table — rest stays the same */}
      <Paper radius="xl" withBorder shadow="sm" className="overflow-hidden">
        <Table
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="xl"
          className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
        >
          <Table.Thead className="bg-slate-50 dark:bg-slate-800">
            <Table.Tr>
              <Table.Th><Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">User</Text></Table.Th>
              <Table.Th><Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">Email</Text></Table.Th>
              <Table.Th><Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">Role</Text></Table.Th>
              <Table.Th><Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">Status</Text></Table.Th>
              <Table.Th><Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">Joined</Text></Table.Th>
              <Table.Th><Text size="xs" fw={600} c="dimmed" className="uppercase tracking-widest">Last Sign In</Text></Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Table.Tr key={i}>
                  <Table.Td><Group gap="sm"><Skeleton circle height={36} /><Skeleton height={14} width={120} radius="md" /></Group></Table.Td>
                  <Table.Td><Skeleton height={14} width={180} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={20} width={60} radius="xl" /></Table.Td>
                  <Table.Td><Skeleton height={20} width={70} radius="xl" /></Table.Td>
                  <Table.Td><Skeleton height={14} width={90} radius="md" /></Table.Td>
                  <Table.Td><Skeleton height={14} width={90} radius="md" /></Table.Td>
                </Table.Tr>
              ))
            ) : users.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Stack align="center" gap="xs" py="xl">
                    <ThemeIcon size={56} radius="xl" variant="light" color="gray">
                      <Users size={28} />
                    </ThemeIcon>
                    <Text fw={600}>No users found</Text>
                    <Text size="sm" c="dimmed">
                      {debouncedSearch
                        ? `No users matched "${debouncedSearch}"`
                        : 'No users have registered yet.'
                      }
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            ) : (
              users.map((u) => {
                const isAdmin = u.user_metadata?.role === 'admin'
                const isConfirmed = !!u.email_confirmed_at
                const joinedAt = u.created_at
                  ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'
                const lastSignIn = u.last_sign_in_at
                  ? new Date(u.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Never'

                return (
                  <Table.Tr key={u.id}>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar src={u.user_metadata?.avatar_url} radius="xl" size="md" color="indigo">
                          {u.user_metadata?.name?.[0]?.toUpperCase() ?? u.email?.[0]?.toUpperCase() ?? 'U'}
                        </Avatar>
                        <Stack gap={2}>
                          <Text size="sm" fw={600} className="leading-tight">{u.user_metadata?.name ?? '—'}</Text>
                          {/* <Text size="xs" c="dimmed">{u.id.slice(0, 8)}…</Text> */}
                        </Stack>
                      </Group>
                    </Table.Td>
                    <Table.Td><Text size="sm">{u.email ?? '—'}</Text></Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={isAdmin ? 'indigo' : 'gray'} radius="xl"
                        leftSection={isAdmin ? <ShieldCheck size={11} /> : <User size={11} />}
                      >
                        {isAdmin ? 'Admin' : 'User'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={isConfirmed ? 'green' : 'yellow'} radius="xl">
                        {isConfirmed ? 'Verified' : 'Unverified'}
                      </Badge>
                    </Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{joinedAt}</Text></Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{lastSignIn}</Text></Table.Td>
                  </Table.Tr>
                )
              })
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={page}
            onChange={handlePageChange}
            total={totalPages}
            radius="xl"
            withEdges
            color="indigo"
          />
        </Group>
      )}

    </Container>
  )
}