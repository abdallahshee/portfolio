import { getAllUsers, getUserById } from "@/server/users.functions";
import { queryOptions } from "@tanstack/react-query";

export const getAllUsersQueryOptions = (
  page: number = 1,
  pageSize: number = 6,
  search: string = ''
) =>
  queryOptions({
    queryKey: ['users', page, pageSize, search], // ✅ search in key
    queryFn: () => getAllUsers({ data: { page, pageSize, search } }),
  })

  export const getUserByIdQueryOptions=(userId:string)=>queryOptions({
    queryKey:["users",userId],
    queryFn:()=>getUserById({data:{userId}})
  })