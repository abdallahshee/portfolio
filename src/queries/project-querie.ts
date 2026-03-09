import { getAllProjects, getProjectById } from "@/server/project.functions"
import { queryOptions } from "@tanstack/react-query"
//Geting all projects
export const getProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ['projects'],
    queryFn: () => getAllProjects(),
  })

  export const getProjectByIdQueryOptions = (projectId:string) =>
  queryOptions({
    queryKey: ['projects',projectId],
    queryFn: () => getProjectById({data:{projectId:projectId}}),
  })