import { getPaginatedProjects, getProjectBySlugName, getTopProjects, searchProjects } from "@/server/project.functions"
import { getCurrentUser } from "@/server/user.functions"
import { queryOptions } from "@tanstack/react-query"

//Geting all projects


export const getProjectBySlugNameQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId],
    queryFn: () => getProjectBySlugName({ data: { projectId: projectId } }),
  })

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


export const getCurrentUserQueryOptions = () =>
  queryOptions({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 mins (avoid refetch spam)
    retry: false, // ❗ prevents infinite retries when not logged in
  })