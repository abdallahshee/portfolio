import { queryOptions, useMutation } from "@tanstack/react-query"
import type { CaseRequest } from "../validations/case.types"
import { createProjectCase,  getCaseStudyByProjectId } from "@/server/case.functions"

export const useCreateCaseStudyMutations=()=>{
    return useMutation({
        mutationFn:(data:CaseRequest)=>createProjectCase({data})
    })
}

export const getCaseStudyByProjectIdQueryOptions=(projectId:string)=>queryOptions({
    queryKey:['case_studies',projectId],
    queryFn:()=>getCaseStudyByProjectId({data:{projectId}})
})