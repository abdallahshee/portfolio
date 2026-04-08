
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {UserUpdateProfileRequest} from "../validations/user.types"
import { getAllUsersQueryOptions } from "../queries/user.queries"
import { userUpdateProfile } from "@/server/users.functions"


export const useUserUpdateProfileMutation=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(data:UserUpdateProfileRequest)=>userUpdateProfile({data}),
        onSuccess:async()=>{
            await queryClient.invalidateQueries({queryKey:getAllUsersQueryOptions().queryKey})
        }
    })
}