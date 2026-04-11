import { getAllArticles, getArticleBySlug, getMyPaginatedArticles, getPaginatedArticles, getTopArticles, searchPaginatedArticles } from "@/server/article.functions";
import { queryOptions } from "@tanstack/react-query";
import type { MyPaginatedArticleRequest } from "../validations/article.types";

export const getAllArticlesQueryOptions = () => queryOptions({
    queryKey: ["articles"],
    queryFn: () => getAllArticles()
})

export const getTopArticlesQueryOptions = () => queryOptions({
    queryKey: ["topArticles"],
    queryFn: () => getTopArticles()
})

export const getPaginatedArticlesQueryOptions = (page: number, limit = 6) =>
    queryOptions({
        queryKey: ['articles', page, limit],
        queryFn: () =>getPaginatedArticles({data: { page, limit }, }),
    })

export const getArticleBySlugQueryOptions = (slug: string) => queryOptions({
    queryKey: ["articles", slug],
    queryFn: () => getArticleBySlug({ data: { slug } })
})


export const searchArticlesQueryOptions = (
    query: string,
    page: number,
    pageSize = 6
) =>
    queryOptions({
        queryKey: ["articles", "search", query, page, pageSize],
        queryFn: () => searchPaginatedArticles({ data: { query, page, pageSize } }),
        placeholderData: (prev) => prev,
    })

export const getMyPaginatedArticlesQueryOptions = (data: MyPaginatedArticleRequest) =>
    queryOptions({
        queryKey: ['articles', data.page, data.limit],
        queryFn: () => getMyPaginatedArticles({ data }),
    })




