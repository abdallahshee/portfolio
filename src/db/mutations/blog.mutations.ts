import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBlog } from '@/server/blog.functions'
import { useRouter } from '@tanstack/react-router'
import type { BlogUpdateForm } from '@/db/schema'



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