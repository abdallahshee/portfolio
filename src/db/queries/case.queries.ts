import { queryOptions, useMutation } from "@tanstack/react-query"
import type { CreateCaseFormRequest } from "../validations/case.types"
import { createCase, getCaseBySlug, getPaginatedCases, updateCase } from "@/server/case.functions"

export const useCreateCaseMutations = () => {
    return useMutation({
        mutationFn: (data:CreateCaseFormRequest) => createCase({ data })
    })
}

export const getCaseBySlugQueryOptions = (slug: string) => queryOptions({
    queryKey: ['case_studies', slug],
    queryFn: () => getCaseBySlug({ data: { slug } })
})

export const useCaseUpdateMutation = () => {
    return useMutation({
        mutationFn: (data: CreateCaseFormRequest) => updateCase({ data })
    })
}

export const getPaginatedCasesQueryOptions = (
    page: number,
    pageSize = 6,
    query = ''
) =>
    queryOptions({
        queryKey: ['cases', 'paginated', page, pageSize, query] as (string | number)[],
        queryFn: () => getPaginatedCases({ data: { page, pageSize, query } }),
    })