import { createProjectCase } from "@/server/case.functions"
import { useMutation } from "@tanstack/react-query"
import type { CaseRequest } from "../validations/case.types"

export const useCreateCaseStudyMutations=()=>{
    return useMutation({
        mutationFn:(data:CaseRequest)=>createProjectCase({data})
    })
}