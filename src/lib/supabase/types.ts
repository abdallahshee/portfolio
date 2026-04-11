export type UserMetadata = {
  name: string
  avatar: string
  role:string
  
}

// ✅ augment Supabase's UserMetadata type globally
declare module '@supabase/supabase-js' {
  interface UserMetadata {
    name: string 
    avatar: string 
    role:string
  }
}