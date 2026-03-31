export type UserMetadata = {
  name: string | null
  avatar_url: string | null
  
}

// ✅ augment Supabase's UserMetadata type globally
declare module '@supabase/supabase-js' {
  interface UserMetadata {
    name: string 
    avatar_url: string 
  }
}