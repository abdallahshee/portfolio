import { getAllBlogs, getBlogBySlug, getPaginatedBlogs, getTopBlogs } from "@/server/blog.functions";
import { queryOptions } from "@tanstack/react-query";

export const getAllBlogsQueryOptions=()=>queryOptions({
    queryKey:["blogs"],
    queryFn:()=>getAllBlogs()
})

export const getTopBlogsQueryOptions=()=>queryOptions({
    queryKey:["top5blogs"],
    queryFn:()=>getTopBlogs()
})

export const getPaginatedBlogsQueryOptions = (page: number, limit = 6) =>
  queryOptions({
    queryKey: ['blogs', page, limit],
    queryFn: () =>
      getPaginatedBlogs({
        data: { page, limit },
      }),
  })

  export const getBlogBySlugQueryOptions=(slug:string)=>queryOptions({
    queryKey:["blogs", slug],
    queryFn:()=>getBlogBySlug({data:{slug}})
  })

 