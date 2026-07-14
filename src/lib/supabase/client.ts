import { createBrowserClient } from '@supabase/ssr'



// Browser client must use cookies storage, not localStorage
export const getSupabaseBrowserClient = () =>
  createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  )





