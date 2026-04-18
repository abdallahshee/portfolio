import { queryOptions, useMutation } from "@tanstack/react-query"
import type { CaseRequest } from "../validations/case.types"
import { createProjectCase, getCaseStudyById, getCaseStudyByProjectId, getPaginatedCaseStudies, updateCaseStudy } from "@/server/case.functions"

export const useCreateCaseStudyMutations = () => {
    return useMutation({
        mutationFn: (data: CaseRequest) => createProjectCase({ data })
    })
}

export const getCaseStudyByProjectIdQueryOptions = (projectId: string) => queryOptions({
    queryKey: ['case_studies', projectId],
    queryFn: () => getCaseStudyByProjectId({ data: { projectId } })
})

export const getCaseStudyByIdQueryOptions = (caseId: string) => queryOptions({
    queryKey: ['case_studies', caseId],
    queryFn: () => getCaseStudyById({ data: { caseId } })
})

export const useCaseUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: CaseRequest) => updateCaseStudy({ data })
    })
}

export const getPaginatedCaseStudiesQueryOptions = (
    page: number,
    pageSize = 6,
    query = ''
) =>
    queryOptions({
        queryKey: ['cases', 'paginated', page, pageSize, query] as (string | number)[],
        queryFn: () => getPaginatedCaseStudies({ data: { page, pageSize, query } }),
    })