import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject, updateProject } from "@/server/project.functions"
import { getPaginatedProjectsQueryOptions, getProjectByIdQueryOptions } from "../queries/project.queries"
import type { ProjectRequest, UpdateProjectRequest } from "../validations/project.types"


export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient()
  // const router = useRouter()

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) => updateProject({ data}),
    onSuccess: async (data, variables) => {
      // ✅ Wait for fresh data then navigate
      await queryClient.refetchQueries({
        queryKey: getProjectByIdQueryOptions(variables.projectId).queryKey,
      })
      // await router.navigate({
      //   to: "/projects/$projectId",
      //   params: { projectId: variables.projectId },
      // })

      // window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })
}

export const useProjectCreateMutation=()=>{
  const queryClient=useQueryClient()
  // const router=useRouter()
  return useMutation({
    mutationFn:(data:ProjectRequest)=>createProject({data}),
    onSuccess:async() =>{
      await queryClient.refetchQueries({queryKey:getPaginatedProjectsQueryOptions(1).queryKey})
      // await router.navigate({to:"/projects/$id", params:{id:data.projectId!}})
    },
  })
}