'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Check, Calendar } from 'lucide-react'
import { getClients, createPreview } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  contact_email: string | null
  organizations: {
    name: string
  }
}

interface WizardStep {
  id: string
  title: string
  description: string
}

const steps: WizardStep[] = [
  { id: 'client', title: 'Client', description: 'Select the client for this preview' },
  { id: 'channel', title: 'Channel', description: 'Choose the social media channel' },
  { id: 'template', title: 'Template', description: 'Select a content template' },
  { id: 'draft', title: 'Draft', description: 'Create the content draft' },
  { id: 'schedule', title: 'Schedule', description: 'Set the publishing schedule' },
  { id: 'save', title: 'Save', description: 'Review and save the preview' }
]

const channels = [
  { id: 'twitter', name: 'Twitter', description: 'Short-form content, 280 characters' },
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional content, longer posts' },
  { id: 'instagram', name: 'Instagram', description: 'Visual content with captions' },
  { id: 'facebook', name: 'Facebook', description: 'General social content' }
]

const templates = [
  { id: 'announcement', name: 'Announcement', description: 'Product launches, company news' },
  { id: 'educational', name: 'Educational', description: 'Tips, insights, how-tos' },
  { id: 'engagement', name: 'Engagement', description: 'Questions, polls, discussions' },
  { id: 'story', name: 'Story', description: 'Behind-the-scenes, personal stories' }
]

export default function PreviewWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>([])
  const [formData, setFormData] = useState({
    client_id: '',
    channel: '',
    template: '',
    draft_content: '',
    scheduled_at: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadClients()
    loadSelectedIdeas()
  }, [])

  const loadClients = async () => {
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Error loading clients:', error)
    }
  }

  const loadSelectedIdeas = () => {
    const stored = sessionStorage.getItem('selectedIdeas')
    if (stored) {
      setSelectedIdeas(JSON.parse(stored))
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.client_id || !formData.channel || !formData.template || !formData.draft_content) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Create preview for each selected idea
      for (const ideaId of selectedIdeas) {
        await createPreview({
          idea_id: ideaId,
          client_id: formData.client_id,
          channel: formData.channel,
          template: formData.template,
          draft_content: {
            content: formData.draft_content,
            template: formData.template,
            channel: formData.channel
          },
          scheduled_at: formData.scheduled_at || undefined
        })
      }

      // Clear session storage and redirect
      sessionStorage.removeItem('selectedIdeas')
      router.push('/admin/ideas?success=true')
    } catch (error) {
      console.error('Error creating preview:', error)
      alert('Failed to create preview')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Client
        return (
          <div className="space-y-4">
            <Label htmlFor="client">Select Client</Label>
            <Select value={formData.client_id} onValueChange={(value) => updateFormData('client_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-sm text-gray-500">{client.organizations.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 1: // Channel
        return (
          <div className="space-y-4">
            <Label htmlFor="channel">Select Channel</Label>
            <Select value={formData.channel} onValueChange={(value) => updateFormData('channel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{channel.name}</span>
                      <span className="text-sm text-gray-500">{channel.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 2: // Template
        return (
          <div className="space-y-4">
            <Label htmlFor="template">Select Template</Label>
            <Select value={formData.template} onValueChange={(value) => updateFormData('template', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-sm text-gray-500">{template.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 3: // Draft
        return (
          <div className="space-y-4">
            <Label htmlFor="draft">Content Draft</Label>
            <Textarea
              id="draft"
              placeholder="Write your content here..."
              value={formData.draft_content}
              onChange={(e) => updateFormData('draft_content', e.target.value)}
              rows={6}
            />
            <div className="text-sm text-gray-500">
              This content will be used for {selectedIdeas.length} idea{selectedIdeas.length !== 1 ? 's' : ''}
            </div>
          </div>
        )

      case 4: // Schedule
        return (
          <div className="space-y-4">
            <Label htmlFor="schedule">Schedule (Optional)</Label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => updateFormData('scheduled_at', e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              Leave empty to publish immediately when approved
            </div>
          </div>
        )

      case 5: // Save
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Preview Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Client:</strong> {clients.find(c => c.id === formData.client_id)?.name}</div>
                <div><strong>Channel:</strong> {channels.find(c => c.id === formData.channel)?.name}</div>
                <div><strong>Template:</strong> {templates.find(t => t.id === formData.template)?.name}</div>
                <div><strong>Ideas:</strong> {selectedIdeas.length} selected</div>
                {formData.scheduled_at && (
                  <div><strong>Scheduled:</strong> {new Date(formData.scheduled_at).toLocaleString()}</div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Click Save to create previews for all selected ideas. They will be sent to the client for approval.
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/admin/ideas')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ideas
        </Button>
        <h1 className="text-3xl font-bold">Preview Wizard</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2
                ${index <= currentStep 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-gray-100 border-gray-300 text-gray-500'
                }
              `}>
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs mt-2 text-center max-w-20">
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-16 h-1 mx-2
                ${index < currentStep ? 'bg-blue-500' : 'bg-gray-300'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Preview'}
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
