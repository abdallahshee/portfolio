import { getPaginatedAuthUsers } from "@/server/admin.functions";
import { getAuthUser, getCurrentUser, getUserById } from "@/server/users.functions";
import { queryOptions } from "@tanstack/react-query";

export const getPaginatedAuthUsersQueryOptions = (
  page: number = 1,
  pageSize: number = 6,
  search: string = ''
) =>
  queryOptions({
    queryKey: ['users', page, pageSize, search], // ✅ search in key
    queryFn: () => getPaginatedAuthUsers({ data: { page, pageSize, search } }),
  })

  export const getUserByIdQueryOptions=(userId:string)=>queryOptions({
    queryKey:["users",userId],
    queryFn:()=>getUserById({data:{userId}})
  })


  export const getAuthUserQueryOptions=()=>queryOptions({
    queryKey:["authUser"],
    queryFn:()=>getAuthUser()
  })

  export const getCurrentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['current-user'],
    queryFn: () => getCurrentUser(),
    retry: false, // optional: avoid retry loops if not authenticated
  })