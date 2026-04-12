import { queryOptions, useMutation } from "@tanstack/react-query"
import type { CaseRequest } from "../validations/case.types"
import { createProjectCase,  getProjectCaseStudyByProjectId } from "@/server/case.functions"

export const useCreateCaseStudyMutations=()=>{
    return useMutation({
        mutationFn:(data:CaseRequest)=>createProjectCase({data})
    })
}


export const getCaseStudyByProjectIdQueryOptions=(data:{projectId:string})=>queryOptions({
    queryKey:['case_studies',data ],
    queryFn:()=>getProjectCaseStudyByProjectId({data})
})