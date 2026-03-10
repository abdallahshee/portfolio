// import { createAuthClient } from 'better-auth/client'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient} from 'better-auth/react' 
import type { auth } from '@/lib/auth'

export const authClient = createAuthClient({
//   baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
})

