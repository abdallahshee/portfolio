import type { InferSelectModel } from "drizzle-orm";
import { user } from "../schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod"


export type User = InferSelectModel<typeof user>

export const UserSchema=createSelectSchema(user,{
  name:()=>z.string().nonempty("Username is required").min(3).max(15,"Too long for a Username"),
  email: z.string().regex(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "Must be a valid email address"
)
}).pick({name:true, email:true,image:true})
.extend({
 password: z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number and special character"
  ),
   confirmPassword: z.string(),
}) .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
