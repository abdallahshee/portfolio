import { createServerFn } from "@tanstack/react-start";
import { AdminMiddleware } from "./middleware/auth.middleware";
import { CaseSchema } from "@/db/validations/case.types";
import { db } from "@/db";
import { caseStudy } from "@/db/schema/project-case.schema";


export const createProjectCase=createServerFn({method:"POST"})
.middleware([AdminMiddleware])
.inputValidator(CaseSchema)
.handler(async({data})=>{
    try{
        const [theCaseStudy]=await db.insert(caseStudy).values(data).returning()
        return theCaseStudy
    }catch(err){
        throw err
    }
})