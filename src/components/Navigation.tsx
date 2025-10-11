'use client'

import Link from 'next/link'
import { Plus, User } from 'lucide-react'

interface NavigationProps {
  isAuthenticated: boolean
}

export default function Navigation({ isAuthenticated }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white font-bold text-xl drop-shadow-lg">
            PromptFlow
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Create</span>
              </Link>
            )}
            
            <Link
              href={isAuthenticated ? '/profile' : '/'}
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
