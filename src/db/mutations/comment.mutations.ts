import { createComment } from "@/server/comment.functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateCommentInput {
    blogId: string
    slug: string
    content: string
    parentId?: string | null
}

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn:(data: CreateCommentInput) => createComment({
                data: {
                    articleId: data.blogId,
                    content: data.content,
                    parentId: data.parentId ?? null,
                },
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['blogs', variables.slug],
            })
        },
    })
}