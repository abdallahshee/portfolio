import type { Project } from '@/db/validations/project.types'
import { Button, Card, Image, Stack, ThemeIcon } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { FolderKanban } from 'lucide-react'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
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
        <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
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
        </div>

        {/* Title */}
        <div className="title3 truncate">{project.title}</div>

        {/* Description */}
        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

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
              View details ger
            </Button>
          </Link>
        )}
      </Stack>
    </Card>
  )
}