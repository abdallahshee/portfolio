import { mutationOptions } from "@tanstack/react-query"
import { rateProject } from "@/server/project-rating.functions"

export const rateProjectMutationOptions = () =>
  mutationOptions({
    mutationFn: async (data: { projectId: string; rating: number }) => {
      return await rateProject({ data })
    },
  })