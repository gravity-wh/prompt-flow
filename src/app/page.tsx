import { createClient } from '@/lib/supabase/server'
import PromptFeed from '@/components/PromptFeed'
import { likePrompt } from './actions/likes'
import { Prompt } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch prompts from the database
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select(`
      *,
      profiles:creator_id (
        id,
        username
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching prompts:', error)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load prompts</h1>
          <p className="text-gray-600">Please check your Supabase configuration</p>
        </div>
      </div>
    )
  }

  // If no prompts, show a message
  if (!prompts || prompts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No prompts yet</h1>
          <p className="text-gray-600">Be the first to share an idea!</p>
        </div>
      </div>
    )
  }

  // Add user_liked status to each prompt if user is authenticated
  let promptsWithLikes: Prompt[] = prompts
  
  if (user) {
    const { data: userLikes } = await supabase
      .from('likes')
      .select('prompt_id')
      .eq('user_id', user.id)
    
    const likedPromptIds = new Set(userLikes?.map(like => like.prompt_id) || [])
    
    promptsWithLikes = prompts.map(prompt => ({
      ...prompt,
      user_liked: likedPromptIds.has(prompt.id)
    }))
  }

  return (
    <PromptFeed 
      prompts={promptsWithLikes} 
      isAuthenticated={!!user}
      onLike={likePrompt}
    />
  )
}
