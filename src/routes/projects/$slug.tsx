import { Button, Card, Divider, Image, Badge, ThemeIcon, Skeleton } from "@mantine/core"

import {
  ArrowLeft,
  CalendarDays,
  Globe,
  RefreshCw,
  Star,
  Github,
  Code2,
  ListChecks,
  CheckCircle2,
  User,
  Users,
  FolderKanban,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { createFileRoute, Link } from "@tanstack/react-router"
import { getProjectBySlugQueryOptions } from "@/db/queries/project.queries"
import moment from "moment"


export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      getProjectBySlugQueryOptions(params.slug)
    )
    return data
  },
  pendingComponent: DetailsSkeleton,
  component: ProjectDetails,
})

function DetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card withBorder radius="sm" p="xl">
        <Skeleton height={28} width="60%" mb="sm" />
        <Skeleton height={16} width="40%" />
      </Card>
      <Skeleton height={300} radius="lg" />
      <Card withBorder p="lg">
        <Skeleton height={16} mb="xs" />
        <Skeleton height={16} width="80%" />
      </Card>
    </div>
  )
}

function ProjectDetails() {
  const project = Route.useLoaderData()!
  const technologies = project?.technologies ?? []
  const roles = project?.roles ?? []
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth < 1024) { // below Tailwind's `lg` breakpoint
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [project?.slug]) // re-run when a different project is selected

  return (
    <div
      ref={containerRef}
      className="flex min-h-full flex-col gap-6 py-6 sm:py-8"
    >
      {/* IMAGE */}
      <Card radius="xl" withBorder p="xs" className="overflow-hidden shadow-sm">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title ?? "Project image"}
            radius="lg"
            fit="cover"
            className="h-[200px] sm:h-[280px] lg:h-[320px]"
          />
        ) : (
          <div className="flex h-[200px] sm:h-[280px] flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FolderKanban size={32} />
            <span className="text-sm">No image available</span>
          </div>
        )}
      </Card>

      {/* HEADER */}
      <Card radius="lg" withBorder p="lg" className="shadow-sm">
        <div className="flex flex-col gap-4">
          {/* TITLE + BACK */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
                {project?.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">

                {project?.isContributor ? (
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

            <Link to="/projects" className="shrink-0">
              <Button variant="light" radius="md" size="sm" leftSection={<ArrowLeft size={16} />}>
                Back
              </Button>
            </Link>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            {project.description}
          </p>

          <Divider />

          {/* DATES */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <ThemeIcon variant="light" color="gray" radius="xl" size="lg">
                <CalendarDays size={16} />
              </ThemeIcon>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {moment(project.createdAt).format("D MMMM YYYY")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeIcon variant="light" color="gray" radius="xl" size="lg">
                <RefreshCw size={16} />
              </ThemeIcon>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Updated</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {moment(project?.updatedAt).fromNow()}
                </p>
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap gap-2">
            {project?.liveUrl ? (
              <Button
                component="a"
                href={project.liveUrl}
                target="_blank"
                radius="md"
                size="sm"
                leftSection={<Globe size={15} />}
                className="grow sm:grow-0"
              >
                Visit live site
              </Button>
            ) : (
              <Button
                radius="md"
                size="sm"
                leftSection={<Globe size={15} />}
                disabled
                variant="light"
                color="gray"
                className="grow sm:grow-0"
              >
                No live site
              </Button>
            )}

            {project?.githubUrl ? (
              <Button
                component="a"
                href={project.githubUrl}
                target="_blank"
                variant="light"
                radius="md"
                size="sm"
                leftSection={<Github size={15} />}
                className="grow sm:grow-0"
              >
                View source
              </Button>
            ) : (
              <Button
                radius="md"
                size="sm"
                leftSection={<Github size={15} />}
                disabled
                variant="light"
                color="gray"
                className="grow sm:grow-0"
              >
                Source is private
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* TECH STACK */}
      <Card radius="lg" withBorder p="lg" className="shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-slate-500" />
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tech stack
            </p>
          </div>

          {technologies.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No technologies listed for this project.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech: string, index: number) => (
                <Badge key={`${tech}-${index}`} radius="xl" variant="light" color="blue">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* MY ROLE */}
      <Card radius="lg" withBorder p="lg" className="shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ListChecks size={16} className="text-slate-500" />
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              My role
            </p>
          </div>

          {roles.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No role details listed for this project.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {roles.map((role: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <ThemeIcon
                    variant="light"
                    color="indigo"
                    radius="xl"
                    size="sm"
                    className="mt-0.5 shrink-0"
                  >
                    <CheckCircle2 size={12} />
                  </ThemeIcon>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {role}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ProjectDetails