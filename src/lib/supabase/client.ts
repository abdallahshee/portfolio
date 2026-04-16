import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'



let client: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  }
  return client
}



export async function uploadProjectImage(file: File, projectId: string): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const fileExt = file.name.split('.').pop()
  // ✅ must be {userId}/filename for policies to work
  const filePath = `${projectId}/project.${fileExt}`
  const { error } = await supabase.storage
    .from('projects')
    .upload(filePath, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('projects')
    .getPublicUrl(filePath)

  return data.publicUrl
}

