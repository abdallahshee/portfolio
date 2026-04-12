import { createSelectSchema } from "drizzle-zod";
import { caseStudy } from "../schema/project-case.schema";
import z from "zod";

export const CaseSchema=createSelectSchema(caseStudy,{
    endDate:z.string().nonempty("Date is required"),
    startDate:z.string().nonempty("Date is required"),
    technologies:z.array(z.string().min(3,"Insert correct technology").max(16,"Too long, please shorten"))
    .min(1,"insert at least one technology").max(5,"A maximum of 5 is enough"),
    problem:z.string().min(100,"Content out of range 100-1000 characters")
    .min(1000,"Content out of range 100-1000 characters"),
    projectId:z.string().nonempty("Select a project"),
    solution:z.string().min(100,"Content out of range 100-1000 characters")
    .min(1000,"Content out of range 100-1000 characters"),
    implementation:z.string().min(100,"Content out of range 100-1000 characters")
    .min(1000,"Content out of range 100-1000 characters"),
    outcomes:z.string().min(100,"Content out of range 100-1000 characters")
    .min(1000,"Content out of range 100-1000 characters"),
}).omit({createdAt:true, updatedAt:true,id:true,overview:true})

export type CaseRequest=z.infer<typeof CaseSchema>

export const CreateCaseFormSchema=CaseSchema.omit({projectId:true})

export type CreateCaseFormRequest=z.infer<typeof CreateCaseFormSchema>
