import { UpdateUserProfile } from "@/server/users.functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Role, UserUpdateRequest } from "../validations/user.types"
import { useRouter } from "@tanstack/react-router"
import { getAllUsersQueryOptions } from "../queries/user.queries"


export const useUserUpdateMutation=()=>{
    const queryClient=useQueryClient()
    const router=useRouter()
    return useMutation({
        mutationFn:(data:UserUpdateRequest)=>UpdateUserProfile({data}),
        onSuccess:async(_,variables)=>{
            await queryClient.invalidateQueries({queryKey:getAllUsersQueryOptions().queryKey})
                await router.navigate({
                    to: "/",
                })  
        }
    })
}