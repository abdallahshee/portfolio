
import { getSupabaseBrowserClient } from "./supabase/client"
import slugify from "slugify"

export async function uploadProjectImage(file: File, title: string): Promise<string> {
  const slug=slugify(title,{lower:true,strict:true})
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