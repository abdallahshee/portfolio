import { createBrowserClient } from '@supabase/ssr'




// let client: SupabaseClient | null = null

// export function getSupabaseBrowserClient() {
//   if (!client) {
//     client = createClient(
//       import.meta.env.VITE_SUPABASE_URL!,
//       import.meta.env.VITE_SUPABASE_ANON_KEY!
//     )
//   }
//   return client
// }


// Browser client must use cookies storage, not localStorage
export const getSupabaseBrowserClient = () =>
  createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  )

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special characters
    .replace(/[\s_]+/g, '-')    // replace spaces and underscores with hyphens
    .replace(/--+/g, '-')       // collapse multiple hyphens
    .replace(/^-+|-+$/g, '')    // trim leading/trailing hyphens
}

export async function uploadProjectImage(file: File, title: string): Promise<string> {
  const slug=slugify(title)
const supabase = getSupabaseBrowserClient()
  const fileExt = file.name.split('.').pop()
  // ✅ must be {userId}/filename for policies to work
  const filePath = `${slug}/project.${fileExt}`
  const { error } = await supabase.storage
    .from('project-images')
    .upload(filePath, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

