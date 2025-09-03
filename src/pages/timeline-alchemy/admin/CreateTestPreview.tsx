import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CreateTestPreview() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const createTestPreview = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in')
        return
      }

      // Get a client user
      const { data: clients, error: clientsError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .eq('role', 'client')
        .limit(1)

      if (clientsError || !clients || clients.length === 0) {
        setError('No clients found. Please create a client first.')
        return
      }

      const client = clients[0]

      // Get a blog post (idea)
      const { data: blogPosts, error: blogPostsError } = await supabase
        .from('blog_posts')
        .select('*')
        .limit(1)

      if (blogPostsError || !blogPosts || blogPosts.length === 0) {
        setError('No blog posts found. Please create a blog post first.')
        return
      }

      const blogPost = blogPosts[0]

      // Create test preview data
      const previewData = {
        idea_id: blogPost.id,
        idea_title: blogPost.title,
        idea_content: blogPost.body,
        social_content: {
          facebook: blogPost.facebook || 'Test Facebook content for this idea',
          instagram: blogPost.instagram || 'Test Instagram content for this idea',
          x: blogPost.x || 'Test X content for this idea',
          linkedin: blogPost.linkedin || 'Test LinkedIn content for this idea',
          tiktok: blogPost.tiktok || 'Test TikTok content for this idea',
          youtube: blogPost.youtube || 'Test YouTube content for this idea'
        },
        images: {
          main: blogPost.image_public_url,
          featured: blogPost.featured_image
        },
        created_by: user.id,
        created_at: new Date().toISOString()
      }

      // Create preview in user_previews table
      const { error: insertError } = await supabase
        .from('user_previews')
        .insert({
          user_id: client.user_id,
          preview_data: previewData,
          status: 'pending',
          admin_notes: 'Test preview created automatically'
        })

      if (insertError) {
        console.error('Error creating test preview:', insertError)
        setError('Failed to create test preview: ' + insertError.message)
        return
      }

      setSuccess(true)
      console.log('Successfully created test preview')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/timeline-alchemy/admin/dashboard-new')
      }, 2000)
      
    } catch (error) {
      console.error('Error in createTestPreview:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Create Test Preview</h1>
        <p className="mt-2 text-gray-300">Create a test preview to see the new flow in action</p>
      </div>

      <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Plus className="w-6 h-6 text-blue-400" />
            Test Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <div className="text-green-400 font-medium">
                Success! Test preview created
              </div>
              <div className="text-sm text-gray-300">
                Redirecting to dashboard...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-gray-300">
                This will create a test preview using the first available client and blog post.
              </div>
              
              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <Button
                onClick={createTestPreview}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Test Preview
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
