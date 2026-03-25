// queries/admin.queries.ts
import { queryOptions } from "@tanstack/react-query"
import {
  getAdminStats,
  getAdminProjects,
  getAdminBlogs,
  getAdminUsers,
} from "@/server/admin.functions"

export const adminStatsQueryOptions = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => getAdminStats(),
})

export const adminProjectsQueryOptions = queryOptions({
  queryKey: ["admin", "projects"],
  queryFn: () => getAdminProjects(),
})

export const adminBlogsQueryOptions = queryOptions({
  queryKey: ["admin", "articles"],
  queryFn: () => getAdminBlogs(),
})

export const adminUsersQueryOptions = queryOptions({
  queryKey: ["admin", "users"],
  queryFn: () => getAdminUsers(),
})