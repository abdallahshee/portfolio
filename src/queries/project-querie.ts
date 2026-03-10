import { getAllProjects, getProjectById, getTop3Projects, updateProject, updateProjectSchema } from "@/server/project.functions"
import { queryOptions } from "@tanstack/react-query"
import zod from "zod"
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

  export type UpdateProject = zod.infer<typeof updateProjectSchema>
  
  export const updateProjectQueryOptions=(project:UpdateProject)=>queryOptions({
    queryKey:["updateProject",project.projectId],
    queryFn:()=>updateProject({data:project})
  })

  export const getTopProjectsQueryOptions = (limit:number) =>
  queryOptions({
    queryKey: ['top5Projects'],
    queryFn: () => getTop3Projects({data:{limit}}),
  })
  
  