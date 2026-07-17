import { Badge, Button, Card, Divider, Group } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import {
  Code2,
  FolderKanban,
  Github,
  Kanban,
  Sparkles,
  Users
} from 'lucide-react'

interface ProjectStats {
  total: number
  featured: number
  contributorCount: number
  technologiesCount: number
  topTechnologies: string[]
}

interface ProjectsOverviewPanelProps {
  stats: ProjectStats
}

export function ProjectsOverviewPanel({ stats }: ProjectsOverviewPanelProps) {
  const statsdata = [
    {
      icon: Kanban,
      label: "Projects",
      value: stats.total,
    },
    {
      icon: Users,
      label: "Co-Built",
      value: stats.contributorCount
    },
    {
      icon: Code2,
      label: "Skills",
      value: stats.technologiesCount
    },

  ]
  return (
    <Card
      withBorder
      radius="lg"
      p="xl"
      className="min-h-[500px] lg:min-h-full"
    >
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Select a project
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Click any project on the left to see its details, tech stack, and links here.
          </p>
        </div>

        <Divider className="w-full" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {statsdata.map((item) => (
            <Card
              key={item.label}
              withBorder
              radius="lg"
              padding="md"
              className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40"
            >
              <Group gap="sm" wrap="nowrap">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/15 dark:bg-green-400/15">
                  <item.icon size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-green-700 dark:text-green-300">
                    {item.value}+
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-green-600/80 dark:text-green-400/70">
                    {item.label}
                  </span>
                </div>
              </Group>
            </Card>
          ))}
        </div>

        {stats.topTechnologies?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {stats.topTechnologies.map((tech: string) => (
              <Badge key={tech} variant="light" color="gray" radius="xl">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <Divider className="w-full" />

        <div className="flex flex-wrap justify-center gap-2">
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
            <Button variant="filled" radius="md" size="sm" leftSection={<Sparkles size={15} />}>
              My Skills
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}