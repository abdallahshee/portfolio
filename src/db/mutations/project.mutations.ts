import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject, updateProject } from "@/server/project.functions"
import { useRouter } from "@tanstack/react-router"
import { getAllProjectsQueryOptions, getProjectByIdQueryOptions } from "../queries/project.queries"
import type { ProjectRequest, UpdateProjectRequest } from "../validations/project.types"


export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (project: UpdateProjectRequest) => updateProject({ data: project }),
    onSuccess: async (data, variables) => {
      // ✅ Wait for fresh data then navigate
      await queryClient.refetchQueries({
        queryKey: getProjectByIdQueryOptions(variables.projectId).queryKey,
      })

      await router.navigate({
        to: "/projects/$id",
        params: { id: variables.projectId },
      })

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })
}

export const useProjectCreateMutation=()=>{
  const queryClient=useQueryClient()
  const router=useRouter()
  return useMutation({
    mutationFn:(request:ProjectRequest)=>createProject({data:request}),
    onSuccess:async(data) =>{
      await queryClient.refetchQueries({queryKey:getAllProjectsQueryOptions(1).queryKey})
      await router.navigate({to:"/projects/$id", params:{id:data.projectId!}})
    },
  })
}