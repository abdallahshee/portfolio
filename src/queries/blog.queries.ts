import { getAllBlogs, getBlogBySlug, getBlogBySlugdForUpdate, getPaginatedBlogs, getTopBlogs, searchBlogs } from "@/server/blog.functions";
import { queryOptions } from "@tanstack/react-query";

export const getAllBlogsQueryOptions = () => queryOptions({
    queryKey: ["blogs"],
    queryFn: () => getAllBlogs()
})

export const getTopBlogsQueryOptions = () => queryOptions({
    queryKey: ["top5blogs"],
    queryFn: () => getTopBlogs()
})

export const getPaginatedBlogsQueryOptions = (page: number, limit = 6) =>
    queryOptions({
        queryKey: ['blogs', page, limit],
        queryFn: () =>
            getPaginatedBlogs({
                data: { page, limit },
            }),
    })

export const getBlogBySlugQueryOptions = (slug: string) => queryOptions({
    queryKey: ["blogs", slug],
    queryFn: () => getBlogBySlug({ data: { slug } })
})

export const getBlogBySlugForUpdateQueryOptions = (slug: string) => queryOptions({
    queryKey: ["blogsUpdate", slug],
    queryFn: () => getBlogBySlugdForUpdate({ data: { slug } })
})
export const searchBlogsQueryOptions = (
  query: string,
  page: number,
  pageSize = 6
) =>
  queryOptions({
    queryKey: ["blogs", "search", query, page, pageSize],
    queryFn: () => searchBlogs({ data: { query, page, pageSize } }),
    placeholderData: (prev) => prev,
  })
