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
  X,
  Video,
  Youtube,
  XCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

interface Client {
  id: string
  name: string
  email: string
}

interface Idea {
  id: string
  title: string
  body?: string
  excerpt?: string
  facebook?: string
  instagram?: string
  x?: string
  linkedin?: string
  tiktok?: string
  youtube?: string
  featured_image?: string
  image_url?: string
  image_public_url?: string
}

interface PreviewForm {
  step: number
  selectedClient: string
  selectedIdeas: string[]
  adminNotes: string
}

export default function PreviewWizardNew() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [blogPosts, setBlogPosts] = useState<Idea[]>([]) // Add missing state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [expandedIdeas, setExpandedIdeas] = useState<{[key: string]: boolean}>({})
  const [form, setForm] = useState<PreviewForm>({
    step: 1,
    selectedClient: '',
    selectedIdeas: [],
    adminNotes: ''
  })

  useEffect(() => {
    checkAdminStatus()
    loadData()
  }, [])



  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('User not authenticated')
        navigate('/auth')
        return
      }

      // Check if user is admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error checking admin status:', error)
        return
      }

      if (!profile?.is_admin) {
        console.log('User is not admin, redirecting...')
        navigate('/timeline-alchemy/client/my-previews')
        return
      }

      setIsAdmin(true)
      console.log('User is admin, proceeding...')
    } catch (error) {
      console.error('Error in checkAdminStatus:', error)
    }
  }

  const toggleExpanded = (ideaId: string) => {
    setExpandedIdeas(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId]
    }))
  }

  const getBlogPostImages = (postId: string) => {
    const baseUrl = 'https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images'
    return {
      main: `${baseUrl}/${postId}/utopia.png`,
      dystopia: `${baseUrl}/${postId}/dystopia.png`,
      cosmic: `${baseUrl}/${postId}/cosmic.png`,
      cyberpunk: `${baseUrl}/${postId}/cyberpunk.png`
    }
  }



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

      // Load ideas from blog_posts
      await loadIdeas()
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadIdeas = async () => {
    try {
      console.log('Loading ideas from blog_posts table...')
      
      // First try to load all columns to see what's available
      const { data: allData, error: allError } = await supabase
        .from('blog_posts')
        .select('*')
        .limit(1)
      
      if (allError) {
        console.error('Error loading blog posts (all columns):', allError)
        setBlogPosts([])
        return
      }
      
      if (allData && allData.length > 0) {
        console.log('Available columns in blog_posts:', Object.keys(allData[0]))
        console.log('Sample blog post:', allData[0])
      }
      
      // Use the same query that works in testBlogPosts
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading blog posts:', error)
        setIdeas([])
        setBlogPosts([])
        return
      }
      
      if (data && data.length > 0) {
        console.log('Raw data from blog_posts:', data)
        console.log('Number of posts found:', data.length)
        
        const transformedPosts = data.map((post: any, index: number) => {
          console.log(`Transforming post ${index + 1}:`, post)
          return {
            id: post.id,
            title: post.title || 'Untitled',
            body: post.body || null,
            excerpt: post.excerpt || null,
            facebook: post.facebook || null,
            instagram: post.instagram || null,
            x: post.x || null,
            linkedin: post.linkedin || null,
            tiktok: post.tiktok || null, // Will be null if column doesn't exist
            youtube: post.youtube || null, // Will be null if column doesn't exist
            featured_image: post.featured_image || null,
            image_url: post.image_url || null,
            image_public_url: post.image_public_url || null
          }
        })
        
        console.log('Transformed posts:', transformedPosts)
        console.log('Setting ideas state with:', transformedPosts.length, 'posts')
        
        // Set the state
        setIdeas(transformedPosts)
        setBlogPosts(transformedPosts)
        
        // Verify the state was set
        setTimeout(() => {
          console.log('After state update - ideas length:', ideas.length)
          console.log('After state update - blogPosts length:', blogPosts.length)
        }, 100)
        
        console.log('Ideas state set, current ideas length:', transformedPosts.length)
      } else {
        console.log('No data found, setting empty arrays')
        setIdeas([])
        setBlogPosts([])
        console.log('No ideas found in blog_posts table')
      }
    } catch (error) {
      console.error('Error in loadIdeas:', error)
      setIdeas([])
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
      
      if (!form.selectedClient || form.selectedIdeas.length === 0) {
        alert('Please select a client and at least one idea')
        return
      }

      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to create previews')
        return
      }

      // Create previews for each selected idea
      const previewPromises = form.selectedIdeas.map(async (ideaId) => {
        const idea = ideas.find(i => i.id === ideaId)
        if (!idea) return null
        
        // Create preview data
        const previewData = {
          idea_id: ideaId,
          idea_title: idea.title,
          idea_content: idea.body,
          blog_post_id: idea.id, // Store the blog post ID for image loading
          social_content: {
            facebook: idea.facebook || `Facebook post for: ${idea.title}`,
            instagram: idea.instagram || `Instagram post for: ${idea.title}`,
            x: idea.x || `X post for: ${idea.title}`,
            linkedin: idea.linkedin || `LinkedIn post for: ${idea.title}`,
            tiktok: idea.tiktok || `TikTok video for: ${idea.title}`,
            youtube: idea.youtube || `YouTube video for: ${idea.title}`
          },
          images: {
            main: idea.image_public_url,
            featured: idea.featured_image
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

      // Show success message and navigate to new dashboard
      const previewCount = form.selectedIdeas.length
      alert(`${previewCount} preview${previewCount !== 1 ? 's' : ''} saved successfully! Redirecting to dashboard...`)
      navigate('/timeline-alchemy/admin/dashboard-new')
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
      case 2: return 'Select Ideas'
      case 3: return 'Review & Save'
      default: return ''
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Choose which client this preview is for'
      case 2: return 'Select ideas from blog_posts for previews'
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
        console.log('Rendering case 2, ideas length:', ideas.length)
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Select Ideas</h3>
            <div className="text-sm text-gray-400 mb-4">
              Found {ideas.length} ideas to choose from
              {ideas.length > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  First idea: {ideas[0]?.title || 'No title'}
                </div>
              )}
            </div>
            {ideas.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No ideas found</p>
              </div>
            )}
            <div className="space-y-4">
              {ideas.length > 0 ? (
                ideas.map((idea, index) => {
                  return (
                    <div
                      key={idea.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                        form.selectedIdeas.includes(idea.id)
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      }`}
                      onClick={() => {
                        const isSelected = form.selectedIdeas.includes(idea.id)
                        if (isSelected) {
                          setForm(prev => ({ 
                            ...prev, 
                            selectedIdeas: prev.selectedIdeas.filter(id => id !== idea.id) 
                          }))
                        } else {
                          setForm(prev => ({ 
                            ...prev, 
                            selectedIdeas: [...prev.selectedIdeas, idea.id] 
                          }))
                        }
                      }}
                    >
                      <div className="flex gap-6">
                        {/* Post Images - 4 variations */}
                        <div className="flex-shrink-0">
                          <div className="grid grid-cols-2 gap-2">
                            {/* Main Image or Placeholder */}
                            {idea.image_public_url ? (
                              <img 
                                src={idea.image_public_url} 
                                alt={idea.title}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg border border-gray-600 shadow-md flex items-center justify-center">
                                <span className="text-white text-xs font-medium text-center px-2">
                                  Hoofdafbeelding<br/>Niet beschikbaar
                                </span>
                              </div>
                            )}
                            
                            {(() => {
                              const images = getBlogPostImages(idea.id)
                              return (
                                <>
                                  {/* Utopia Theme Variation */}
                                  <img 
                                    src={images.main}
                                    alt={`${idea.title} - Utopia Theme`}
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(images.main, '_blank');
                                    }}
                                    title="Utopia Theme - Klik om te bekijken"
                                  />
                                  
                                  {/* Dystopia Theme Variation */}
                                  <img 
                                    src={images.dystopia}
                                    alt={`${idea.title} - Dystopia Theme`}
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(images.dystopia, '_blank');
                                    }}
                                    title="Dystopia Theme - Klik om te bekijken"
                                  />
                                  
                                  {/* Cosmic Theme Variation */}
                                  <img 
                                    src={images.cosmic}
                                    alt={`${idea.title} - Cosmic Theme`}
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(images.cosmic, '_blank');
                                    }}
                                    title="Cosmic Theme - Klik om te bekijken"
                                  />
                                  
                                  {/* Cyberpunk Theme Variation */}
                                  <img 
                                    src={images.cyberpunk}
                                    alt={`${idea.title} - Cyberpunk Theme`}
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(images.cyberpunk, '_blank');
                                    }}
                                    title="Cyberpunk Theme - Klik om te bekijken"
                                  />
                                </>
                              )
                            })()}
                          </div>
                        </div>
                        
                        {/* Post Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-white text-lg leading-tight">
                              {idea.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(idea.id);
                                }}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                {expandedIdeas[idea.id] ? 'Verberg volledige content' : 'Toon volledige content'}
                              </Button>
                              {form.selectedIdeas.includes(idea.id) && (
                                <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                          
                          {/* Complete Content */}
                          <div className="text-sm text-gray-300 mb-4">
                            <p className="whitespace-pre-wrap leading-relaxed">
                              {expandedIdeas[idea.id] 
                                ? (idea.body || idea.excerpt || 'No content available')
                                : ((idea.body || idea.excerpt || 'No content available').substring(0, 200) + ((idea.body || idea.excerpt || '').length > 200 ? '...' : ''))
                              }
                            </p>
                          </div>
                          
                          {/* Social Media Content Preview */}
                          {expandedIdeas[idea.id] && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Social Media Content:</h5>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                              {idea.facebook && (
                                <div className="bg-gray-600 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Facebook className="w-3 h-3 text-blue-400" />
                                    <span className="text-gray-300 font-medium">Facebook</span>
                                  </div>
                                  <p className="text-gray-200 line-clamp-2">{idea.facebook}</p>
                                </div>
                              )}
                              {idea.instagram && (
                                <div className="bg-gray-600 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Instagram className="w-3 h-3 text-pink-400" />
                                    <span className="text-gray-300 font-medium">Instagram</span>
                                  </div>
                                  <p className="text-gray-200 line-clamp-2">{idea.instagram}</p>
                                </div>
                              )}
                              {idea.x && (
                                <div className="bg-gray-600 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <X className="w-3 h-3 text-blue-300" />
                                    <span className="text-gray-300 font-medium">X</span>
                                  </div>
                                  <p className="text-gray-200 line-clamp-2">{idea.x}</p>
                                </div>
                              )}
                              {idea.linkedin && (
                                <div className="bg-gray-600 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Linkedin className="w-3 h-3 text-blue-500" />
                                    <span className="text-gray-300 font-medium">LinkedIn</span>
                                  </div>
                                  <p className="text-gray-200 line-clamp-2">{idea.linkedin}</p>
                                </div>
                              )}
                              {idea.tiktok && (
                                <div className="bg-gray-600 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Video className="w-3 h-3 text-white" />
                                    <span className="text-gray-300 font-medium">TikTok</span>
                                  </div>
                                  <p className="text-gray-200 line-clamp-2">{idea.tiktok}</p>
                                </div>
                              )}
                              {idea.youtube && (
                                <div className="bg-gray-600 rounded p-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Youtube className="w-3 h-3 text-red-400" />
                                    <span className="text-gray-300 font-medium">YouTube</span>
                                  </div>
                                  <p className="text-gray-200 line-clamp-2">{idea.youtube}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No ideas to display</p>
                  <p className="text-xs mt-2">Ideas array length: {ideas.length}</p>
                </div>
              )}
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

            {/* Selected Ideas */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Selected Ideas ({form.selectedIdeas.length})</h4>
              <div className="space-y-2">
                {form.selectedIdeas.map((ideaId) => {
                  const idea = ideas.find(i => i.id === ideaId)
                  return idea ? (
                    <div key={ideaId} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{idea.title}</span>
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

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-white mb-2">
            {loading ? 'Loading preview wizard...' : 'Checking admin access...'}
          </div>
          {!isAdmin && (
            <div className="text-sm text-gray-400">
              Redirecting to client dashboard...
            </div>
          )}
        </div>
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
      <div className="flex items-center justify-between">
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
        
        {/* Next Button */}
        {form.step < 3 && (
          <Button
            onClick={() => setForm(prev => ({ ...prev, step: prev.step + 1 }))}
            disabled={
              (form.step === 1 && !form.selectedClient) ||
              (form.step === 2 && form.selectedIdeas.length === 0)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Next
          </Button>
        )}
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
                (form.step === 2 && form.selectedIdeas.length === 0)
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
