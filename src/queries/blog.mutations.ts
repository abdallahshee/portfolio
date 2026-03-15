import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '@/server/comment.functions'
import { updateBlog } from '@/server/blog.functions'
import { useRouter } from '@tanstack/react-router'
import type { BlogUpdateForm } from '@/db/blog.schema'

interface CreateCommentInput {
    blogId: string
    slug: string
    content: string
    parentId?: string | null
}

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateCommentInput) => {
            return createComment({
                data: {
                    blogId: data.blogId,
                    content: data.content,
                    parentId: data.parentId ?? null,
                },
            })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['blogs', variables.slug],
            })
        },
    })
}

export const blogUpdateMutation = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async (form: BlogUpdateForm) => {
            return updateBlog({
                data: { blogSchema: form.blogSchema, slug: form.slug }
            })
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["blogs", variables.slug]
            })
            router.navigate({
                to: "/blogs/$slug/details",
                params: { slug: variables.slug }
            })
        }
    })
}