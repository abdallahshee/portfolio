import type { Project } from '@/server/project.functions'
import { Badge, Button, Card, Divider, Image } from '@mantine/core'
import {
  CalendarDays,
  Code2,
  ExternalLink,
  FolderKanban,
  Github,
  RefreshCw,
  User,
  Users,
} from 'lucide-react'
import moment from 'moment'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isRecent = moment().diff(moment(project.createdAt), 'days') <= 28
  const technologies = project.technologies ?? []

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      className="w-full"
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* IMAGE */}
        <div className="lg:w-80 lg:shrink-0">
          {project.imageUrl ? (
            <div className="flex h-55 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 lg:h-full">
              <Image
                src={project.imageUrl}
                alt={project.title ?? 'Project image'}
                fit="contain"
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex h-55 w-full flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 lg:h-full">
              <FolderKanban size={32} />
              <span className="text-sm">No image available</span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* TITLE + BADGES */}
          <div className="min-w-0">
            <h3 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-50">
              {project.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {isRecent && (
                <Badge size="sm" radius="xl" color="teal" variant="filled">
                  New
                </Badge>
              )}
              {project.isContributor ? (
                <Badge variant="light" color="grape" radius="md" size="sm" leftSection={<Users size={11} />}>
                  Collaborative Project
                </Badge>
              ) : (
                <Badge variant="light" color="teal" radius="md" size="sm" leftSection={<User size={11} />}>
                  Solo Project
                </Badge>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            {project.description}
          </p>

          {/* DATES */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={13} className="shrink-0" />
              Created {moment(project.createdAt).format('D MMMM YYYY')}
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw size={13} className="shrink-0" />
              Updated {moment(project.updatedAt).fromNow()}
            </div>
          </div>

          {/* TECH STACK */}
          {technologies.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Code2 size={13} />
                Core stack Used
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={`${tech}-${index}`} radius="xl" variant="light" color="blue" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Divider />

          {/* LINKS */}
          <div className="flex flex-wrap gap-2">
            {project.githubUrl && (
              <Button
                component="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                radius="md"
                variant="filled"
                color="blue"
                size="sm"
                leftSection={<Github size={14} />}
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
              >
                Live Site
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
