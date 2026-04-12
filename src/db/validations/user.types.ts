import type { InferSelectModel } from "drizzle-orm";
import { user } from "../schema";
import { createSelectSchema } from "drizzle-zod";
import type { User } from '@supabase/supabase-js'
import z from "zod"

export const SignUpSchema = createSelectSchema(user, {
    name: z.string().nonempty("Username is required")
        .min(3, "At 3 characters for a username")
        .max(15, "Too long for a Username"),
    email: z.string().regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address"
    )
}).pick({ name: true, email: true, avatar: true })
    .extend({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*(\d|[@$!%*?&]))/,
                "Password must contain uppercase, lowercase, and at least a number or special character"
            ),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const SignInSchema = createSelectSchema(user, {
    email: z.string().regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address"
    ),

}).pick({
    email: true,

}).extend({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*(\d|[@$!%*?&]))/,
            "Password must contain uppercase, lowercase, and at least a number or special character"
        ),
    rememberMe: z.boolean().default(false)
})

export type SignUpRequest = z.infer<typeof SignUpSchema>

export type SignInRequest = z.infer<typeof SignInSchema>

export type Role = Pick<InferSelectModel<typeof user>, "role">

export type DbUser = InferSelectModel<typeof user>

export type SupabaseUser = User

export const UserUpdateProfileSchema = createSelectSchema(user, {
    name: z.string().nonempty("Username is required")
        .min(3, "At 3 characters for a username")
        .max(15, "Username out of range 3-15 characters"),
    avatar: z.string().min(3)
}).pick({ name: true, avatar: true })

export type UserUpdateProfileRequest = z.infer<typeof UserUpdateProfileSchema>
