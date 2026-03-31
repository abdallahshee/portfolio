

import { createBrowserClient } from '@supabase/ssr'
import { nanoid } from 'nanoid'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient

  browserClient = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )
  return browserClient
}


export async function uploadArticleImage(file: File, userId: string): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const fileExt = file.name.split('.').pop()
const random=nanoid(4)
  // ✅ must be {userId}/filename for policies to work
  const filePath = `${userId}/article${random}.${fileExt}`
  const { error } = await supabase.storage
    .from('artilces')
    .upload(filePath, file, { upsert: true })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage
    .from('articles')
    .getPublicUrl(filePath)
  return data.publicUrl
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

export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const fileExt = file.name.split('.').pop()

  // ✅ must be {userId}/filename for policies to work
  const filePath = `${userId}/avatar.${fileExt}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return data.publicUrl
}