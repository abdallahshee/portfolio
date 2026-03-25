import { getAllArticles, getArticleBySlug, getArticleBySlugdForUpdate, getMyArticles, getMyPaginatedArticles, getPaginatedArticles, getTopArticles, searchArticles } from "@/server/article.functions";
import { queryOptions } from "@tanstack/react-query";

export const getAllArticlesQueryOptions = () => queryOptions({
    queryKey: ["blogs"],
    queryFn: () => getAllArticles()
})

export const getTopArticlesQueryOptions = () => queryOptions({
    queryKey: ["top5blogs"],
    queryFn: () => getTopArticles()
})

export const getPaginatedArticlesQueryOptions = (page: number, limit = 6) =>
    queryOptions({
        queryKey: ['blogs', page, limit],
        queryFn: () =>
            getPaginatedArticles({
                data: { page, limit },
            }),
    })

export const getArticleBySlugQueryOptions = (slug: string) => queryOptions({
    queryKey: ["blogs", slug],
    queryFn: () => getArticleBySlug({ data: { slug } })
})

export const getArticleBySlugForUpdateQueryOptions = (slug: string) => queryOptions({
    queryKey: ["blogsUpdate", slug],
    queryFn: () => getArticleBySlugdForUpdate({ data: { slug } })
})
export const searchArticlesQueryOptions = (
    query: string,
    page: number,
    pageSize = 6
) =>
    queryOptions({
        queryKey: ["articles", "search", query, page, pageSize],
        queryFn: () => searchArticles({ data: { query, page, pageSize } }),
        placeholderData: (prev) => prev,
    })

export const getMyPaginatedBlogsQueryOptions = (userId:string,page: number, limit = 6) =>
    queryOptions({
        queryKey: ['articles', userId,page, limit],
        queryFn: () =>
            getMyPaginatedArticles({
                data: {page, limit},
            }),
    })




    