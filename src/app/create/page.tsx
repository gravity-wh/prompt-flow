import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreatePromptForm from '@/components/CreatePromptForm'

export default async function CreatePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Share Your Idea</h1>
        <CreatePromptForm />
      </div>
    </div>
  )
}
