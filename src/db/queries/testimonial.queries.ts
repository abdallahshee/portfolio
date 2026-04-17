import { queryOptions, useMutation } from "@tanstack/react-query"
import type { TestimonialRequest } from "../validations/testimonial.types"
import { createTestimonial, getTestimonials } from "@/server/testimonial.functions"

export const useCreateTestimonialMutation=()=>{
    return useMutation({
        mutationFn:(data:TestimonialRequest)=>createTestimonial({data})
    })
}

export const getTestimonialQueryOptions=()=>queryOptions({
    queryKey:['testimonials'],
    queryFn:async()=>getTestimonials()
})