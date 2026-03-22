
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { categoryRequest } from "../schema"
import { createCategory, deleteCategory } from "@/server/category.functions"
import { getAllCategoriesQueryOption } from "../queries/category.queries"

export const useCategoryCreateMutations = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (form: categoryRequest) => createCategory({ data: form }),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: getAllCategoriesQueryOption().queryKey })
            onSuccess?.()
        }
    })
}
export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(categoryId: string) => deleteCategory({ data: { categoryId } }),
        onSuccess: async() => {
            await queryClient.refetchQueries({ queryKey: getAllCategoriesQueryOption().queryKey})
        },
        onError: (err) => {
            console.error(err)
        },
    })
}

// export const useCategoryUpdateMutation