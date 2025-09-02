import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Calendar,
  MessageSquare,
  Users,
  Star,
  Save,
  Loader2,
  FileText,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  XCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

interface Client {
  id: string
  name: string
  email: string
}

interface BlogPost {
  id: string
  title: string
  body?: string
  excerpt?: string
  facebook?: string
  instagram?: string
  x?: string
  linkedin?: string
  featured_image?: string
  image_url?: string
  image_public_url?: string
}

interface PreviewForm {
  step: number
  selectedClient: string
  selectedPosts: string[]
  adminNotes: string
}

export default function PreviewWizardNew() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<PreviewForm>({
    step: 1,
    selectedClient: '',
    selectedPosts: [],
    adminNotes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load clients from profiles table (users with role = 'client')
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          role
        `)
        .eq('role', 'client')
        .order('display_name')

      if (clientsError) {
        console.error('Error loading clients:', clientsError)
        setClients([])
      } else if (clientsData && clientsData.length > 0) {
        const transformedClients = clientsData.map((client: any) => ({
          id: client.user_id, // Use user_id directly
          name: client.display_name || 'Unnamed Client',
          email: 'No email'
        }))
        setClients(transformedClients)
      } else {
        setClients([])
      }

      // Load blog posts
      await loadBlogPosts()
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading blog posts:', error)
        setBlogPosts([])
        return
      }
      
      if (data && data.length > 0) {
        const transformedPosts = data.map((post: any) => ({
          id: post.id,
          title: post.title || 'Untitled',
          body: post.body || null,
          excerpt: post.excerpt || null,
          facebook: post.facebook || null,
          instagram: post.instagram || null,
          x: post.x || null,
          linkedin: post.linkedin || null,
          featured_image: post.featured_image || null,
          image_url: post.image_url || null,
          image_public_url: post.image_public_url || null
        }))
        setBlogPosts(transformedPosts)
      } else {
        setBlogPosts([])
      }
    } catch (error) {
      console.error('Error in loadBlogPosts:', error)
      setBlogPosts([])
    }
  }

  const nextStep = () => {
    if (form.step < 3) {
      setForm(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const prevStep = () => {
    if (form.step > 1) {
      setForm(prev => ({ ...prev, step: prev.step - 1 }))
    }
  }

  const handleSave = async () => {
    try {
      console.log('handleSave called with form data:', form)
      setSaving(true)
      
      if (!form.selectedClient || form.selectedPosts.length === 0) {
        alert('Please select a client and at least one blog post')
        return
      }

      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to create previews')
        return
      }

      // Create previews for each selected post
      const previewPromises = form.selectedPosts.map(async (postId) => {
        const post = blogPosts.find(p => p.id === postId)
        if (!post) return null
        
        // Create preview data
        const previewData = {
          post_id: postId,
          post_title: post.title,
          post_content: post.body,
          social_content: {
            facebook: post.facebook,
            instagram: post.instagram,
            x: post.x,
            linkedin: post.linkedin
          },
          images: {
            main: post.image_public_url,
            featured: post.featured_image
          },
          created_by: user.id,
          created_at: new Date().toISOString()
        }
        
        return supabase
          .from('user_previews')
          .insert({
            user_id: form.selectedClient, // Direct user_id link
            preview_data: previewData,
            status: 'pending',
            admin_notes: form.adminNotes
          })
          .select()
          .single()
      })

      const previewResults = await Promise.all(previewPromises)
      const previewErrors = previewResults.filter(result => result.error)
      
      if (previewErrors.length > 0) {
        console.error('Errors creating previews:', previewErrors)
        alert(`Failed to create ${previewErrors.length} preview(s)`)
        return
      }

      // Show success message and navigate to dashboard
      const previewCount = form.selectedPosts.length
      alert(`${previewCount} preview${previewCount !== 1 ? 's' : ''} saved successfully! Redirecting to dashboard...`)
      navigate('/timeline-alchemy/admin/dashboard')
    } catch (error) {
      console.error('Error saving preview:', error)
      alert('Failed to save preview')
    } finally {
      setSaving(false)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Select Client'
      case 2: return 'Select Blog Posts'
      case 3: return 'Review & Save'
      default: return ''
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Choose which client this preview is for'
      case 2: return 'Select blog posts for previews'
      case 3: return 'Review and save previews'
      default: return ''
    }
  }

  const renderStepContent = () => {
    switch (form.step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Select a Client</h3>
            <div className="grid gap-3">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setForm(prev => ({ ...prev, selectedClient: client.id }))}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    form.selectedClient === client.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{client.name}</h4>
                      <p className="text-sm text-gray-300">{client.email}</p>
                    </div>
                    {form.selectedClient === client.id && (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Select Blog Posts</h3>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    form.selectedPosts.includes(post.id)
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  }`}
                  onClick={() => {
                    const isSelected = form.selectedPosts.includes(post.id)
                    if (isSelected) {
                      setForm(prev => ({ 
                        ...prev, 
                        selectedPosts: prev.selectedPosts.filter(id => id !== post.id) 
                      }))
                    } else {
                      setForm(prev => ({ 
                        ...prev, 
                        selectedPosts: [...prev.selectedPosts, post.id] 
                      }))
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{post.title}</h4>
                      <p className="text-sm text-gray-300">
                        {post.excerpt || post.body?.substring(0, 100) || 'No content preview'}
                      </p>
                    </div>
                    {form.selectedPosts.includes(post.id) && (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Review & Save</h3>
              <p className="text-gray-400">Review your selections before saving</p>
            </div>

            {/* Client Info */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Selected Client</h4>
              <p className="text-gray-300">
                {clients.find(c => c.id === form.selectedClient)?.name || 'No client selected'}
              </p>
            </div>

            {/* Selected Posts */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Selected Posts ({form.selectedPosts.length})</h4>
              <div className="space-y-2">
                {form.selectedPosts.map((postId) => {
                  const post = blogPosts.find(p => p.id === postId)
                  return post ? (
                    <div key={postId} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{post.title}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Admin Notes (Optional)</label>
              <Textarea
                value={form.adminNotes}
                onChange={(e) => setForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                placeholder="Add notes for the client..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-lg text-white">Loading preview wizard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Preview Wizard (New)</h1>
        <p className="mt-2 text-gray-300">Simple preview creation in 3 steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= form.step
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < form.step ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step < form.step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-white">
            Step {form.step}: {getStepTitle(form.step)}
          </CardTitle>
          <p className="text-center text-gray-300">
            {getStepDescription(form.step)}
          </p>
        </CardHeader>
        <CardContent className="text-gray-100">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={form.step === 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {form.step < 3 ? (
            <Button
              onClick={nextStep}
              disabled={
                (form.step === 1 && !form.selectedClient) ||
                (form.step === 2 && form.selectedPosts.length === 0)
              }
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preview
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
