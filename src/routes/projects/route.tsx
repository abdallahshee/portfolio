// routes/projects/route.tsx
import { ProjectList } from "@/components/ProjectList"
import { getAllProjectsQueryOptions } from "@/db/queries/project.queries"
import { Button } from "@mantine/core"
import { createFileRoute, Link, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/projects")({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      getAllProjectsQueryOptions()
    )
    return data
  },
  component: ProjectsLayout,
})

function ProjectsLayout() {
  const { projects } = Route.useLoaderData()

  return (
    <div className="space-y-8 py-6">
      {/* Main Content */}
      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:gap-8
          lg:grid-cols-[1.6fr_1fr]
          lg:items-start
          xl:grid-cols-[1.8fr_1fr]
        "
      >
        {/* Projects List */}
        <div className="min-w-0">
          <ProjectList projects={projects} />
        </div>

        {/* Details Panel */}
        <div
          className="
            min-w-0
            lg:sticky
            lg:top-6
            lg:max-h-[calc(100vh-3rem)]
            lg:overflow-y-auto
            lg:pr-2
          "
        >
          <Outlet />
        </div>
      </div>

      {/* CTA Section */}
      <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-50 via-blue-50 to-cyan-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900/40 dark:via-slate-800/40 dark:to-slate-900/40 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="title3 bg-linear-to-r from-teal-500 via-indigo-500 to-blue-500 bg-clip-text text-center text-transparent">
            Interested in Working Together?
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
            These projects showcase my experience building modern web
            applications using React, Next.js, TypeScript, Node.js, PostgreSQL,
            Supabase, and cloud technologies. If you're looking for a developer
            to join your team or help bring an idea to life, I'd love to hear
            from you.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/connect"
              className="w-full sm:w-[220px]"
            >
              <Button
                size="md"
                radius="md"
                color="orange"
                fullWidth
              >
                Let's Connect
              </Button>
            </Link>

            <div className="w-full sm:w-[220px]">
              <Button
                component="a"
                href="https://github.com/abdallahshee"
                target="_blank"
                variant="outline"
                color="dark"
                radius="md"
                size="md"
                fullWidth
              >
                View GitHub Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}