import type { Project } from '@/db/validations/project.types'
import { Badge, Button, Card, Image, ThemeIcon } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { CalendarDays, ExternalLink, FolderKanban, Github, RefreshCw } from 'lucide-react'
import moment from 'moment'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isRecent = moment().diff(moment(project.createdAt), 'days') <= 28

  return (
    <Card
      shadow="sm"
      padding={0}
      radius="lg"
      withBorder
      className="group relative flex h-full min-w-0 flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {project.imageUrl ? (
        <Image
          src={project.imageUrl}
          alt={project.title ?? "Project image"}
          fit="cover"
          className="absolute inset-0 h-full w-full opacity-25 transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-950">
          <ThemeIcon size={56} radius="md" variant="light" color="gray">
            <FolderKanban size={28} />
          </ThemeIcon>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/10" />

      <div className="absolute right-3 top-3 z-10 flex gap-2">
        {project.isFeatured && (
          <Badge
            size="xs"
            radius="xl"
            color="yellow"
            variant="filled"
          >
            Featured
          </Badge>
        )}

        {isRecent && (
          <Badge
            size="xs"
            radius="xl"
            color="teal"
            variant="filled"
          >
            New
          </Badge>
        )}
      </div>

      <Link
        to="/projects/$slug"
        params={{ slug: project?.slug! }}
        className="relative z-10 flex min-h-[260px] flex-1 flex-col justify-end p-4 no-underline sm:min-h-[300px]"
      >
        <div className="flex min-w-0 flex-col gap-3">
          <h3 className="truncate text-lg font-semibold text-white">{project.title}</h3>

          <p className="line-clamp-2 text-sm leading-6 text-slate-200">
            {project.description}
          </p>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={12} className="shrink-0 text-slate-300" />
              <span className="text-xs text-slate-300">
                Added {moment(project.createdAt).format("D MMMM YYYY")}
              </span>
            </div>

            {moment(project.updatedAt).diff(moment(project.createdAt), 'hours') > 24 && (
              <div className="flex items-center gap-1.5">
                <RefreshCw size={12} className="shrink-0 text-slate-300" />
                <span className="text-xs text-slate-300">
                  Updated {moment(project.updatedAt).fromNow()}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="relative z-10 flex gap-2 p-4 pt-0">
        {project.githubUrl && (
          <Button
            component="a"
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            radius="md"
            variant="white"
            color="dark"
            size="sm"
            leftSection={<Github size={14} />}
            className="flex-1"
          >
            Source Code
          </Button>
        )}

        {project.liveUrl && (
          <Button
            component="a"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            radius="md"
            variant="filled"
            color="green"
            size="sm"
            leftSection={<ExternalLink size={14} />}
            className="flex-1"
          >
            Live Site
          </Button>
        )}
      </div>
    </Card>
  )
}