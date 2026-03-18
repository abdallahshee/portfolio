import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBlog, updateBlog } from '@/server/blog.functions'
import { useRouter } from '@tanstack/react-router'
import type { BlogRequest, BlogUpdateForm } from '@/db/schema'



export const blogUpdateMutationOption = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async (form: BlogUpdateForm) => {
            return updateBlog({
                data: { blogSchema: form.blogSchema, slug: form.slug }
            })
        },
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

// export const blogCreateMutationOption=()=>{
//         const queryClient = useQueryClient()
//     const router = useRouter()
//     return useMutation({
//         mutationFn:async(form:BlogRequest)=>createBlog({data:form}),
//         onSuccess:async(data)=>{
//              router.navigate({
//         to: "/blogs/$slug/details",
//         params:{slug:data.}
//         // search: {
//         //   callbackUrl: "/projects",
//         // },
//       })
//         }
//     },

// )
// }


export const useBlogCreateMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (form: BlogRequest) =>
      createBlog({ data: form }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["blogs"] })
      await router.navigate({
        to: "/blogs/$slug/details",
        params: { slug: data.slug }, 
      })
    },

  })
}