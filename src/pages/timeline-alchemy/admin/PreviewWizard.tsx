import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Calendar,
  MessageSquare,
  Users,
  Star,
  Save
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
}

interface PreviewForm {
  step: number
  selectedClient: string
  selectedTemplate: string
  content: string
  scheduledDate: string
  scheduledTime: string
  selectedPosts: string[]
}

const channels = ['Instagram', 'LinkedIn', 'Twitter', 'Facebook', 'YouTube']
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
  const [form, setForm] = useState<PreviewForm>({
    step: 1,
    selectedClient: '',
    selectedTemplate: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    selectedPosts: []
  })

  useEffect(() => {
    loadData()
  }, [])

  // Load blog posts when selectedPosts changes
  useEffect(() => {
    console.log('useEffect triggered - selectedPosts changed:', form.selectedPosts)
    if (form.selectedPosts.length > 0) {
      loadBlogPosts(form.selectedPosts)
    }
  }, [form.selectedPosts])

  // Auto-fill content when template is selected
  useEffect(() => {
    if (form.selectedTemplate && form.selectedPosts.length > 0) {
      const post = blogPosts.find(p => p.id === form.selectedPosts[0])
      if (post) {
        let content = ''
        switch (form.selectedTemplate) {
          case 'Facebook':
            if (post.facebook) {
              content = post.facebook
            }
            break
          case 'Instagram':
            if (post.instagram) {
              content = post.instagram
            }
            break
          case 'X (Twitter)':
            if (post.x) {
              content = post.x
            }
            break
          case 'LinkedIn':
            if (post.linkedin) {
              content = post.linkedin
            }
            break
          case 'Blog Post':
            if (post.body) {
                                               content = post.body.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280)
            }
            break
          case 'Custom Post':
            content = '' // Leave empty for custom content
            break
                    default:
            content = ''
          }
          setForm(prev => ({ ...prev, content }))
        }
      }
    }, [form.selectedTemplate, form.selectedPosts, blogPosts])

  const loadData = async () => {
    try {
      // TODO: Implement actual API calls for clients
      const mockClients: Client[] = [
        { id: '1', name: 'TechCorp', email: 'contact@techcorp.com', organization: 'Technology Solutions' },
        { id: '2', name: 'Wellness Inc', email: 'hello@wellnessinc.com', organization: 'Health & Wellness' },
        { id: '3', name: 'Community Builders', email: 'team@communitybuilders.com', organization: 'Community Development' }
      ]
      
      setClients(mockClients)

      // Load selected posts from sessionStorage if coming from Posts page
      const storedPosts = sessionStorage.getItem('selectedPostIds')
      console.log('=== SESSION STORAGE CHECK ===')
      console.log('Stored posts from sessionStorage:', storedPosts)
      if (storedPosts) {
        try {
          const postIds = JSON.parse(storedPosts)
          console.log('Parsed post IDs:', postIds)
          console.log('Post IDs type:', typeof postIds)
          console.log('Post IDs length:', Array.isArray(postIds) ? postIds.length : 'not an array')
          
          setForm(prev => ({ ...prev, selectedPosts: postIds }))
          sessionStorage.removeItem('selectedPostIds') // Clean up
          
          console.log('About to call loadBlogPosts with IDs:', postIds)
          // Load blog posts immediately after setting selectedPosts
          await loadBlogPosts(postIds)
        } catch (error) {
          console.error('Error parsing stored post IDs:', error)
        }
      } else {
        console.log('No stored posts found in sessionStorage')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load blog posts when selectedPosts changes
  const loadBlogPosts = async (postIds: string[]) => {
    if (postIds.length === 0) return
    
    console.log('Loading blog posts for IDs:', postIds)
    
    try {
      // First, let's see what columns actually exist in the table
      console.log('=== CHECKING AVAILABLE COLUMNS ===')
             const { data: columnCheck, error: columnError } = await supabase
         .from('blog_posts')
         .select('*')
         .limit(1)
      
      if (columnError) {
        console.error('Error checking columns:', columnError)
      } else if (columnCheck && columnCheck.length > 0) {
        console.log('Available columns in blog_posts table:', Object.keys(columnCheck[0]))
      }

             // Now try to select the specific columns we need
       const { data, error } = await supabase
         .from('blog_posts')
         .select('*')
         .in('id', postIds)

      if (error) {
        console.error('Error loading selected posts:', error)
      } else {
        console.log('=== DATABASE QUERY RESULTS ===')
      console.log('Raw data from database:', data)
      console.log('Number of posts found:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('First post structure:', data[0])
        console.log('All available columns:', Object.keys(data[0]))
        
        // Check if social media columns exist and show their values
        if ('facebook' in data[0]) {
          console.log('✅ Facebook column exists, value:', data[0].facebook)
        } else {
          console.log('❌ Facebook column does NOT exist')
        }
        
        if ('instagram' in data[0]) {
          console.log('✅ Instagram column exists, value:', data[0].instagram)
        } else {
          console.log('❌ Instagram column does NOT exist')
        }
        
        if ('x' in data[0]) {
          console.log('✅ X column exists, value:', data[0].x)
        } else {
          console.log('❌ X column does NOT exist')
        }
        
        if ('linkedin' in data[0]) {
          console.log('✅ LinkedIn column exists, value:', data[0].linkedin)
        } else {
          console.log('❌ LinkedIn column does NOT exist')
        }
        
        if ('body' in data[0]) {
          console.log('✅ Body column exists, value:', data[0].body)
        } else {
          console.log('❌ Body column does NOT exist')
        }
      }
        // Transform the data to match our interface
        const transformedPosts: BlogPost[] = (data || []).map((post: any) => ({
          id: post.id,
          title: post.title || 'Geen titel',
          body: post.body || '',
          excerpt: post.excerpt || (post.body ? post.body.substring(0, 150) + '...' : 'Geen content'),
          category: post.category || 'Algemeen',
          facebook: 'facebook' in post ? post.facebook : null,
          instagram: 'instagram' in post ? post.instagram : null,
          x: 'x' in post ? post.x : null,
          linkedin: 'linkedin' in post ? post.linkedin : null,
          featured_image: 'featured_image' in post ? post.featured_image : null
        }))
        console.log('Transformed posts:', transformedPosts)
        setBlogPosts(transformedPosts)
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
    }
  }

  const nextStep = () => {
    if (form.step < 5) {
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
      // TODO: Implement actual API call
      console.log('Saving preview:', form)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate back to Posts page
      navigate('/timeline-alchemy/admin/ideas')
    } catch (error) {
      console.error('Error saving preview:', error)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Select Client'
      case 2: return 'Select Template'
      case 3: return 'Draft Content'
      case 4: return 'Schedule & Review'
      case 5: return 'Save Preview'
      default: return ''
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Choose which client this preview is for'
      case 2: return 'Pick a content template or create custom'
      case 3: return 'Write your content message'
      case 4: return 'Set the publishing schedule and review details'
      case 5: return 'Save and create the preview'
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
              <h3 className="text-lg font-semibold text-white">Select Content Template</h3>
              <p className="text-sm text-gray-300 mb-4">
                Choose a template for your content. The first 4 options are social media shortlinks, 
                or create a custom blog post.
              </p>
              
              {/* Show selected posts info */}
              {form.selectedPosts.length > 0 && (
                <div className="p-4 bg-blue-900/20 rounded-lg mb-4 border border-blue-700">
                  <h4 className="font-medium text-blue-300 mb-2">Selected Posts:</h4>
                  <div className="space-y-2">
                    {form.selectedPosts.map((postId) => {
                      const post = blogPosts.find(p => p.id === postId)
                      return post ? (
                        <div key={post.id} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-blue-200">{post.title}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
             
                           <div className="grid gap-3">
                {templates.map((template) => {
                  // Get the first selected post for template preview
                  const selectedPost = blogPosts.find(p => p.id === form.selectedPosts[0])
                  
                  return (
                    <div
                      key={template}
                      onClick={() => setForm(prev => ({ ...prev, selectedTemplate: template }))}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        form.selectedTemplate === template
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {template === 'Facebook' && <span className="text-2xl">📘</span>}
                          {template === 'Instagram' && <span className="text-2xl">📷</span>}
                          {template === 'X (Twitter)' && <span className="text-2xl">🐦</span>}
                          {template === 'LinkedIn' && <span className="text-2xl">💼</span>}
                          {template === 'Blog Post' && <span className="text-2xl">📝</span>}
                          {template === 'Custom Post' && <span className="text-2xl">✨</span>}
                          <div className="flex-1">
                            <span className="font-medium text-white">{template}</span>
                            {template === 'Facebook' && <p className="text-sm text-gray-300">Facebook shortlink template</p>}
                            {template === 'Instagram' && <p className="text-sm text-gray-300">Instagram shortlink template</p>}
                            {template === 'X (Twitter)' && <p className="text-sm text-gray-300">X (Twitter) shortlink template</p>}
                            {template === 'LinkedIn' && <p className="text-sm text-gray-300">LinkedIn shortlink template</p>}
                            {template === 'Blog Post' && <p className="text-sm text-gray-300">Blog post template</p>}
                            {template === 'Custom Post' && <p className="text-sm text-gray-300">Custom content template</p>}
                            
                                                        {/* Show template preview if post is selected */}
                             {selectedPost && (
                               <div className="mt-2 p-2 bg-gray-600 rounded text-xs">
                                 {template === 'Facebook' && selectedPost.facebook && (
                                   <div>
                                     <p className="font-medium text-blue-400">Facebook Content:</p>
                                     <p className="text-gray-200 whitespace-pre-wrap break-all">{selectedPost.facebook}</p>
                                   </div>
                                 )}
                                 {template === 'Instagram' && selectedPost.instagram && (
                                   <div>
                                     <p className="font-medium text-pink-400">Instagram Content:</p>
                                     <p className="text-gray-200 whitespace-pre-wrap break-all">{selectedPost.instagram}</p>
                                   </div>
                                 )}
                                 {template === 'X (Twitter)' && selectedPost.x && (
                                   <div>
                                     <p className="font-medium text-gray-300">X (Twitter) Content:</p>
                                     <p className="text-gray-200 whitespace-pre-wrap break-all">{selectedPost.x}</p>
                                   </div>
                                 )}
                                 {template === 'LinkedIn' && selectedPost.linkedin && (
                                   <div>
                                     <p className="font-medium text-blue-400">LinkedIn Content:</p>
                                     <p className="text-gray-200 whitespace-pre-wrap break-all">{selectedPost.linkedin}</p>
                                   </div>
                                 )}
                                 {template === 'Blog Post' && (
                                   <div>
                                     <p className="font-medium text-green-400">Blog Content:</p>
                                     <p className="text-gray-200 whitespace-pre-wrap">{(selectedPost.body || '').substring(0, 200)}...</p>
                                   </div>
                                 )}
                                 {template === 'Custom Post' && (
                                   <div>
                                     <p className="font-medium text-purple-400">Custom Content:</p>
                                     <p className="text-gray-200">Write your own content</p>
                                   </div>
                                 )}
                               </div>
                             )}
                          </div>
                          {form.selectedTemplate === template && (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
           </div>
         )

                           case 3:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Draft Your Content</h3>
              
              {/* Template info */}
              {form.selectedTemplate && (
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700">
                  <h4 className="font-medium text-blue-300 mb-2">Selected Template: {form.selectedTemplate}</h4>
                  {form.selectedPosts.length > 0 && (
                    <div className="text-sm text-blue-200">
                      {blogPosts.find(p => p.id === form.selectedPosts[0])?.title}
                    </div>
                  )}
                </div>
              )}
             
                           <div className="space-y-3">
                                 <label className="text-sm font-medium text-white">Content Message</label>
                
                                 {/* Show actual database content */}
                 {form.selectedTemplate && form.selectedPosts.length > 0 && (
                   <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                     <h4 className="font-medium text-blue-300 mb-3">📊 Database Content</h4>
                     <div className="space-y-3">
                       {blogPosts.find(p => p.id === form.selectedPosts[0])?.facebook && (
                         <div className="p-3 bg-white rounded border">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-blue-600 font-medium">Facebook Content:</span>
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                                 if (post?.facebook) {
                                   setForm(prev => ({ ...prev, content: post.facebook }))
                                 }
                               }}
                               className="text-xs h-6 px-2"
                             >
                               Use This
                             </Button>
                           </div>
                           <p className="text-sm text-gray-800 whitespace-pre-wrap">{blogPosts.find(p => p.id === form.selectedPosts[0])?.facebook}</p>
                         </div>
                       )}
                       {blogPosts.find(p => p.id === form.selectedPosts[0])?.instagram && (
                         <div className="p-3 bg-white rounded border">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-pink-600 font-medium">Instagram Content:</span>
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                                 if (post?.instagram) {
                                   setForm(prev => ({ ...prev, content: post.instagram }))
                                 }
                               }}
                               className="text-xs h-6 px-2"
                             >
                               Use This
                             </Button>
                           </div>
                           <p className="text-sm text-gray-800 whitespace-pre-wrap">{blogPosts.find(p => p.id === form.selectedPosts[0])?.instagram}</p>
                         </div>
                       )}
                       {blogPosts.find(p => p.id === form.selectedPosts[0])?.x && (
                         <div className="p-3 bg-white rounded border">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-black font-medium">X (Twitter) Content:</span>
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                                 if (post?.x) {
                                   setForm(prev => ({ ...prev, content: post.x }))
                                 }
                               }}
                               className="text-xs h-6 px-2"
                             >
                               Use This
                             </Button>
                           </div>
                           <p className="text-sm text-gray-800 whitespace-pre-wrap">{blogPosts.find(p => p.id === form.selectedPosts[0])?.x}</p>
                         </div>
                       )}
                       {blogPosts.find(p => p.id === form.selectedPosts[0])?.linkedin && (
                         <div className="p-3 bg-white rounded border">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-blue-700 font-medium">LinkedIn Content:</span>
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                                 if (post?.linkedin) {
                                   setForm(prev => ({ ...prev, content: post.linkedin }))
                                 }
                               }}
                               className="text-xs h-6 px-2"
                             >
                               Use This
                             </Button>
                           </div>
                           <p className="text-sm text-gray-800 whitespace-pre-wrap">{blogPosts.find(p => p.id === form.selectedPosts[0])?.linkedin}</p>
                         </div>
                       )}
                       {blogPosts.find(p => p.id === form.selectedPosts[0])?.body && (
                         <div className="p-3 bg-white rounded border">
                           <div className="flex items-center gap-2 mb-2">
                             <span className="text-green-600 font-medium">Blog Body Content:</span>
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                                 if (post?.body) {
                                   setForm(prev => ({ ...prev, content: post.body.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                                 }
                               }}
                               className="text-xs h-6 px-2"
                             >
                               Use This
                             </Button>
                           </div>
                           <p className="text-sm text-gray-800 whitespace-pre-wrap">{blogPosts.find(p => p.id === form.selectedPosts[0])?.body}</p>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
                
                                 <Textarea
                   value={form.content}
                   onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                   placeholder="Write your content message here..."
                   rows={form.selectedTemplate === 'Blog Post' ? 12 : 6}
                   maxLength={form.selectedTemplate === 'Blog Post' ? 2000 : 280}
                   className="resize-none bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                 />
                 <div className="flex items-center justify-between text-sm text-gray-400">
                   <span>Character count: {form.content.length}</span>
                   <span>Max: {form.selectedTemplate === 'Blog Post' ? '2000 characters' : '280 characters'}</span>
                 </div>
               
                               {/* Auto-fill buttons for social media templates */}
                {form.selectedTemplate && form.selectedPosts.length > 0 && (
                  <div className="space-y-2">
                                         <p className="text-sm text-gray-300">Quick fill options:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setForm(prev => ({ ...prev, content: '' }))}
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        Clear Content
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                          if (post) {
                            let content = ''
                            switch (form.selectedTemplate) {
                              case 'Facebook':
                                if (post.facebook) {
                                  // Use the actual Facebook content from database
                                  const facebookContent = post.facebook
                                  content = `🔥 ${post.title}\n\n${post.excerpt || 'Check out this amazing content!'}\n\n${facebookContent}\n\n#content #socialmedia #facebook`
                                }
                                break
                              case 'Instagram':
                                if (post.instagram) {
                                  // Use the actual Instagram content from database
                                  const instagramContent = post.instagram
                                  content = `📸 ${post.title}\n\n${post.excerpt || 'Amazing content alert! 🚀'}\n\n${instagramContent}\n\n#instagram #content #socialmedia #trending`
                                }
                                break
                              case 'X (Twitter)':
                                if (post.x) {
                                  // Use the actual X (Twitter) content from database
                                  const xContent = post.x
                                  content = `🐦 ${post.title}\n\n${post.excerpt || 'Must-read content! 💡'}\n\n${xContent}\n\n#twitter #content #socialmedia #insights`
                                }
                                break
                              case 'LinkedIn':
                                if (post.linkedin) {
                                  // Use the actual LinkedIn content from database
                                  const linkedinContent = post.linkedin
                                  content = `💼 ${post.title}\n\n${post.excerpt || 'Professional insights worth sharing!'}\n\n${linkedinContent}\n\n#linkedin #professional #content #networking`
                                }
                                break
                              case 'Blog Post':
                                content = `📝 ${post.title}\n\n${(post.body || '').substring(0, 200)}...\n\n#blog #content #writing #insights`
                                break
                              default:
                                content = `✨ ${post.title}\n\n${post.excerpt || 'Amazing content to share!'}\n\n#content #socialmedia #sharing`
                            }
                            setForm(prev => ({ ...prev, content: content.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                          }
                        }}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        Smart Fill
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                          if (post) {
                            let content = ''
                            switch (form.selectedTemplate) {
                              case 'Facebook':
                                if (post.facebook) {
                                  content = post.facebook
                                }
                                break
                              case 'Instagram':
                                if (post.instagram) {
                                  content = post.instagram
                                }
                                break
                              case 'X (Twitter)':
                                if (post.x) {
                                  content = post.x
                                }
                                break
                              case 'LinkedIn':
                                if (post.linkedin) {
                                  content = post.linkedin
                                }
                                break
                              case 'Blog Post':
                                content = (post.body || '').substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280)
                                break
                              default:
                                content = post.excerpt || 'No content available'
                            }
                            setForm(prev => ({ ...prev, content }))
                          }
                        }}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        Raw Database Content
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                          console.log('=== DEBUG DATA ===')
                          console.log('Current post data:', post)
                          console.log('Facebook content:', post?.facebook)
                          console.log('Instagram content:', post?.instagram)
                          console.log('X content:', post?.x)
                          console.log('LinkedIn content:', post?.linkedin)
                          console.log('Blog posts state:', blogPosts)
                          console.log('Selected posts:', form.selectedPosts)
                          console.log('Selected template:', form.selectedTemplate)
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Debug Data
                      </Button>
                                           {form.selectedTemplate === 'Facebook' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                            if (post?.facebook) {
                              // Use the actual Facebook content from database if available
                              const facebookContent = post.facebook
                              const content = `🔥 ${post.title}\n\n${post.excerpt || 'Check out this amazing content!'}\n\n${facebookContent}\n\n#content #socialmedia #facebook`
                              setForm(prev => ({ ...prev, content: content.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                            }
                          }}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Use Facebook Content
                        </Button>
                      )}
                      {form.selectedTemplate === 'Instagram' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                            if (post?.instagram) {
                              // Use the actual Instagram content from database if available
                              const instagramContent = post.instagram
                              const content = `📸 ${post.title}\n\n${post.excerpt || 'Amazing content alert! 🚀'}\n\n${instagramContent}\n\n#instagram #content #socialmedia #trending`
                              setForm(prev => ({ ...prev, content: content.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                            }
                          }}
                          className="text-pink-600 border-pink-200 hover:bg-pink-50"
                        >
                          Use Instagram Content
                        </Button>
                      )}
                      {form.selectedTemplate === 'X (Twitter)' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                            if (post?.x) {
                              // Use the actual X (Twitter) content from database if available
                              const xContent = post.x
                              const content = `🐦 ${post.title}\n\n${post.excerpt || 'Must-read content! 💡'}\n\n${xContent}\n\n#twitter #content #socialmedia #insights`
                              setForm(prev => ({ ...prev, content: content.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                            }
                          }}
                          className="text-black border-gray-200 hover:bg-gray-50"
                        >
                          Use X (Twitter) Content
                        </Button>
                      )}
                      {form.selectedTemplate === 'LinkedIn' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                            if (post?.linkedin) {
                              // Use the actual LinkedIn content from database if available
                              const linkedinContent = post.linkedin
                              const content = `💼 ${post.title}\n\n${post.excerpt || 'Professional insights worth sharing!'}\n\n${linkedinContent}\n\n#linkedin #professional #content #networking`
                              setForm(prev => ({ ...prev, content: content.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                            }
                          }}
                          className="text-blue-700 border-blue-200 hover:bg-blue-50"
                        >
                          Use LinkedIn Content
                        </Button>
                      )}
                      {form.selectedTemplate === 'Blog Post' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                                                                                      if (post?.body) {
                              const content = `📝 ${post.title}\n\n${(post.body || '').substring(0, 200)}...\n\n#blog #content #writing #insights`
                              setForm(prev => ({ ...prev, content: content.substring(0, form.selectedTemplate === 'Blog Post' ? 2000 : 280) }))
                            }
                          }}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Use Blog Content
                        </Button>
                      )}
                   </div>
                 </div>
               )}
             </div>
            
            {form.selectedPosts.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Posts:</h4>
                <div className="space-y-2">
                  {form.selectedPosts.map((postId) => {
                    const post = blogPosts.find(p => p.id === postId)
                    return post ? (
                      <div key={post.id} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-800">{post.title}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        )

             case 4:
         return (
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-white">Schedule & Review</h3>
             <div className="grid gap-4">
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

             {/* Review Summary */}
             <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
               <h4 className="font-medium text-white mb-3">Preview Summary</h4>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-300">Client:</span>
                   <span className="font-medium text-white">
                     {clients.find(c => c.id === form.selectedClient)?.name || 'Not selected'}
                   </span>
                 </div>

                                  <div className="flex justify-between">
                    <span className="text-gray-300">Template:</span>
                    <span className="font-medium text-white">{form.selectedTemplate || 'Not selected'}</span>
                  </div>
                  {form.selectedTemplate && form.selectedPosts.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Post:</span>
                      <span className="font-medium text-white">{blogPosts.find(p => p.id === form.selectedPosts[0])?.title || 'Unknown'}</span>
                    </div>
                  )}
                 <div className="flex justify-between">
                   <span className="text-gray-300">Scheduled:</span>
                   <span className="font-medium text-white">
                     {form.scheduledDate && form.scheduledTime 
                       ? `${form.scheduledDate} at ${form.scheduledTime}`
                       : 'Not scheduled'
                     }
                   </span>
                 </div>
               </div>
             </div>
           </div>
         )

             case 5:
         return (
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-white">Save Preview</h3>
             <div className="text-center py-8">
               <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
               <h4 className="text-xl font-medium text-white mb-2">Ready to Save!</h4>
               <p className="text-gray-300 mb-6">
                 Your preview is ready to be saved. Review the details below and click save to create the preview.
               </p>
               
               <div className="max-w-md mx-auto p-4 bg-gray-700 rounded-lg text-left border border-gray-600">
                 <h5 className="font-medium text-white mb-3">Final Review</h5>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-300">Client:</span>
                     <span className="font-medium text-white">
                       {clients.find(c => c.id === form.selectedClient)?.name}
                     </span>
                   </div>

                                      <div className="flex justify-between">
                      <span className="text-gray-300">Template:</span>
                      <span className="font-medium text-white">{form.selectedTemplate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Content:</span>
                      <span className="font-medium text-white">{form.content.length} characters</span>
                    </div>
                    {form.selectedPosts.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Post:</span>
                        <span className="font-medium text-white">{blogPosts.find(p => p.id === form.selectedPosts[0])?.title || 'Unknown'}</span>
                      </div>
                    )}
                   <div className="flex justify-between">
                     <span className="text-gray-300">Scheduled:</span>
                     <span className="font-medium text-white">
                       {form.scheduledDate} at {form.scheduledTime}
                     </span>
                   </div>
                 </div>
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
          {[1, 2, 3, 4, 5].map((step) => (
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
              {step < 5 && (
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
          {form.step < 5 ? (
            <Button
              onClick={nextStep}
              disabled={
                (form.step === 1 && !form.selectedClient) ||
                (form.step === 2 && !form.selectedTemplate) ||
                (form.step === 3 && !form.content.trim()) ||
                (form.step === 4 && (!form.scheduledDate || !form.scheduledTime))
              }
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Save Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
