import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  Mail,
  ShieldCheck,
  UserRound,
  Clock3,
} from "lucide-react"
import { getUserByIdQueryOptions } from "@/db/queries/user.queries"

export const Route = createFileRoute("/admin/users/$id")({
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(getUserByIdQueryOptions(params.id))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { id } = Route.useParams()

  const { data: user, isLoading, isError } = useQuery(
    getUserByIdQueryOptions(id)
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
        <Container size="lg">
          <Stack gap="lg">
            <Skeleton height={140} radius="xl" />
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              <Skeleton height={220} radius="xl" />
              <Skeleton height={220} radius="xl" />
            </SimpleGrid>
            <Skeleton height={140} radius="xl" />
          </Stack>
        </Container>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
        <Container size="lg">
          <Paper radius="2xl" p="xl" withBorder className="shadow-sm">
            <Stack gap="md" align="center">
              <Title order={3}>User not found</Title>
              <Text c="dimmed" ta="center">
                We could not load the requested user details.
              </Text>
              <Button
                variant="light"
                radius="xl"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => navigate({ to: "/admin/users" })}
              >
                Back to Users
              </Button>
            </Stack>
          </Paper>
        </Container>
      </div>
    )
  }

  const fullName = user.name || "Unnamed User"
  const email = user.email || "No email"
  const initials =
    fullName
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="xl">
        <Stack gap="xl">
          <Paper
            radius="2xl"
            p="xl"
            withBorder
            className="overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="flex-start" className="gap-4">
              <Group align="flex-start" gap="lg">
                <Avatar
                  src={user.avatar}
                  size={88}
                  radius="xl"
                  color="indigo"
                >
                  {initials}
                </Avatar>

                <Stack gap={8}>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="indigo" radius="xl" size="lg">
                      <UserRound size={18} />
                    </ThemeIcon>
                    <Text fw={600} c="dimmed" size="sm">
                      User Details
                    </Text>
                  </Group>

                  <Title order={1} className="text-3xl md:text-5xl">
                    {fullName}
                  </Title>

                  <Group gap="sm">
                    <Badge
                      variant="light"
                      color={user.role === "admin" ? "red" : "blue"}
                      radius="xl"
                      size="lg"
                      leftSection={
                        user.role === "admin" ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <UserRound size={14} />
                        )
                      }
                    >
                      {user.role}
                    </Badge>

                    <Badge
                      variant="light"
                      color="grape"
                      radius="xl"
                      size="lg"
                      leftSection={<FileText size={14} />}
                    >
                      {user.articleCount} articles
                    </Badge>
                  </Group>

                  <Text className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Review this user’s account details, activity timestamps, and
                    authored article count from the admin panel.
                  </Text>
                </Stack>
              </Group>

              <Group gap="sm">
                <Button
                  variant="default"
                  radius="xl"
                  leftSection={<ArrowLeft size={16} />}
                  onClick={() => navigate({ to: "/admin/users" })}
                >
                  Back
                </Button>

                <Button
                  radius="xl"
                  leftSection={<BookOpen size={16} />}
                  onClick={() =>
                    navigate({
                      to: "/articles/$userId",
                      params:{userId:id},
                      search:{page:1}
                    })
                  }
                >
                  Open User Articles
                </Button>
              </Group>
            </Group>
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <div>
                  <Group gap="xs" mb="xs">
                    <ThemeIcon variant="light" color="blue" radius="xl">
                      <Mail size={16} />
                    </ThemeIcon>
                    <Title order={3}>Account Information</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Basic account details for this user.
                  </Text>
                </div>

                <Stack gap="md">
                  <InfoRow label="Full Name" value={fullName} />
                  <InfoRow label="Email Address" value={email} />
                  <InfoRow label="User ID" value={user.userId} mono />
                  <InfoRow label="Role" value={user.role} />
                </Stack>
              </Stack>
            </Card>

            <Card radius="2xl" withBorder p="xl" className="shadow-sm">
              <Stack gap="lg">
                <div>
                  <Group gap="xs" mb="xs">
                    <ThemeIcon variant="light" color="teal" radius="xl">
                      <Clock3 size={16} />
                    </ThemeIcon>
                    <Title order={3}>Activity Summary</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Track article count and account activity timestamps.
                  </Text>
                </div>

                <Stack gap="md">
                  <InfoRow
                    label="Articles Written"
                    value={String(user.articleCount ?? 0)}
                  />
                  <InfoRow
                    label="Last Sign In"
                    value={formatDate(user.lastSignIn)}
                  />
                  <InfoRow
                    label="Created At"
                    value={formatDate(user.createdAt)}
                  />
                  <InfoRow
                    label="Updated At"
                    value={formatDate(user.updatedAt)}
                  />
                </Stack>
              </Stack>
            </Card>
          </SimpleGrid>

          <Card radius="2xl" withBorder p="xl" className="shadow-sm">
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="grape" radius="xl">
                  <CalendarDays size={16} />
                </ThemeIcon>
                <Title order={3}>Quick Actions</Title>
              </Group>

              <Text size="sm" c="dimmed">
                Jump to the content this user has authored from the admin area.
              </Text>

              <Divider />

              <Group justify="space-between" align="center" className="gap-4">
                <div>
                  <Text fw={600}>Articles by {fullName}</Text>
                  <Text size="sm" c="dimmed">
                    Open the articles written by this const [state, dispatch] = useReducer(first, second, third).
                  </Text>
                </div>

                <Button
                  radius="xl"
                  leftSection={<BookOpen size={16} />}
                  onClick={() =>
                  navigate({
                      to: "/articles/$userId",
                      params:{userId:id},
                      search:{page:1}
                    })
                  }
                >
                  Open User Articles
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <Text size="sm" c="dimmed" mb={6}>
        {label}
      </Text>
      <Text fw={600} className={mono ? "break-all font-mono text-sm" : ""}>
        {value}
      </Text>
    </div>
  )
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not available"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"

  return date.toLocaleString()
}