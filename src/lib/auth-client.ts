import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  // baseURL: import.meta.env.VITE_BASE_URL, // or http://localhost:3000

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
})

