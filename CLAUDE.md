@AGENTS.md

# Project Context

This is a personal portfolio site built with Next.js (App Router), React 19, TypeScript, Tailwind CSS, and Mantine UI.

There is no backend, database, or ORM — no Supabase, no Drizzle, no TanStack Query/Start. All project data is static, typed data defined in `data/data.ts`. It's read through server functions in `src/server/project.functions.ts` (`getAllProjects`), which the app pages call directly.

To add, edit, or remove a project, change the array in `data/data.ts` — no migrations, seeding, or API routes involved.
