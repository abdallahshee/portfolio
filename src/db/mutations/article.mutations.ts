import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createArticle, updateArticle } from '@/server/article.functions'
import { useRouter } from '@tanstack/react-router'
import { getAllArticlesQueryOptions, getArticleBySlugQueryOptions } from '../queries/article.queries'
import type { Role } from '../validations/user.types'
import type { ArticleRequest, ArticleUpdateRequest } from '../validations/article.types'

export const articleUpdateMutationOption = (role: Role) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (form: ArticleUpdateRequest) => updateArticle({
            data: {...form }
        }),
        onSuccess: async (_, variables) => {
            await queryClient.refetchQueries({
                queryKey: getAllArticlesQueryOptions().queryKey,
            })

            if (role.role ==="admin" ) {
                await router.navigate({
                    to: "/admin/articles/$slug",
                    params: { slug: variables.slug },
                })
            } else {
                await router.navigate({
                    to: "/articles/$slug",
                    params: { slug: variables.slug },
                })
            }
        },
    })
}



export const useBlogCreateMutation = (role: Role) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (form: ArticleRequest) =>
            createArticle({ data: form }),
        onSuccess: async (data) => {
            queryClient.setQueryData(getArticleBySlugQueryOptions(data.slug).queryKey, {
                ...data,
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

