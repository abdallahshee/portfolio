import { getAllProjects, getPaginatedProjects, getProjectBySlugName, getTopFeaturedProjects, searchProjects } from "@/server/project.functions"
import { queryOptions } from "@tanstack/react-query"



export const getProjectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['projects', slug],
    queryFn: () => getProjectBySlugName({ data: { slug } }),
       staleTime: 60 * 1000,
  })


// export const getProjectByIdQueryOptions = (projectId: string) =>
//   queryOptions({
//     queryKey: ['projects', projectId],
//     queryFn: () => getProjectById({ data: { projectId: projectId } }),
//   })

export const getAllProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ['projects', 'all'],
    queryFn: () => getAllProjects(),
    staleTime: 60 * 1000,
  })

export const getTopFeaturedProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ['top5Projects'],
    queryFn: () => getTopFeaturedProjects(),
  })


export const getPaginatedProjectsQueryOptions = (page: number, pageSize = 6) =>
  queryOptions({
    queryKey: ['projects', 'paginated', 'v2', page, pageSize] as (string | number | string)[],
    queryFn: () => getPaginatedProjects({ data: { page, pageSize } }),
  })

export const searchProjectsQueryOptions = (query: string, page: number, pageSize = 6) =>
  queryOptions({
    queryKey: ['projects', 'search', 'v2', query, page, pageSize] as (string | number)[],
    queryFn: () => searchProjects({ data: { query, page, pageSize } }),
  })

export const getProjectStatsQueryOptions = () =>
  queryOptions({
    queryKey: ['projects', 'stats'],
    queryFn: async () => {
      const { projects } = await getAllProjects() // ✅ destructure the array out
      const technologies = new Set(
        projects.flatMap((p) => p.technologies ?? [])
      )

      return {
        total: projects.length,
        featured: projects.filter((p) => p.isFeatured).length,
        technologiesCount: technologies.size,
        topTechnologies: [...technologies].slice(0, 10),
      }
    },
  })