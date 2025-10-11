export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Prompt {
  id: number
  creator_id: string
  title: string
  cover_image_url: string
  model: string
  prompt_text: string
  created_at: string
  profiles?: Profile
  likes_count?: number
  user_liked?: boolean
}

export interface Like {
  id: number
  user_id: string
  prompt_id: number
  created_at: string
}
