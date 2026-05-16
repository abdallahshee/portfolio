import type { Project } from '@/db/validations/project.types'
import { Badge, Button, Card, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { CalendarDays, FolderKanban, RefreshCw } from 'lucide-react'
import moment from 'moment'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const isRecent = moment().diff(moment(project.createdAt), 'days') <= 30

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="lg"
      withBorder
      className="flex h-full min-w-0 cursor-pointer flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <Stack gap="sm" className="min-w-0">

        {/* Image */}
        <div className="relative flex h-[180px] items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title ?? "Project image"}
              height={180}
              fit="cover"
              className="h-full w-full transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <ThemeIcon size={56} radius="md" variant="light" color="gray">
              <FolderKanban size={28} />
            </ThemeIcon>
          )}

          {/* 👇 recent badge overlaid on image */}
          {isRecent && (
            <div className="absolute right-2 top-2">
              <Badge size="xs" radius="xl" color="teal" variant="filled">
                New
              </Badge>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="title3 truncate">{project.title}</div>

        {/* Description */}
        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        {/* 👇 dates */}
        <Stack gap={4} mt={4}>
          <Group gap={6}>
            <CalendarDays size={12} className="text-slate-400" />
            <Text size="xs" c="dimmed">
              Added {moment(project.createdAt).fromNow()}
            </Text>
          </Group>

          {/* only show updated if it differs from created by more than a day */}
          {moment(project.updatedAt).diff(moment(project.createdAt), 'hours') > 24 && (
            <Group gap={6}>
              <RefreshCw size={12} className="text-slate-400" />
              <Text size="xs" c="dimmed">
                Updated {moment(project.updatedAt).fromNow()}
              </Text>
            </Group>
          )}
        </Stack>

      </Stack>

      {/* CTA */}
      <Stack mt="md" gap="xs">
        {project.slug && (
          <Link
            to="/projects/$slug/details"
            params={{ slug: project.slug }}
            className="no-underline"
          >
            <Button
              radius="md"
              leftSection={<FolderKanban size={16} />}
              variant="gradient"
              fullWidth
              gradient={{ from: 'indigo', to: 'blue' }}
            >
              View details
            </Button>
          </Link>
        )}
      </Stack>
    </Card>
  )
}