import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createArticle, updateArticle } from '@/server/article.functions'
import { getAllArticlesQueryOptions, getArticleBySlugQueryOptions } from '../queries/article.queries'
import type { ArticleRequest, ArticleUpdateRequest } from '../validations/article.types'

export const useArticleUpdateMutationOption = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ArticleUpdateRequest) => updateArticle({data}),
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: getAllArticlesQueryOptions().queryKey,
            })
        },
    })
}



export const useArticleCreateMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: ArticleRequest) =>createArticle({ data }),
        onSuccess: async (data) => {
            queryClient.setQueryData(getArticleBySlugQueryOptions(data.slug).queryKey, {
                ...data,
                articleId:data.id,
                likes: 0,
                likedByUser: false,
                comments: [],
                authorId: data.userId,
                authorName: null,
                authorImage: null,
                categoryName: null
            })
            await queryClient.invalidateQueries({ queryKey: getAllArticlesQueryOptions().queryKey })
            
        },
    })
}

