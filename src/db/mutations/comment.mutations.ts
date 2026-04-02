import { createComment } from "@/server/comment.functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommentRequest } from "../validations/comment.types"



export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn:(data: CommentRequest) => createComment({
                data: {
                    userId:data.userId,
                    articleId: data.articleId,
                    content: data.content,
                    parentId: data.parentId ?? null,
                },
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['blogs',variables.articleId],
            })
        },
    })
}