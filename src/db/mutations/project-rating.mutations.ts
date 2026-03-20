import {  useMutation, useQueryClient } from "@tanstack/react-query"
import { rateProject } from "@/server/project-rating.functions"
import { getProjectByIdQueryOptions } from "../queries/project.queries"

export const useRateProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn:(data: { projectId: string; rating: number }) => rateProject({ data }),
     
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getProjectByIdQueryOptions(variables.projectId).queryKey,
      })
    },
  })
}