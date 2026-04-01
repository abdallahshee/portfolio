// queries/admin.queries.ts
import { queryOptions } from "@tanstack/react-query"
import {
  getAdminStats,

} from "@/server/admin.functions"

export const adminStatsQueryOptions = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => getAdminStats(),
})





