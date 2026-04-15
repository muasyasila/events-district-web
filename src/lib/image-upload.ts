import { createClient } from '@/lib/supabase/client'

export interface UploadOptions {
  bucket: 'hero-images' | 'testimonials' | 'portfolio'
  folder?: string
  maxSizeMB?: number
}

export async function uploadImage(
  file: File,
  options: UploadOptions
): Promise<{ url: string; error: string | null }> {
  const supabase = createClient()
  
  const maxSize = options.maxSizeMB || 5
  if (file.size > maxSize * 1024 * 1024) {
    return { url: '', error: `File must be less than ${maxSize}MB` }
  }
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${options.folder || 'general'}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(options.bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    return { url: '', error: error.message }
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(options.bucket)
    .getPublicUrl(fileName)
  
  return { url: publicUrl, error: null }
}