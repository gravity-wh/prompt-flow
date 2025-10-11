'use client'

import { useState } from 'react'
import PromptCard from './PromptCard'
import { Prompt } from '@/types/database'
import AuthModal from './AuthModal'
import Navigation from './Navigation'

interface PromptFeedProps {
  prompts: Prompt[]
  isAuthenticated: boolean
  onLike: (promptId: number) => Promise<{ prompt_text: string; model: string } | null>
}

export default function PromptFeed({ prompts, isAuthenticated, onLike }: PromptFeedProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Navigation isAuthenticated={isAuthenticated} />
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onLike={onLike}
            isAuthenticated={isAuthenticated}
            onLoginRequired={() => setShowAuthModal(true)}
          />
        ))}
      </div>
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  )
}
