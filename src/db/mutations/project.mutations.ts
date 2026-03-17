// export const updateProjectQueryOptions = (project: UpdateProject) => queryOptions({
//   queryKey: ["updateProject", project.projectId],
//   queryFn: () => updateProject({ data: project })
// })

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdateProject } from "../schema"
import { updateProject } from "@/server/project.functions"

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (project: UpdateProject) => updateProject({ data: project }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] })
    },
  })
}