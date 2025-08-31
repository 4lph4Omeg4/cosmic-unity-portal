import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  organization: string
}

interface BlogPost {
  id: string
  title: string
  body?: string
  excerpt?: string
  category?: string
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
  selectedTemplates: string[]
  scheduledDate: string
  scheduledTime: string
  selectedPosts: string[]
  adminNotes: string
}

const templates = [
  'Facebook',
  'Instagram', 
  'X (Twitter)',
  'LinkedIn',
  'Blog Post',
  'Custom Post'
]

export default function TimelineAlchemyPreviewWizard() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<PreviewForm>({
    step: 1,
    selectedClient: '',
    selectedTemplates: templates, // Automatically select all available platforms
    scheduledDate: '',
    scheduledTime: '',
    selectedPosts: [],
    adminNotes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  // Load blog posts when selectedPosts changes
  useEffect(() => {
    if (form.selectedPosts.length > 0) {
      loadBlogPosts(form.selectedPosts)
    }
  }, [form.selectedPosts])





  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load real clients from profiles table (users with role = 'client')
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select(`
          id,
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
          id: client.user_id, // Use user_id as the client ID
          name: client.display_name || 'Unnamed Client',
          email: 'No email', // Profiles don't have email, would need to join with auth.users
          organization: 'Client Account' // These are individual client accounts
        }))
        setClients(transformedClients)
      } else {
        setClients([])
      }

      // Load selected posts from sessionStorage if coming from Posts page
      const storedPosts = sessionStorage.getItem('selectedPostIds')
      if (storedPosts) {
        try {
          const postIds = JSON.parse(storedPosts)
          
          setForm(prev => ({ ...prev, selectedPosts: postIds }))
          sessionStorage.removeItem('selectedPostIds') // Clean up
          
          // Load blog posts immediately after setting selectedPosts
          await loadBlogPosts(postIds)
        } catch (error) {
          console.error('Error parsing stored post IDs:', error)
        }
      } else {
        // Load all available blog posts for preview creation
        await loadBlogPosts()
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load all available blog posts for preview creation
  const loadBlogPosts = async (postIds?: string[]) => {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      // If specific post IDs are provided, filter by them
      if (postIds && postIds.length > 0) {
        query = query.in('id', postIds)
      }
      
      const { data, error } = await query
      
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
          tags: Array.isArray(post.tags) ? post.tags : (post.tags ? String(post.tags).split(',').map(tag => tag.trim()) : []),
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
    if (form.step < 4) {
      const newStep = form.step + 1
      setForm(prev => ({ ...prev, step: newStep }))
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
      
      if (!form.selectedClient || form.selectedTemplates.length === 0 || form.selectedPosts.length === 0) {
        console.log('Validation failed:', {
          selectedClient: form.selectedClient,
          selectedTemplates: form.selectedTemplates,
          selectedPosts: form.selectedPosts.length
        })
        alert('Please fill in all required fields: Client, Templates, and at least one Blog Post')
        return
      }

      // Get the current user ID (in a real app, this would come from auth context)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in to create previews')
        return
      }

      // Create previews for each selected post
      const previewPromises = form.selectedPosts.map(async (postId) => {
        const post = blogPosts.find(p => p.id === postId)
        if (!post) return null
        
        // Create a separate idea for each post
        const { data: ideaData, error: ideaError } = await supabase
          .from('ideas')
          .insert({
            title: `Preview: ${post.title || 'Blog Post'}`,
            description: `Preview for ${post.title || 'Blog Post'}`,
            status: 'draft',
            created_by: user.id,
            metadata: {
              template: form.selectedTemplates.join(', '),
              channel: form.selectedTemplates.join(', '),
              selectedPosts: [postId], // Individual post for this idea
              originalPostTitle: post.title || 'Unknown Post'
            }
          })
          .select()
          .single()

        if (ideaError) {
          console.error('Error creating idea for post:', postId, ideaError)
          return { error: ideaError }
        }
        
        const ideaId = ideaData.id

        // Combine date and time for scheduled_at
        let scheduledAt = null
        if (form.scheduledDate && form.scheduledTime) {
          const scheduledDateTime = new Date(`${form.scheduledDate}T${form.scheduledTime}`)
          scheduledAt = scheduledDateTime.toISOString()
        }

        // Use the post's original content based on selected templates
        let postContent = post?.body || ''
        if (form.selectedTemplates.length > 0 && post) {
          if (form.selectedTemplates.length === 1) {
            const template = form.selectedTemplates[0]
            switch (template) {
              case 'Facebook':
                postContent = post.facebook || post.body || ''
                break
              case 'Instagram':
                postContent = post.instagram || post.body || ''
                break
              case 'LinkedIn':
                postContent = post.linkedin || post.body || ''
                break
              case 'X (Twitter)':
                postContent = post.x || post.body || ''
                break
              case 'Blog Post':
                postContent = post.body || ''
                break
              default:
                postContent = post.body || ''
            }
          } else {
            // Multiple platforms - use the post's body content
            postContent = post.body || ''
          }
        }
        
        return supabase
          .from('previews')
          .insert({
            idea_id: ideaId,
            client_id: form.selectedClient,
            channel: form.selectedTemplates.join(', '),
            template: form.selectedTemplates.join(', '),
            draft_content: {
              content: postContent,
              template: form.selectedTemplates.join(', '),
              selectedPosts: [postId], // Individual post for this preview
              image: post?.image_public_url || null,
              postTitle: post?.title || 'Unknown Post',
              originalPostContent: post?.body || null,
              platformSpecificContent: {
                facebook: post?.facebook || null,
                instagram: post?.instagram || null,
                linkedin: post?.linkedin || null,
                x: post?.x || null
              }
            },
            scheduled_at: scheduledAt,
            status: 'pending',
            created_by: user.id,
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
      case 2: return 'Select Blog Posts for Separate Previews'
      case 3: return 'Review Previews'
      case 4: return 'Schedule & Save'
      default: return ''
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Choose which client this preview is for'
      case 2: return 'Select blog posts for separate previews'
      case 3: return 'Review each post with its social media content'
      case 4: return 'Set the publishing schedule and save previews'
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
                      <p className="text-sm text-gray-300">{client.organization}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
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
            <p className="text-sm text-gray-300 mb-4">
              Choose one or more blog posts you want to promote across social platforms. 
              Each selected post will get its own separate preview entry.
            </p>
            
            {/* Multiple Selection Info */}
            <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700">
              <p className="text-sm text-blue-200">
                💡 <strong>Tip:</strong> Each selected post will get its own separate preview entry. 
                This allows the client to choose between different content options for the week.
              </p>
            </div>
            
            {/* Blog Posts Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Available Blog Posts:</h4>
                {form.selectedPosts.length > 0 && (
                  <div className="text-sm text-blue-400 font-medium">
                    {form.selectedPosts.length} post{form.selectedPosts.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
              {blogPosts.length > 0 ? (
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {blogPosts.map((post) => (
                                        <div 
                      key={post.id} 
                      className={`border rounded-lg transition-all duration-200 ${
                        form.selectedPosts.includes(post.id)
                          ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-650'
                      }`}
                    >
                      {/* Post Header */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-700/50 transition-colors"
                        onClick={() => {
                          const isSelected = form.selectedPosts.includes(post.id)
                          if (isSelected) {
                            // Deselect the post
                            setForm(prev => ({ ...prev, selectedPosts: prev.selectedPosts.filter(id => id !== post.id) }))
                          } else {
                            // Add the post to selection
                            setForm(prev => ({ ...prev, selectedPosts: [...prev.selectedPosts, post.id] }))
                          }
                        }}
                      >
                        <div className="flex gap-6">
                          {/* Post Images - Support for multiple images */}
                          <div className="flex-shrink-0">
                            <div className="grid grid-cols-2 gap-2">
                              {/* Main Image or Placeholder */}
                              {post.image_public_url ? (
                                <img 
                                  src={post.image_public_url} 
                                  alt={post.title}
                                  className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md"
                                />
                              ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg border border-gray-600 shadow-md flex items-center justify-center">
                                  <span className="text-white text-xs font-medium text-center px-2">
                                    Hoofdafbeelding<br/>Niet beschikbaar
                                  </span>
                                </div>
                              )}
                              
                              {/* Cosmic Theme Variation */}
                              <img 
                                src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cosmic.png"
                                alt={`${post.title} - Cosmic Theme`}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent post selection when clicking image
                                  window.open("https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cosmic.png", '_blank');
                                }}
                                title="Cosmic Theme - Klik om te bekijken"
                              />
                              
                              {/* Cyberpunk Theme Variation */}
                              <img 
                                src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cyberpunk.png"
                                alt={`${post.title} - Cyberpunk Theme`}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent post selection when clicking image
                                  window.open("https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cyberpunk.png", '_blank');
                                }}
                                title="Cyberpunk Theme - Klik om te bekijken"
                              />
                              
                              {/* Dystopia Theme Variation */}
                              <img 
                                src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-dystopia.png"
                                alt={`${post.title} - Dystopia Theme`}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent post selection when clicking image
                                  window.open("https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-dystopia.png", '_blank');
                                }}
                                title="Dystopia Theme - Klik om te bekijken"
                              />
                            </div>
                          </div>
                          
                          {/* Post Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="font-semibold text-white text-xl leading-tight">{post.title}</h5>
                              {/* Selection Indicator */}
                              {form.selectedPosts.includes(post.id) ? (
                                <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 ml-2" />
                              ) : (
                                <div className="w-6 h-6 border-2 border-gray-500 rounded-full flex-shrink-0 ml-2"></div>
                              )}
                            </div>
                            
                            {/* Excerpt */}
                            <p className="text-gray-300 mb-4 leading-relaxed text-base">
                              {post.excerpt || post.body?.substring(0, 300) || 'No content preview available'}
                              {post.body && post.body.length > 300 && '...'}
                            </p>
                            
                            {/* Selection Button */}
                            <div className="mb-4">
                              {form.selectedPosts.includes(post.id) ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 border-red-500 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setForm(prev => ({ 
                                      ...prev, 
                                      selectedPosts: prev.selectedPosts.filter(id => id !== post.id) 
                                    }));
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Deselect Post
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setForm(prev => ({ 
                                      ...prev, 
                                      selectedPosts: [...prev.selectedPosts, post.id] // Add to existing selection
                                    }));
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Select Post
                                </Button>
                              )}
                            </div>
                            
                            {/* Post Metadata & Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              {/* Tags Badges */}
                              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                                <>
                                  {post.tags.map((tag: string, index: number) => (
                                    <span 
                                      key={index}
                                      className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </>
                              )}
                              
                              {/* Fallback for non-array tags - split by comma */}
                              {post.tags && !Array.isArray(post.tags) && (
                                <>
                                  {String(post.tags).split(',').map((tag: string, index: number) => (
                                    <span 
                                      key={index}
                                      className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full"
                                    >
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </>
                              )}
                              
                              {/* Image Badge */}
                              {post.image_public_url && (
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                  <span>📷</span>
                                  <span>Image</span>
                                </span>
                              )}
                              
                              {/* Featured Badge */}
                              {post.featured_image && (
                                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                  <span>⭐</span>
                                  <span>Featured</span>
                                </span>
                              )}
                              
                              {/* Content Type Badge */}
                              {post.body && (
                                <span className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                                  {post.body.length > 1000 ? 'Long Form' : 'Standard'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expandable Content Section */}
                      {form.selectedPosts.includes(post.id) && (
                        <div className="border-t border-gray-600 bg-gray-800/50">
                          <div className="p-4 space-y-4">
                            {/* Full Content Preview */}
                            <div>
                              <h6 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                                <span>📖</span>
                                <span>Volledige Content</span>
                              </h6>
                              <div className="bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                                  {post.body || 'Geen content beschikbaar'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Social Media Content Previews */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Facebook Content */}
                              {post.facebook && (
                                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
                                  <h6 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                                    <span>📘</span>
                                    <span>Facebook</span>
                                  </h6>
                                  <p className="text-sm text-blue-200 whitespace-pre-wrap">
                                    {post.facebook}
                                  </p>
                                </div>
                              )}
                              
                              {/* Instagram Content */}
                              {post.instagram && (
                                <div className="bg-pink-900/20 rounded-lg p-3 border border-pink-700">
                                  <h6 className="font-medium text-pink-300 mb-2 flex items-center gap-2">
                                    <span>📷</span>
                                    <span>Instagram</span>
                                  </h6>
                                  <p className="text-sm text-pink-200 whitespace-pre-wrap">
                                    {post.instagram}
                                  </p>
                                </div>
                              )}
                              
                              {/* X (Twitter) Content */}
                              {post.x && (
                                <div className="bg-gray-900/20 rounded-lg p-3 border border-gray-700">
                                  <h6 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <span>🐦</span>
                                    <span>X (Twitter)</span>
                                  </h6>
                                  <p className="text-sm text-gray-200 whitespace-pre-wrap">
                                    {post.x}
                                  </p>
                                </div>
                              )}
                              
                              {/* LinkedIn Content */}
                              {post.linkedin && (
                                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
                                  <h6 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                                    <span>💼</span>
                                    <span>LinkedIn</span>
                                  </h6>
                                  <p className="text-sm text-blue-200 whitespace-pre-wrap">
                                    {post.linkedin}
                                  </p>
                                </div>
                                )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-sm text-gray-400">
                                Klik nogmaals om te deselecteren
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                  Geselecteerd
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <p className="text-gray-300">No blog posts available. You can create custom content in the next step.</p>
                </div>
              )}
            </div>
            
            {/* Show selected post info */}
            {form.selectedPosts.length > 0 && (
              <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                <h4 className="font-medium text-blue-300 mb-2">Selected Main Post:</h4>
                <div className="space-y-2">
                  {form.selectedPosts.map((postId) => {
                    const post = blogPosts.find(p => p.id === postId)
                    return post ? (
                      <div key={post.id} className="flex items-center gap-3">
                        {post.image_public_url && (
                          <img 
                            src={post.image_public_url} 
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded border border-blue-600"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-200">{post.title}</span>
                          </div>
                          <p className="text-xs text-blue-300">
                            This post will be your main content across all platforms
                          </p>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Preview Overview & Review</h3>
              <p className="text-gray-400">Review each selected post with its social media content before scheduling</p>
            </div>
            
            {/* Individual Post Reviews */}
            {form.selectedPosts.map((postId, index) => {
              const post = blogPosts.find(p => p.id === postId)
              if (!post) return null
              
              return (
                <div key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  {/* Post Header */}
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Post {index + 1} of {form.selectedPosts.length}
                    </h4>
                    <h5 className="text-lg font-medium text-blue-300">{post.title}</h5>
                  </div>
                  
                  {/* Post Images - All 4 variations */}
                  <div className="mb-6">
                    <h6 className="font-medium text-white mb-3 flex items-center">
                      <span className="text-2xl mr-2">🖼️</span>
                      Post Images
                    </h6>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Main Image */}
                      {post.image_public_url ? (
                        <div className="text-center">
                          <img 
                            src={post.image_public_url} 
                            alt={post.title}
                            className="w-full h-32 object-cover rounded-lg shadow-lg border border-gray-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() => window.open(post.image_public_url, '_blank')}
                            title="Hoofdafbeelding - Klik om te bekijken"
                          />
                          <p className="text-xs text-gray-400 mt-1">Hoofdafbeelding</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg border border-gray-600 shadow-md flex items-center justify-center">
                            <span className="text-white text-xs font-medium text-center px-2">
                              Hoofdafbeelding<br/>Niet beschikbaar
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Hoofdafbeelding</p>
                        </div>
                      )}
                      
                      {/* Cosmic Theme */}
                      <div className="text-center">
                        <img 
                          src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cosmic.png"
                          alt={`${post.title} - Cosmic Theme`}
                          className="w-full h-32 object-cover rounded-lg shadow-lg border border-gray-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onClick={() => window.open("https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cosmic.png", '_blank')}
                          title="Cosmic Theme - Klik om te bekijken"
                        />
                        <p className="text-xs text-gray-400 mt-1">Cosmic Theme</p>
                      </div>
                      
                      {/* Cyberpunk Theme */}
                      <div className="text-center">
                        <img 
                          src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cyberpunk.png"
                          alt={`${post.title} - Cyberpunk Theme`}
                          className="w-full h-32 object-cover rounded-lg shadow-lg border border-gray-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onClick={() => window.open("https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cyberpunk.png", '_blank')}
                          title="Cyberpunk Theme - Klik om te bekijken"
                        />
                        <p className="text-xs text-gray-400 mt-1">Cyberpunk Theme</p>
                      </div>
                      
                      {/* Dystopia Theme */}
                      <div className="text-center">
                        <img 
                          src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-dystopia.png"
                          alt={`${post.title} - Dystopia Theme`}
                          className="w-full h-32 object-cover rounded-lg shadow-lg border border-gray-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onClick={() => window.open("https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-dystopia.png", '_blank')}
                          title="Dystopia Theme - Klik om te bekijken"
                        />
                        <p className="text-xs text-gray-400 mt-1">Dystopia Theme</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blog Content */}
                  <div className="mb-6">
                    <h6 className="font-medium text-white mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-green-400" />
                      Blog Content
                    </h6>
                    <div className="bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <p className="text-gray-200 whitespace-pre-wrap text-sm">
                        {post.body || 'No blog content available'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Social Media Content */}
                  <div className="mb-6">
                    <h6 className="font-medium text-white mb-3 flex items-center">
                      <Share2 className="w-4 h-4 mr-2 text-blue-400" />
                      Social Media Content
                    </h6>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Facebook */}
                      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📘</span>
                          <span className="font-medium text-blue-300">Facebook</span>
                        </div>
                        <div className="bg-gray-800 rounded p-3 min-h-20">
                          {post.facebook ? (
                            <p className="text-gray-200 text-sm whitespace-pre-wrap">{post.facebook}</p>
                          ) : (
                            <p className="text-gray-400 text-sm italic">No Facebook content available</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Instagram */}
                      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📷</span>
                          <span className="font-medium text-pink-300">Instagram</span>
                        </div>
                        <div className="bg-gray-800 rounded p-3 min-h-20">
                          {post.instagram ? (
                            <p className="text-gray-200 text-sm whitespace-pre-wrap">{post.instagram}</p>
                          ) : (
                            <p className="text-gray-400 text-sm italic">No Instagram content available</p>
                          )}
                        </div>
                      </div>
                      
                      {/* LinkedIn */}
                      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">💼</span>
                          <span className="font-medium text-blue-400">LinkedIn</span>
                        </div>
                        <div className="bg-gray-800 rounded p-3 min-h-20">
                          {post.linkedin ? (
                            <p className="text-gray-200 text-sm whitespace-pre-wrap">{post.linkedin}</p>
                          ) : (
                            <p className="text-gray-400 text-sm italic">No LinkedIn content available</p>
                          )}
                        </div>
                      </div>
                      
                      {/* X (Twitter) */}
                      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🐦</span>
                          <span className="font-medium text-gray-300">X (Twitter)</span>
                        </div>
                        <div className="bg-gray-800 rounded p-3 min-h-20">
                          {post.x ? (
                            <p className="text-gray-200 text-sm whitespace-pre-wrap">{post.x}</p>
                          ) : (
                            <p className="text-gray-400 text-sm italic">No X (Twitter) content available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Metadata */}
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <h6 className="font-medium text-white mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Post Details
                    </h6>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Title:</span>
                        <span className="text-gray-200">{post.title}</span>
                      </div>
                      {post.excerpt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Excerpt:</span>
                          <span className="text-gray-200">{post.excerpt}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Content Length:</span>
                        <span className="text-gray-200">{post.body ? post.body.length : 0} characters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Has Image:</span>
                        <span className="text-gray-200">{post.image_public_url ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Summary Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Preview Summary
              </h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Selected Client</h5>
                  <p className="text-gray-300 text-sm">
                    {clients.find(c => c.id === form.selectedClient)?.name || 'No client selected'}
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Content Type</h5>
                  <p className="text-gray-300 text-sm">
                    {form.selectedPosts.length > 0 
                      ? `${form.selectedPosts.length} Separate Preview${form.selectedPosts.length !== 1 ? 's' : ''}`
                      : 'No content selected'
                    }
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Platforms</h5>
                  <p className="text-gray-300 text-sm">
                    {form.selectedTemplates.length > 0 ? form.selectedTemplates.join(', ') : 'No platforms selected'}
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Preview Status</h5>
                  <p className="text-green-400 text-sm font-medium">Ready for Scheduling</p>
                </div>
              </div>
            </div>
          </div>
        )

      // OLD CASE 5 - REMOVED - Using new version below

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Ready to Save Preview!</h3>
              <p className="text-gray-400 mb-6">
                Review all details below before saving. This preview will be sent to the client for approval.
              </p>
            </div>

            {/* Debug Info */}
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-700">
              <h4 className="text-lg font-medium text-red-300 mb-2">Debug Info</h4>
              <div className="text-sm text-red-200">
                <p>Selected Templates: {form.selectedTemplates.join(', ') || 'None'}</p>
                <p>Template Count: {form.selectedTemplates.length}</p>
                <p>Form Step: {form.step}</p>
                <p>Selected Posts: {form.selectedPosts.join(', ') || 'None'}</p>
              </div>
            </div>

            {/* Client & Scheduling Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Client & Scheduling Details
              </h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Selected Client</h5>
                  <p className="text-gray-300 text-sm">
                    {clients.find(c => c.id === form.selectedClient)?.name || 'No client selected'}
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Publish Schedule</h5>
                  <p className="text-gray-300 text-sm">
                    {form.scheduledDate && form.scheduledTime 
                      ? `${form.scheduledDate} at ${form.scheduledTime}`
                      : 'Not scheduled yet'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule Inputs */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-400" />
                Set Publishing Schedule
              </h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-white">Publish Date</label>
                  <Input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Publish Time</label>
                  <Input
                    type="time"
                    value={form.scheduledTime}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>





            {/* Final Summary */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Preview Summary for Client Approval
              </h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Total Platforms</h5>
                  <p className="text-gray-300 text-sm">
                    {form.selectedTemplates.length} platform{form.selectedTemplates.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Content Type</h5>
                  <p className="text-gray-300 text-sm">
                    {form.selectedPosts.length > 0 
                      ? `${form.selectedPosts.length} Separate Blog Post Preview${form.selectedPosts.length !== 1 ? 's' : ''}`
                      : 'Social Media Only'
                    }
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Approval Status</h5>
                  <p className="text-yellow-400 text-sm font-medium">Pending Client Review</p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white mb-2">Next Step</h5>
                  <p className="text-green-400 text-sm font-medium">Save & Send for Approval</p>
                </div>
              </div>
              
              {/* Selected Posts Summary */}
              {form.selectedPosts.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <h5 className="font-medium text-white mb-3">Selected Posts ({form.selectedPosts.length})</h5>
                  <div className="space-y-2">
                    {form.selectedPosts.map((postId, index) => {
                      const post = blogPosts.find(p => p.id === postId)
                      return post ? (
                        <div key={postId} className="flex items-center gap-3 p-2 bg-gray-600 rounded">
                          <span className="text-blue-400 font-medium">{index + 1}.</span>
                          <span className="text-gray-200">{post.title}</span>
                          {post.image_public_url && (
                            <span className="ml-auto text-green-400 text-xs">📷</span>
                          )}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Notes Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-yellow-400" />
                Admin Notes (Optional)
              </h4>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  Add any notes or instructions for the client about this preview.
                </p>
                <Textarea
                  value={form.adminNotes}
                  onChange={(e) => setForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                  placeholder="Add notes for the client (optional)..."
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Preview Wizard</h1>
        <p className="mt-2 text-gray-300">Maak previews in 5 eenvoudige stappen</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
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
              {step < 4 && (
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
          {form.step < 4 ? (
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
