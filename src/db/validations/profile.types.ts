import { createSelectSchema } from "drizzle-zod"
import z from "zod"
import { profile } from "../schema/profile-schema"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
const emailRegex=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  export const RegisterSchema=createSelectSchema(profile,{
  firstname: z.string().min(2, 'Name must be at least 2 characters'),
  lastname: z.string().min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .regex(emailRegex, 'Invalid email address'),
   
  }).extend({
     password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters and include uppercase, lowercase, and a special character'
      ),
    confirmPassword: z.string(),
  }).pick({
    firstname:true,lastname:true,email:true, password:true,confirmPassword:true
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })



  export const SignInSchema = z.object({
    email: z.string().regex(passwordRegex,'Invalid email address'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters and include uppercase, lowercase, and a special character'
      ),
  })