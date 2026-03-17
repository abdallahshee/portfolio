import {  useMutation, useQueryClient } from "@tanstack/react-query"
import { rateProject } from "@/server/project-rating.functions"
import { getProjectByIdQueryOptions } from "../queries/project.queries"

export const useRateProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { projectId: string; rating: number }) => {
      return await rateProject({ data })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryOptions(variables.projectId).queryKey,
      })
    },
  })
}