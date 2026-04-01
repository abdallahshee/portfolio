
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory, deleteCategory, editCategory } from "@/server/category.functions"
import { getAllCategoriesQueryOption } from "../queries/category.queries"
import type { CategoryRequest, EditCategoryRequest } from "../validations/category.types"


export const useCategoryCreateMutations = (onSuccess?: () => void) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (form: CategoryRequest) => createCategory({ data: form }),
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

export const useCategoryEditMutation=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(data:EditCategoryRequest)=>editCategory({data}),
        onSuccess:async()=>{
            queryClient.invalidateQueries({queryKey:getAllCategoriesQueryOption().queryKey})
        }
    })
}