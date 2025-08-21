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
  content: string
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
    selectedChannel: '',
    selectedTemplate: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    selectedPosts: []
  })

  useEffect(() => {
    loadData()
  }, [])

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
      if (storedPosts) {
        try {
          const postIds = JSON.parse(storedPosts)
          setForm(prev => ({ ...prev, selectedPosts: postIds }))
          sessionStorage.removeItem('selectedPostIds') // Clean up
        } catch (error) {
          console.error('Error parsing stored post IDs:', error)
        }
      }

              // Load the actual selected blog posts from database
        if (form.selectedPosts.length > 0) {
          const { data, error } = (await supabase
            .from('blog_posts' as any)
            .select('id, title, content, body, excerpt, category, facebook, instagram, x, linkedin, featured_image')
            .in('id', form.selectedPosts)) as any

        if (error) {
          console.error('Error loading selected posts:', error)
        } else {
          // Transform the data to match our interface
          const transformedPosts: BlogPost[] = (data || []).map((post: any) => ({
            id: post.id,
            title: post.title || 'Geen titel',
            content: post.content || '',
            body: post.body || post.content || '',
            excerpt: post.excerpt || (post.body || post.content ? (post.body || post.content).substring(0, 150) + '...' : 'Geen content'),
            category: post.category || 'Algemeen',
            facebook: post.facebook || null,
            instagram: post.instagram || null,
            x: post.x || null,
            linkedin: post.linkedin || null,
            featured_image: post.featured_image || null
          }))
          setBlogPosts(transformedPosts)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
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
            <h3 className="text-lg font-semibold">Select a Client</h3>
            <div className="grid gap-3">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setForm(prev => ({ ...prev, selectedClient: client.id }))}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    form.selectedClient === client.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.organization}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                    {form.selectedClient === client.id && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
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
             <h3 className="text-lg font-semibold">Select Content Template</h3>
             <p className="text-sm text-gray-600 mb-4">
               Choose a template for your content. The first 4 options are social media shortlinks, 
               or create a custom blog post.
             </p>
             
             {/* Show selected posts info */}
             {form.selectedPosts.length > 0 && (
               <div className="p-4 bg-blue-50 rounded-lg mb-4">
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
                         ? 'border-blue-500 bg-blue-50'
                         : 'border-gray-600 hover:border-gray-500'
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
                           <span className="font-medium">{template}</span>
                           {template === 'Facebook' && <p className="text-sm text-gray-600">Facebook shortlink template</p>}
                           {template === 'Instagram' && <p className="text-sm text-gray-600">Instagram shortlink template</p>}
                           {template === 'X (Twitter)' && <p className="text-sm text-gray-600">X (Twitter) shortlink template</p>}
                           {template === 'LinkedIn' && <p className="text-sm text-gray-600">LinkedIn shortlink template</p>}
                           {template === 'Blog Post' && <p className="text-sm text-gray-600">Blog post template</p>}
                           {template === 'Custom Post' && <p className="text-sm text-gray-600">Custom content template</p>}
                           
                           {/* Show template preview if post is selected */}
                           {selectedPost && (
                             <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                               {template === 'Facebook' && selectedPost.facebook && (
                                 <div>
                                   <p className="font-medium">Facebook Link:</p>
                                   <p className="text-blue-600 break-all">{selectedPost.facebook}</p>
                                 </div>
                               )}
                               {template === 'Instagram' && selectedPost.instagram && (
                                 <div>
                                   <p className="font-medium">Instagram Link:</p>
                                   <p className="text-pink-600 break-all">{selectedPost.instagram}</p>
                                 </div>
                               )}
                               {template === 'X (Twitter)' && selectedPost.x && (
                                 <div>
                                   <p className="font-medium">X (Twitter) Link:</p>
                                   <p className="text-black break-all">{selectedPost.x}</p>
                                 </div>
                               )}
                               {template === 'LinkedIn' && selectedPost.linkedin && (
                                 <div>
                                   <p className="font-medium">LinkedIn Link:</p>
                                   <p className="text-blue-700 break-all">{selectedPost.linkedin}</p>
                                 </div>
                               )}
                               {template === 'Blog Post' && (
                                 <div>
                                   <p className="font-medium">Blog Content:</p>
                                   <p className="text-gray-700 line-clamp-2">{(selectedPost.body || selectedPost.content || '').substring(0, 100)}...</p>
                                 </div>
                               )}
                               {template === 'Custom Post' && (
                                 <div>
                                   <p className="font-medium">Custom Content:</p>
                                   <p className="text-gray-700">Write your own content</p>
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                         {form.selectedTemplate === template && (
                           <CheckCircle className="w-5 h-5 text-blue-500" />
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
             <h3 className="text-lg font-semibold">Draft Your Content</h3>
             
             {/* Template info */}
             {form.selectedTemplate && (
               <div className="p-3 bg-blue-50 rounded-lg">
                 <h4 className="font-medium text-blue-900 mb-2">Selected Template: {form.selectedTemplate}</h4>
                 {form.selectedPosts.length > 0 && (
                   <div className="text-sm text-blue-800">
                     {blogPosts.find(p => p.id === form.selectedPosts[0])?.title}
                   </div>
                 )}
               </div>
             )}
             
             <div className="space-y-3">
               <label className="text-sm font-medium text-gray-700">Content Message</label>
               <Textarea
                 value={form.content}
                 onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                 placeholder="Write your content message here..."
                 rows={6}
                 className="resize-none"
               />
               <div className="flex items-center justify-between text-sm text-gray-500">
                 <span>Character count: {form.content.length}</span>
                 <span>Max: 280 characters</span>
               </div>
               
               {/* Auto-fill buttons for social media templates */}
               {form.selectedTemplate && form.selectedPosts.length > 0 && (
                 <div className="space-y-2">
                   <p className="text-sm text-gray-600">Quick fill options:</p>
                   <div className="flex flex-wrap gap-2">
                     {form.selectedTemplate === 'Facebook' && (
                       <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                           if (post?.facebook) {
                             setForm(prev => ({ ...prev, content: `Check out this amazing content: ${post.facebook}` }))
                           }
                         }}
                         className="text-blue-600 border-blue-200 hover:bg-blue-50"
                       >
                         Use Facebook Link
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
                             setForm(prev => ({ ...prev, content: `Check out this amazing content: ${post.instagram}` }))
                           }
                         }}
                         className="text-pink-600 border-pink-200 hover:bg-pink-50"
                       >
                         Use Instagram Link
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
                             setForm(prev => ({ ...prev, content: `Check out this amazing content: ${post.x}` }))
                           }
                         }}
                         className="text-black border-gray-200 hover:bg-gray-50"
                       >
                         Use X (Twitter) Link
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
                             setForm(prev => ({ ...prev, content: `Check out this amazing content: ${post.linkedin}` }))
                           }
                         }}
                         className="text-blue-700 border-blue-200 hover:bg-blue-50"
                       >
                         Use LinkedIn Link
                       </Button>
                     )}
                     {form.selectedTemplate === 'Blog Post' && (
                       <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const post = blogPosts.find(p => p.id === form.selectedPosts[0])
                           if (post?.body || post?.content) {
                             setForm(prev => ({ ...prev, content: (post.body || post.content || '').substring(0, 280) }))
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
            <h3 className="text-lg font-semibold">Schedule & Review</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Publish Date</label>
                <Input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Publish Time</label>
                <Input
                  type="time"
                  value={form.scheduledTime}
                  onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
            </div>

            {/* Review Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Preview Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-medium">
                    {clients.find(c => c.id === form.selectedClient)?.name || 'Not selected'}
                  </span>
                </div>

                                 <div className="flex justify-between">
                   <span className="text-gray-600">Template:</span>
                   <span className="font-medium">{form.selectedTemplate || 'Not selected'}</span>
                 </div>
                 {form.selectedTemplate && form.selectedPosts.length > 0 && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Post:</span>
                     <span className="font-medium">{blogPosts.find(p => p.id === form.selectedPosts[0])?.title || 'Unknown'}</span>
                   </div>
                 )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">
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
            <h3 className="text-lg font-semibold">Save Preview</h3>
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-900 mb-2">Ready to Save!</h4>
              <p className="text-gray-600 mb-6">
                Your preview is ready to be saved. Review the details below and click save to create the preview.
              </p>
              
              <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg text-left">
                <h5 className="font-medium text-gray-900 mb-3">Final Review</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">
                      {clients.find(c => c.id === form.selectedClient)?.name}
                    </span>
                  </div>

                                     <div className="flex justify-between">
                     <span className="text-gray-600">Template:</span>
                     <span className="font-medium">{form.selectedTemplate}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Content:</span>
                     <span className="font-medium">{form.content.length} characters</span>
                   </div>
                   {form.selectedPosts.length > 0 && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Post:</span>
                       <span className="font-medium">{blogPosts.find(p => p.id === form.selectedPosts[0])?.title || 'Unknown'}</span>
                     </div>
                   )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheduled:</span>
                    <span className="font-medium">
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading preview wizard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Step {form.step}: {getStepTitle(form.step)}
          </CardTitle>
          <p className="text-center text-gray-600">
            {getStepDescription(form.step)}
          </p>
        </CardHeader>
        <CardContent>
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
