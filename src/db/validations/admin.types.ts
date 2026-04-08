
import z from "zod"

export const AdminUserUpdateSchema = z.object({
   email: z.string().regex(
           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
           "Must be a valid email address"
       ),
    name: z.string().nonempty("Username is required")
        .min(3, "At 3 characters for a username")
        .max(15, "Too long for a Username"),
    image: z.string().min(1),
    userId: z.string().min(6)
})

export const GetUsersSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    search: z.string().optional(), // ✅ add search
})

export type AdminUserUpdateRequest = z.infer<typeof AdminUserUpdateSchema>