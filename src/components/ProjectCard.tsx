import type { Project } from '@/db/validations/project.types'
import { Badge, Button, Card, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core'
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
      {/* Background image / fallback */}
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

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/10" />

      {isRecent && (
        <div className="absolute right-3 top-3 z-10">
          <Badge size="xs" radius="xl" color="teal" variant="filled">
            New
          </Badge>
        </div>
      )}

      {/* Content on top of image */}
      <Link
        to="/projects/$slug"
        params={{ slug: project?.slug! }}
        className="relative z-10 flex min-h-[300px] flex-1 flex-col justify-end p-4 no-underline"
      >
        <Stack gap="sm" className="min-w-0">
          {/* Title */}
          <div className="title3 truncate text-white">{project.title}</div>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-6 text-slate-200">
            {project.description}
          </p>

          {/* dates */}
          <Stack gap={4}>
            <Group gap={6}>
              <CalendarDays size={12} className="text-slate-300" />
              <Text size="xs" className="text-slate-300">
                Added {moment(project.createdAt).format("D MMMM YYYY")}
              </Text>
            </Group>

            {moment(project.updatedAt).diff(moment(project.createdAt), 'hours') > 24 && (
              <Group gap={6}>
                <RefreshCw size={12} className="text-slate-300" />
                <Text size="xs" className="text-slate-300">
                  Updated {moment(project.updatedAt).fromNow()}
                </Text>
              </Group>
            )}
          </Stack>
        </Stack>
      </Link>

      {/* CTA */}
      <div className="relative z-10 p-4 pt-0">
        <Group gap="xs" grow>
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
        </Group>
      </div>
    </Card>
  )
}