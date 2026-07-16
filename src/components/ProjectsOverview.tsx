// components/ProjectsOverviewPanel.tsx
import { Badge, Button, Card, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import {
  Code2,
  FolderKanban,
  Github,
  MousePointerClick,
  Sparkles,
  Star,
} from 'lucide-react'

interface ProjectStats {
  total: number
  featured: number
  technologiesCount: number
  topTechnologies: string[]
}

interface ProjectsOverviewPanelProps {
  stats: ProjectStats
}

export function ProjectsOverviewPanel({ stats }: ProjectsOverviewPanelProps) {
  return (
    <Card withBorder radius="lg" p="xl" className="h-full">
      <Stack gap="lg" justify="center" className="h-full text-center">
        {/* ICON */}
        <Group justify="center">
          <ThemeIcon size={64} radius="xl" variant="light" color="blue">
            <MousePointerClick size={30} />
          </ThemeIcon>
        </Group>

        {/* HEADLINE */}
        <div>
          <div className="title3">Select a project</div>
          <Text size="sm" c="dimmed" mt={4}>
            Click any project on the left to see its details, tech stack,
            and links here.
          </Text>
        </div>

        <Divider />

        {/* QUICK STATS */}
        <Group justify="center" gap="xl">
          <Stack gap={2} align="center">
            <Group gap={4}>
              <FolderKanban size={14} className="text-slate-400" />
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Projects
              </Text>
            </Group>
            <Text size="xl" fw={700}>
              {stats.total}
            </Text>
          </Stack>

          <Stack gap={2} align="center">
            <Group gap={4}>
              <Star size={14} className="text-slate-400" />
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Featured
              </Text>
            </Group>
            <Text size="xl" fw={700}>
              {stats.featured}
            </Text>
          </Stack>

          <Stack gap={2} align="center">
            <Group gap={4}>
              <Code2 size={14} className="text-slate-400" />
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Tech Used
              </Text>
            </Group>
            <Text size="xl" fw={700}>
              {stats.technologiesCount}
            </Text>
          </Stack>
        </Group>

        {/* TOP TECHNOLOGIES */}
        {stats.topTechnologies?.length > 0 && (
          <Group justify="center" gap="xs">
            {stats.topTechnologies.map((tech: string) => (
              <Badge key={tech} variant="light" color="gray" radius="xl">
                {tech}
              </Badge>
            ))}
          </Group>
        )}

        <Divider />

        {/* CTA */}
        <Group justify="center" gap="sm">
          <Button
            component="a"
            href="https://github.com/abdallahshee"
            target="_blank"
            variant="light"
            radius="md"
            size="sm"
            leftSection={<Github size={15} />}
          >
            View GitHub
          </Button>
          <Link to="/skills">
            <Button
              variant="filled"
              radius="md"
              size="sm"
              leftSection={<Sparkles size={15} />}
            >
              My Skills
            </Button>
          </Link>
        </Group>
      </Stack>
    </Card>
  )
}