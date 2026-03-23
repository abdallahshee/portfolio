import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBlog, updateBlog } from '@/server/blog.functions'
import { useRouter } from '@tanstack/react-router'
import {  type BlogRequest, type BlogUpdateForm, type Role} from '@/db/schema'
import { getAllBlogsQueryOptions, getBlogBySlugQueryOptions } from '../queries/blog.queries'




export const blogUpdateMutationOption = (role: Role) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: (form: BlogUpdateForm) => updateBlog({
            data: { blogSchema: form.blogSchema, slug: form.slug }
        }),
        onSuccess: async (_, variables) => {
            await queryClient.refetchQueries({
                queryKey: getAllBlogsQueryOptions().queryKey,
            })

            if (role ==="admin" ) {
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
        mutationFn: (form: BlogRequest) =>
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
            if (role ==="admin") {
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

