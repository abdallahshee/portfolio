'use client'

import { ProjectCard } from '@/components/ProjectCard'
import type { Project } from '@/server/project.functions'
import { Card, Pagination } from '@mantine/core'
import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'

const PAGE_SIZE = 6

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE))
  const paginated = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="title2">Projects Overview</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
          Each project below represents a real-world problem I set out to solve, from initial concept through
          to a working, deployed solution. Rather than building for the sake of building, I focus on identifying
          genuine pain points — whether in workflow efficiency, data management, or user experience — and
          designing systems that directly address them. Full details, including the technical approach and
          reasoning behind key decisions, are listed below for every project.
        </p>
      </div>



      {paginated.length ? (
        <div className="flex flex-col gap-6">
          {paginated.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card radius="xl" padding="xl" withBorder className="w-full border-dashed">
          <div className="flex justify-center py-10">
            <LayoutGrid size={40} className="text-slate-400" />
          </div>
          <p className="text-center text-slate-500">No projects found</p>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination value={page} onChange={setPage} total={totalPages} radius="xl" />
        </div>
      )}
    </div>
  )
}
