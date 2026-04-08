
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {UserUpdateProfileRequest} from "../validations/user.types"
import { getAllUsersQueryOptions } from "../queries/user.queries"
import { userUpdateProfile } from "@/server/users.functions"
import type { AdminUserUpdateRequest } from "../validations/admin.types"
import { adminUpdateUserProfile } from "@/server/admin.functions"


export const useUserUpdateProfileMutation=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(data:UserUpdateProfileRequest)=>userUpdateProfile({data}),
        onSuccess:async()=>{
            await queryClient.invalidateQueries({queryKey:getAllUsersQueryOptions().queryKey})
        }
    })
}

export const useAdminUserUpdateMutation=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(data:AdminUserUpdateRequest)=>adminUpdateUserProfile({data}),
        onSuccess:async()=>{
            await queryClient.invalidateQueries({queryKey:getAllUsersQueryOptions().queryKey})
        }
    })
}