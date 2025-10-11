'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function likePrompt(promptId: number) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('User must be authenticated to like prompts')
  }

  // Check if user already liked this prompt
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('prompt_id', promptId)
    .single()

  if (existingLike) {
    // Already liked, just return the prompt details
    const { data: prompt } = await supabase
      .from('prompts')
      .select('prompt_text, model')
      .eq('id', promptId)
      .single()

    return prompt
  }

  // Insert new like
  const { error: likeError } = await supabase
    .from('likes')
    .insert({ user_id: user.id, prompt_id: promptId })

  if (likeError) {
    throw new Error('Failed to like prompt')
  }

  // Get the prompt details
  const { data: prompt, error: promptError } = await supabase
    .from('prompts')
    .select('prompt_text, model')
    .eq('id', promptId)
    .single()

  if (promptError) {
    throw new Error('Failed to fetch prompt details')
  }

  revalidatePath('/')
  
  return prompt
}
