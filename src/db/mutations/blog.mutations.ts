import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBlog, updateBlog } from '@/server/blog.functions'
import { useRouter } from '@tanstack/react-router'
import type { BlogRequest, BlogUpdateForm } from '@/db/schema'
import { getAllBlogsQueryOptions, getBlogBySlugQueryOptions } from '../queries/blog.queries'




export const blogUpdateMutationOption = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn:(form: BlogUpdateForm) =>updateBlog({
            data: { blogSchema: form.blogSchema, slug: form.slug }
        }),
        onSuccess: async (_, variables) => {
            await queryClient.refetchQueries({
                queryKey: ["blogs", variables.slug],
            })
            await router.navigate({
                to: "/blogs/$slug/details",
                params: { slug: variables.slug }
            })
        }
    })
}



export const useBlogCreateMutation = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn:(form: BlogRequest) =>
            createBlog({ data: form }),
        onSuccess: async (data) => {
            queryClient.setQueryData(getBlogBySlugQueryOptions(data.slug).queryKey, {
                ...data,
                likes: 0,
                likedByUser: false,
                comments: [],
                authorId: data.userId,
                authorName: null,
                authorImage: null,
                categoryName: null
            })
            await queryClient.invalidateQueries({ queryKey: getAllBlogsQueryOptions().queryKey })
            await router.navigate({
                to: "/blogs/$slug/details",
                params: { slug: data.slug },
            })
        },
    })
}

