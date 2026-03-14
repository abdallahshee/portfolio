import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '@/server/comment.functions'

interface CreateCommentInput {
    blogId: string
    slug: string
    content: string
    parentId?: string | null
}

export function useCreateCommentMutation() {
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