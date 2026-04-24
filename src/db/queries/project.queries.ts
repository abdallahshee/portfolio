import { getPaginatedProjects, getProjectBySlugName, getTopProjects, searchProjects } from "@/server/project.functions"
import { getUserAndRole } from "@/server/user.functions"
import { queryOptions } from "@tanstack/react-query"

//Geting all projects


export const getProjectBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['projects', slug],
    queryFn: () => getProjectBySlugName({ data: { slug } }),
  })


// export const getProjectByIdQueryOptions = (projectId: string) =>
//   queryOptions({
//     queryKey: ['projects', projectId],
//     queryFn: () => getProjectById({ data: { projectId: projectId } }),
//   })

export const getTopProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ['top5Projects'],
    queryFn: () => getTopProjects(),
  })


export const getPaginatedProjectsQueryOptions = (page: number, pageSize = 6) =>
  queryOptions({
    queryKey: ['projects', 'paginated', page, pageSize] as (string | number)[],
    queryFn: () => getPaginatedProjects({ data: { page, pageSize } }),
  })

export const searchProjectsQueryOptions = (query: string, page: number, pageSize = 6) =>
  queryOptions({
    queryKey: ['projects', 'search', query, page, pageSize] as (string | number)[],
    queryFn: () => searchProjects({ data: { query, page, pageSize } }),
  })


export const getUserAndRoleQueryOptions = () =>
  queryOptions({
    queryKey: ["currentUser"],
    queryFn: () => getUserAndRole(),
    staleTime: 1000 * 60 * 5, // 5 mins (avoid refetch spam)
    retry: false, // ❗ prevents infinite retries when not logged in
  })