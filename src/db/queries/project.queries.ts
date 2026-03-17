import { getAllProjects, getProjectById, getTopProjects, searchProjects } from "@/server/project.functions"
import { queryOptions } from "@tanstack/react-query"

//Geting all projects
export const getProjectsQueryOptions = (page: number, pageSize = 6) =>
  queryOptions({
    queryKey: ['projects', page, pageSize],
    queryFn: () => getAllProjects({ data: { page, pageSize } }),
  })

export const getProjectByIdQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId],
    queryFn: () => getProjectById({ data: { projectId: projectId } }),
  })


export const getTopProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ['top5Projects'],
    queryFn: () => getTopProjects(),
  })

export const searchProjectsQueryOptions = (
  query: string,
  page: number,
  pageSize = 6
) =>
  queryOptions({
    queryKey: ["projects", "search", query, page, pageSize],
    queryFn: () => searchProjects({ data: { query, page, pageSize } }),
    placeholderData: (prev) => prev,
  })