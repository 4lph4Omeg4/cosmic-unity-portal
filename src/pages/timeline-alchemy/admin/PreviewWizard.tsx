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
  excerpt?: string
  category?: string
}

interface PreviewForm {
  step: number
  selectedClient: string
  selectedChannel: string
  selectedTemplate: string
  content: string
  scheduledDate: string
  scheduledTime: string
  selectedPosts: string[]
}

const channels = ['Instagram', 'LinkedIn', 'Twitter', 'Facebook', 'YouTube']
const templates = [
  'Blogpost',
  'Blogpost Reference AD',
  'Inspirational Quote',
  'Seen through the Single-Eye View',
  'Single-Eye Reference AD',
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
          .select('id, title, content, excerpt, category')
          .in('id', form.selectedPosts)) as any

        if (error) {
          console.error('Error loading selected posts:', error)
        } else {
          // Transform the data to match our interface
          const transformedPosts: BlogPost[] = (data || []).map((post: any) => ({
            id: post.id,
            title: post.title || 'Geen titel',
            content: post.content || '',
            excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'Geen content'),
            category: post.category || 'Algemeen'
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
    if (form.step < 6) {
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
      case 2: return 'Choose Channel'
      case 3: return 'Select Template'
      case 4: return 'Draft Content'
      case 5: return 'Schedule & Review'
      case 6: return 'Save Preview'
      default: return ''
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Choose which client this preview is for'
      case 2: return 'Select the social media platform'
      case 3: return 'Pick a content template or create custom'
      case 4: return 'Write your content message'
      case 5: return 'Set the publishing schedule and review details'
      case 6: return 'Save and create the preview'
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
            <h3 className="text-lg font-semibold">Choose Social Media Channel</h3>
            <Select value={form.selectedChannel} onValueChange={(value) => setForm(prev => ({ ...prev, selectedChannel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.selectedChannel && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{form.selectedChannel}</span>
                </p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Content Template</h3>
            <div className="grid gap-3">
              {templates.map((template) => (
                <div
                  key={template}
                  onClick={() => setForm(prev => ({ ...prev, selectedTemplate: template }))}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    form.selectedTemplate === template
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{template}</span>
                    {form.selectedTemplate === template && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Draft Your Content</h3>
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

      case 5:
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
                  <span className="text-gray-600">Channel:</span>
                  <span className="font-medium">{form.selectedChannel || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium">{form.selectedTemplate || 'Not selected'}</span>
                </div>
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

      case 6:
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
                    <span className="text-gray-600">Channel:</span>
                    <span className="font-medium">{form.selectedChannel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content:</span>
                    <span className="font-medium">{form.content.length} characters</span>
                  </div>
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
        <p className="mt-2 text-gray-300">Maak previews in 6 eenvoudige stappen</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
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
              {step < 6 && (
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
          {form.step < 6 ? (
            <Button
              onClick={nextStep}
              disabled={
                (form.step === 1 && !form.selectedClient) ||
                (form.step === 2 && !form.selectedChannel) ||
                (form.step === 3 && !form.selectedTemplate) ||
                (form.step === 4 && !form.content.trim()) ||
                (form.step === 5 && (!form.scheduledDate || !form.scheduledTime))
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
