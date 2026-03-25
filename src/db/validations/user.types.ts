import type { InferSelectModel } from "drizzle-orm";
import { user } from "../schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod"

export const SignUpSchema = createSelectSchema(user, {
    name: () => z.string().nonempty("Username is required")
    .min(3,"At 3 characters for a username")
    .max(15, "Too long for a Username"),
    email: z.string().regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must be a valid email address"
    )
}).pick({ name: true, email: true, image: true })
    .extend({
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must contain uppercase, lowercase, number and special character"
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
    name:z.string().nonempty("Username is required")
}).pick({
    email: true,
    name:true
}).extend({
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must contain uppercase, lowercase, number and special character"
            ),
        rememberMe: z.boolean().default(false)
    })

export type SignUpRequest = z.infer<typeof SignUpSchema>

export type SignInRequest = z.infer<typeof SignInSchema>

export type User = InferSelectModel<typeof user>

export type Role = Pick<InferSelectModel<typeof user>, "role">

