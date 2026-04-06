import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
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
  Pencil,
} from "lucide-react"
import { getUserByIdQueryOptions } from "@/db/queries/user.queries"
import moment from "moment"

export const Route = createFileRoute("/admin/users/$userId")({
  loader: async ({ context, params }) => {
    const userId = params.userId
    await context.queryClient.prefetchQuery(getUserByIdQueryOptions(userId))
  },
  pendingComponent: () => (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950 md:py-12">
      <Container size="xl">
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
  ),
  errorComponent: () => (
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
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { userId } = Route.useParams()

  const { data: user } = useSuspenseQuery(getUserByIdQueryOptions(userId))

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

          {/* ── HEADER ── */}
          <Paper
            radius="2xl"
            p="xl"
            withBorder
            className="overflow-hidden bg-gradient-to-br from-white to-slate-50 shadow-sm dark:from-slate-900 dark:to-slate-950"
          >
            <Group justify="space-between" align="flex-start" className="gap-4">
              <Group align="flex-start" gap="lg">
                <Avatar src={user.avatar} size={88} radius="xl" color="indigo">
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
                    Review this user's account details, activity timestamps, and
                    authored article count from the admin panel.
                  </Text>
                </Stack>
              </Group>

              {/* ── ACTION BUTTONS ── */}
              <Group gap="sm" wrap="nowrap">
                <Button
                  variant="default"
                  radius="xl"
                  leftSection={<ArrowLeft size={16} />}
                  onClick={() => navigate({ to: "/admin/users" })}
                >
                  Back
                </Button>

                <Button
                  variant="light"
                  color="indigo"
                  radius="xl"
                  leftSection={<Pencil size={16} />}
                  onClick={() =>
                    navigate({
                      to: "/admin/users/$userId/edit",
                      params: { userId },
                    })
                  }
                >
                  Edit User
                </Button>

                <Button
                  radius="xl"
                  leftSection={<BookOpen size={16} />}
                  onClick={() =>
                    navigate({
                      to: "/articles/$userId",
                      params: { userId },
                      search: { page: 1 },
                    })
                  }
                >
                  View Articles
                </Button>
              </Group>
            </Group>
          </Paper>

          {/* ── INFO CARDS ── */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">

            {/* Account Information */}
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
                  <InfoRow
                    label="Role"
                    value={user.role}
                    badge
                    badgeColor={user.role === "admin" ? "red" : "blue"}
                  />
                </Stack>
              </Stack>
            </Card>

            {/* Activity Summary */}
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
                    value={
                      user.lastSignIn
                        ? `${moment(user.lastSignIn).format("MMM D, YYYY")} (${moment(user.lastSignIn).fromNow()})`
                        : "Never"
                    }
                  />
                  <InfoRow
                    label="Created At"
                    value={
                      user.createdAt
                        ? `${moment(user.createdAt).format("MMM D, YYYY")} (${moment(user.createdAt).fromNow()})`
                        : "—"
                    }
                  />
                  <InfoRow
                    label="Updated At"
                    value={
                      user.updatedAt
                        ? `${moment(user.updatedAt).format("MMM D, YYYY")} (${moment(user.updatedAt).fromNow()})`
                        : "—"
                    }
                  />
                </Stack>
              </Stack>
            </Card>
          </SimpleGrid>

          {/* ── QUICK ACTIONS ── */}
          <Card radius="2xl" withBorder p="xl" className="shadow-sm">
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon variant="light" color="grape" radius="xl">
                  <CalendarDays size={16} />
                </ThemeIcon>
                <Title order={3}>Quick Actions</Title>
              </Group>

              <Text size="sm" c="dimmed">
                Manage this user or jump to their content from the admin area.
              </Text>

              <Divider />

              {/* Edit Profile */}
              <Group justify="space-between" align="center" className="gap-4">
                <div>
                  <Text fw={600}>Edit {fullName}'s Profile</Text>
                  <Text size="sm" c="dimmed">
                    Update this user's name, email, avatar, or password.
                  </Text>
                </div>
                <Button
                  variant="light"
                  color="indigo"
                  radius="xl"
                  leftSection={<Pencil size={16} />}
                  onClick={() =>
                    navigate({
                      to: "/admin/users/$userId/edit",
                      params: { userId },
                    })
                  }
                >
                  Edit User
                </Button>
              </Group>

              <Divider />

              {/* View Articles */}
              <Group justify="space-between" align="center" className="gap-4">
                <div>
                  <Text fw={600}>Articles by {fullName}</Text>
                  <Text size="sm" c="dimmed">
                    View all articles written by this user.
                  </Text>
                </div>
                <Button
                  radius="xl"
                  leftSection={<BookOpen size={16} />}
                  onClick={() =>
                    navigate({
                      to: "/articles/$userId",
                      params: { userId },
                      search: { page: 1 },
                    })
                  }
                >
                  View Articles
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
  badge = false,
  badgeColor = "blue",
}: {
  label: string
  value: string
  mono?: boolean
  badge?: boolean
  badgeColor?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <Text size="sm" c="dimmed" mb={6}>
        {label}
      </Text>
      {badge ? (
        <Badge variant="light" color={badgeColor} radius="xl">
          {value}
        </Badge>
      ) : (
        <Text fw={600} className={mono ? "break-all font-mono text-sm" : ""}>
          {value}
        </Text>
      )}
    </div>
  )
}