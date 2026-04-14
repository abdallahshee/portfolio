import { createFileRoute } from '@tanstack/react-router'
import { Paper, SimpleGrid, Text, ThemeIcon, Group } from '@mantine/core'
import { Users, FolderKanban, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getStatsQueryOptions } from '@/db/queries/admin.queries'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: stats } = useQuery(getStatsQueryOptions)

  const cards = [
    { label: 'Users', value: stats?.users ?? 0, icon: Users, color: 'blue' },
    { label: 'Projects', value: stats?.projects ?? 0, icon: FolderKanban, color: 'teal' },
    { label: 'Articles', value: stats?.articles ?? 0, icon: FileText, color: 'grape' },
  ]

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <Text size="xl" fw={700}>Overview</Text>
        <Text size="sm" c="dimmed">Quick summary of your platform</Text>
      </div>

      {/* Stats */}
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {cards.map((card) => (
          <Paper key={card.label} p="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">{card.label}</Text>
                <Text size="xl" fw={700}>{card.value}</Text>
              </div>

              <ThemeIcon color={card.color} size={40} radius="md">
                <card.icon size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

    </div>
  )
}