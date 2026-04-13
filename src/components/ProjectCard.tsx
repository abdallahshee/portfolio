import { Badge, Button, Card, Group, Image, Rating, Stack, ThemeIcon } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { FolderKanban } from 'lucide-react'


interface ProjectCardItem {
    averageRating: number;
    totalRatings: number;
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    isPublic: boolean;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ProjectCardProps {
    project: ProjectCardItem
}
export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <Card
            key={project.id}
            shadow="sm"
            padding="md"
            radius="lg"
            withBorder
            className="flex h-full min-w-0 cursor-pointer flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >
            <Stack gap="sm" className="min-w-0">
                <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    {project.imageUrl ? (
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
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

                <div className="title3">{project.title}</div>

                <Group gap="xs">
                    <Rating value={project.averageRating} fractions={2} readOnly size="sm" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {project.averageRating > 0
                            ? `${project.averageRating} (${project.totalRatings})`
                            : 'No ratings yet'}
                    </span>
                </Group>

                <Group gap="sm">
                    <Badge
                        color={project.isPublic ? 'blue' : 'green'}
                        variant="light"
                        size="sm"
                        radius="md"
                        className="w-fit"
                    >
                        {project.isPublic ? 'Open Source' : 'Private Project'}
                    </Badge>
                </Group>

                <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                    {project.description}
                </p>

            </Stack>

            <Stack mt="md" gap="xs">
                <Link to="/projects/$projectId" params={{projectId:project.id}} className="no-underline">
                    <Button
                        radius="md"
                        leftSection={<FolderKanban size={16} />}
                        variant="gradient"
                        fullWidth
                        color="blue"
                    >
                        View Project Details
                    </Button>
                </Link>
            </Stack>
        </Card>
    )
}
