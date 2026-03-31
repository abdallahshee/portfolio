// queries/admin.queries.ts
import { queryOptions } from "@tanstack/react-query"
import {
  getAdminStats,
  getAdminProjects,

} from "@/server/admin.functions"

export const adminStatsQueryOptions = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => getAdminStats(),
})

export const adminProjectsQueryOptions = queryOptions({
  queryKey: ["admin", "projects"],
  queryFn: () => getAdminProjects(),
})



