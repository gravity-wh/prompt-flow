'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPrompt(formData: FormData) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('User must be authenticated to create prompts')
  }

  const title = formData.get('title') as string
  const model = formData.get('model') as string
  const promptText = formData.get('prompt_text') as string
  const image = formData.get('image') as File

  if (!title || !model || !promptText || !image) {
    throw new Error('All fields are required')
  }

  // Upload image to Supabase Storage
  const fileExt = image.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `prompt-covers/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('prompts')
    .upload(filePath, image, {
      contentType: image.type,
      upsert: false
    })

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  // Get public URL for the image
  const { data: { publicUrl } } = supabase.storage
    .from('prompts')
    .getPublicUrl(filePath)

  // Insert prompt into database
  const { error: insertError } = await supabase
    .from('prompts')
    .insert({
      creator_id: user.id,
      title,
      model,
      prompt_text: promptText,
      cover_image_url: publicUrl
    })

  if (insertError) {
    // If database insert fails, try to delete the uploaded image
    await supabase.storage.from('prompts').remove([filePath])
    throw new Error(`Failed to create prompt: ${insertError.message}`)
  }

  revalidatePath('/')
  
  return { success: true }
}
