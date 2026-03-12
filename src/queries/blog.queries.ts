import { getAllBlogs, getTopBlogs } from "@/server/blog.functions";
import { queryOptions } from "@tanstack/react-query";

export const getAllBlogsQueryOptions=()=>queryOptions({
    queryKey:["blogs"],
    queryFn:()=>getAllBlogs()
})

export const getTopBlogsQueryOptions=()=>queryOptions({
    queryKey:["Top5bLOGS"],
    queryFn:()=>getTopBlogs()
})