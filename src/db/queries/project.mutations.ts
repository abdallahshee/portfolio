import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject, updateProject } from "@/server/project.functions"
import { getPaginatedProjectsQueryOptions, getProjectBySlugQueryOptions } from "../queries/project.queries"
import type { ProjectRequest, UpdateProjectRequest } from "../validations/project.types"


export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient()
  // const router = useRouter()

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) => updateProject({ data }),
    onSuccess: async (_, variables) => {
      // ✅ Wait for fresh data then navigate
      await queryClient.refetchQueries({
        queryKey: getProjectBySlugQueryOptions(variables.slug).queryKey,
      })
    },
  })
}

export const useProjectCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProjectRequest) => createProject({ data }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: getPaginatedProjectsQueryOptions(1).queryKey })
    },
    onError: (err) => {
      console.error("Mutation error:", err) // 👈 add this to see what's failing
    },
  })
}