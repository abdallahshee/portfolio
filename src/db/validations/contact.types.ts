import { createSelectSchema } from "drizzle-zod";
import { user } from "../schema";
import z from "zod"

export const ContactMeSchema=createSelectSchema(user,{
    email:z.string().regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address"
    ),
    name:z.string().nonempty("Username is required")
}).pick({email:true,name:true})
.extend({
    subject:z.string().min(3,"Too short for a subject")
    .max(25,"Subject should not exceed 25 characters"),
    message:z.string().min(25,"Please provide a detailed message").max(500,"PLease summarise your message")
})

export type ContactMeRequest=z.infer<typeof ContactMeSchema>