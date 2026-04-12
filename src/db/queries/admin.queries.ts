// queries/admin.queries.ts
import { queryOptions } from "@tanstack/react-query"
import {getAdminStats, getAuthUserById} from "@/server/admin.functions"

export const adminStatsQueryOptions = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => getAdminStats(),
})


export const getAuthUserByIdQueryOptions=(data:{userId:string})=>queryOptions({
  queryKey:['authUsers',data],
  queryFn:()=>getAuthUserById({data})
})


