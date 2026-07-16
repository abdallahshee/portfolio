import { Badge, Button, Card, Divider, ThemeIcon } from '@mantine/core'
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
    <Card
      withBorder
      radius="lg"
      p="xl"
      className="min-h-[500px] lg:min-h-full"
    >
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <ThemeIcon size={64} radius="xl" variant="light" color="blue">
          <MousePointerClick size={30} />
        </ThemeIcon>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Select a project
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Click any project on the left to see its details, tech stack, and links here.
          </p>
        </div>

        <Divider className="w-full" />

        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              {/* <FolderKanban size={14} className="text-slate-400" /> */}
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Projects
              </span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {stats.total}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              {/* <Star size={14} className="text-slate-400" /> */}
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Featured
              </span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {stats.featured}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Tech used
              </span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {stats.technologiesCount}
            </span>
          </div>
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