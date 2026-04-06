import { createComment } from "@/server/comment.functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommentRequest } from "../validations/comment.types"



export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn:(data: CommentRequest) => createComment({data}),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['blogs',variables.articleId],
            })
        },
    })
}