import { useRouter } from "@tanstack/react-router"
import {
    Badge,
    Button,
    Group,
    Image,
    Paper,
    SimpleGrid,
    Stack,
    ThemeIcon,
} from '@mantine/core'
import {

    BookOpen,
    BriefcaseBusiness,
    ExternalLink,
    FolderKanban,
    Github,
    Star,
} from 'lucide-react'
import { Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getTopFeaturedProjectsQueryOptions } from "@/db/queries/project.queries"
function ProjectsPlaceholder() {
    return (
        <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
            <Stack gap="md">
                <div>
                    <div className="title3">Featured Projects</div>
                    <p className="text-sm text-slate-500">A selection of standout builds</p>
                </div>

                <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                    <ThemeIcon size={56} radius="md" variant="light" color="gray">
                        <BookOpen size={28} />
                    </ThemeIcon>
                    <div className="title2 text-slate-400 dark:text-slate-500">
                        Projects coming soon
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        Featured projects will be added here shortly
                    </p>
                    <Link to="/skills">
                        <Button size="sm" variant="light" leftSection={<BriefcaseBusiness size={16} />}>
                            See My Skills & Approach
                        </Button>
                    </Link>
                </div>
            </Stack>
        </Paper>
    )
}




export const FeaturedProjectsSection = () => {
    const { data: projects } = useSuspenseQuery(getTopFeaturedProjectsQueryOptions())
    const router = useRouter()

    const isEmpty = !projects || projects.length === 0

    if (isEmpty) return <ProjectsPlaceholder />

    return (
        <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
            <Stack gap="md">
                <Group justify="space-between" align="flex-start" wrap="wrap">
                    <div className="min-w-0 flex-1">
                        <div className="title2">Featured Projects</div>
                        <p className="mt-1 text-sm text-slate-500">
                            A curated selection of projects I have built and shipped — each one
                            reflecting my approach to writing clean, maintainable, and
                            production-ready software.
                        </p>
                    </div>
                </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() =>
                                project.slug &&
                                router.navigate({
                                    to: '/projects/$slug',
                                    params: { slug: project.slug },
                                })
                            }
                            className="group relative h-[240px] cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Background image / fallback */}
                            {project.imageUrl ? (
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title ?? "Project image"}
                                    fit="cover"
                                    className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-950">
                                    <ThemeIcon size={56} radius="md" variant="light" color="gray">
                                        <FolderKanban size={28} />
                                    </ThemeIcon>
                                </div>
                            )}

                            {/* Gradient overlay for text legibility */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                            {/* Featured badge */}
                            <Badge
                                size="sm"
                                radius="xl"
                                variant="filled"
                                color="yellow"
                                leftSection={<Star size={11} />}
                                className="absolute right-3 top-3 z-10"
                            >
                                Featured
                            </Badge>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-4">
                                <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                                    {project.title}
                                </h3>

                                <Group gap="xs">
                                    {project.githubUrl && (
                                        <Button
                                            component="a"
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="white"
                                            color="dark"
                                            size="xs"
                                            radius="xl"
                                            leftSection={<Github size={13} />}
                                            onClick={(e) => e.stopPropagation()}
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
                                            variant="filled"
                                            color="green"
                                            size="xs"
                                            radius="xl"
                                            leftSection={<ExternalLink size={13} />}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Live Site
                                        </Button>
                                    )}
                                </Group>
                            </div>
                        </div>
                    ))}
                </SimpleGrid>
            </Stack>
        </Paper>
    )
}