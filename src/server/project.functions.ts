import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/index";
import type { Project } from "../db/types";
import { project } from "drizzle/schema";




export const getAllProjects=createServerFn({method:"GET"})
.handler(async()=>{
    try{
        const projects:Project[]=await db.select().from(project)
        return projects
    }catch(err){

    }
})