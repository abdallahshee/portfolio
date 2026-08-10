import { Suspense } from 'react'
import { Paper, SimpleGrid } from '@mantine/core'
import HomeContent from '@/components/HomeContent'
import { FeaturedProjectsSection } from '@/components/FeaturedProjects'

function ProjectsSkeleton() {
  return (
    <Paper withBorder radius="lg" className="min-w-0 p-3 sm:p-4">
      <div className="flex flex-col gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative h-[220px] overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-[240px]"
            >
              {/* Image placeholder */}
              <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />

              {/* Featured badge */}
              <div className="absolute right-3 top-3 z-10 h-6 w-20 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />

              {/* Content area */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-4">
                {/* Title */}
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />

                {/* Buttons */}
                <div className="flex gap-2">
                  <div className="h-8 w-28 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
              </div>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </Paper>
  )
}

export default function Page() {
  return (
    <HomeContent>
      <Suspense fallback={<ProjectsSkeleton />}>
        <FeaturedProjectsSection />
      </Suspense>
    </HomeContent>
  )
}
