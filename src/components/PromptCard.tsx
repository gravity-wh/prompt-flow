'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Prompt } from '@/types/database'
import { Heart, Copy, Check } from 'lucide-react'

interface PromptCardProps {
  prompt: Prompt
  onLike: (promptId: number) => Promise<{ prompt_text: string; model: string } | null>
  isAuthenticated: boolean
  onLoginRequired: () => void
}

export default function PromptCard({ 
  prompt, 
  onLike, 
  isAuthenticated,
  onLoginRequired 
}: PromptCardProps) {
  const [isLiked, setIsLiked] = useState(prompt.user_liked || false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptDetails, setPromptDetails] = useState<{ prompt_text: string; model: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) {
      onLoginRequired()
      return
    }

    if (isLiked) return

    setIsLoading(true)
    try {
      const details = await onLike(prompt.id)
      if (details) {
        setIsLiked(true)
        setShowPrompt(true)
        setPromptDetails(details)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (promptDetails) {
      await navigator.clipboard.writeText(promptDetails.prompt_text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative w-full h-screen snap-start snap-always flex-shrink-0">
      <Image
        src={prompt.cover_image_url}
        alt={prompt.title}
        fill
        className="object-cover"
        priority
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-24">
        <h2 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
          {prompt.title}
        </h2>
        
        {showPrompt && promptDetails && (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm font-medium">{promptDetails.model}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {promptDetails.prompt_text}
            </p>
          </div>
        )}
        
        <button
          onClick={handleLike}
          disabled={isLoading || isLiked}
          className={`
            flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all
            ${isLiked 
              ? 'bg-pink-500 text-white' 
              : 'bg-white/90 hover:bg-white text-black'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
          />
          <span>{isLiked ? 'Liked' : 'Like to unlock prompt'}</span>
        </button>
      </div>
    </div>
  )
}
