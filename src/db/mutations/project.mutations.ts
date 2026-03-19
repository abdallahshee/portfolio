// export const updateProjectQueryOptions = (project: UpdateProject) => queryOptions({
//   queryKey: ["updateProject", project.projectId],
//   queryFn: () => updateProject({ data: project })
// })

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateProject } from "../schema"
import { updateProject } from "@/server/project.functions"
import { useRouter } from "@tanstack/react-router"
import { getProjectByIdQueryOptions } from "../queries/project.queries"

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (project: UpdateProject) => updateProject({ data: project }),
    onSuccess: async (data, variables) => {
      // ✅ Wait for fresh data then navigate
      await queryClient.refetchQueries({
        queryKey: getProjectByIdQueryOptions(variables.projectId).queryKey,
      })

      await router.navigate({
        to: "/projects/$id/details",
        params: { id: variables.projectId },
      })

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })
}