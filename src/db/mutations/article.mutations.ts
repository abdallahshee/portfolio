import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createArticle, updateArticle } from '@/server/article.functions'
import { useRouter } from '@tanstack/react-router'
import { getAllArticlesQueryOptions, getArticleBySlugQueryOptions } from '../queries/article.queries'
import type { Role } from '../validations/user.types'
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



export const useArticleCreateMutation = (role: Role) => {
    const queryClient = useQueryClient()
    const router = useRouter()

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
            if (role.role ==="admin") {
                await router.navigate({
                    to: "/admin/articles/$slug",
                    params: { slug: data.slug },
                })
            } else {
                await router.navigate({
                    to: "/articles/$slug",
                    params: { slug: data.slug },
                })
            }

        },
    })
}

