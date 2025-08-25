import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, MessageSquare, Calendar, User, Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface Preview {
  id: string
  idea_id: string
  client_id: string
  channel: string
  template: string
  draft_content: any
  scheduled_at: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  client_feedback?: string
  created_at: string
  ideas?: {
    title: string
    description: string
  }
  clients?: {
    name: string
  }
}

export default function TimelineAlchemyMyPreviews() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)

  useEffect(() => {
    loadPreviews()
  }, [])

  const loadPreviews = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('User not authenticated')
        return
      }

      // Get client IDs for this user
      const { data: clientIds, error: clientError } = await supabase
        .rpc('client_ids_for_user')

      if (clientError) {
        console.error('Error getting client IDs:', clientError)
        // Fallback to mock data for testing
        const mockData: Preview[] = [
          {
            id: '1',
            idea_id: '1',
            client_id: '1',
            channel: 'Instagram',
            template: 'Instagram',
            draft_content: { content: 'Discover how AI can transform your content creation workflow with intelligent scheduling and optimization.' },
            scheduled_at: '2025-01-20T09:00:00Z',
            status: 'pending',
            admin_notes: 'Content looks great! Ready for your review.',
            created_at: '2025-01-15T00:00:00Z',
            ideas: { title: 'AI-Powered Content Calendar', description: 'AI content creation workflow' },
            clients: { name: 'TechCorp' }
          },
          {
            id: '2',
            idea_id: '2',
            client_id: '2',
            channel: 'LinkedIn',
            template: 'LinkedIn',
            draft_content: { content: 'Mindfulness isn\'t just about meditation—it\'s about presence in everything you do.' },
            scheduled_at: '2025-01-22T14:00:00Z',
            status: 'approved',
            created_at: '2025-01-14T00:00:00Z',
            ideas: { title: 'Mindfulness Integration', description: 'Mindfulness in daily life' },
            clients: { name: 'Wellness Inc' }
          }
        ]
        setPreviews(mockData)
        return
      }

      if (!clientIds || clientIds.length === 0) {
        console.log('No client access found for user')
        setPreviews([])
        return
      }

      // Get previews for these clients
      const { data, error } = await supabase
        .from('previews')
        .select(`
          *,
          ideas(title, description),
          clients(name)
        `)
        .in('client_id', clientIds)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching previews:', error)
        return
      }

      console.log('Loaded previews:', data)
      setPreviews(data || [])
    } catch (error) {
      console.error('Error loading previews:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshPreviews = () => {
    setLoading(true)
    loadPreviews()
  }

  const filteredPreviews = previews.filter(preview => {
    const matchesSearch = (preview.ideas?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (preview.draft_content?.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || preview.status === selectedStatus
    const matchesChannel = selectedChannel === 'all' || preview.channel === selectedChannel
    const matchesTab = preview.status === activeTab
    
    return matchesSearch && matchesStatus && matchesChannel && matchesTab
  })

  const handleApprove = async (previewId: string) => {
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('previews')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', previewId)

      if (error) {
        console.error('Error approving preview:', error)
        alert('Failed to approve preview')
        return
      }

      // Update local state
      setPreviews(prev => prev.map(p => 
        p.id === previewId ? { ...p, status: 'approved' as const } : p
      ))
      
      alert('Preview approved successfully!')
    } catch (error) {
      console.error('Error approving preview:', error)
      alert('Failed to approve preview')
    } finally {
      setSaving(false)
    }
  }

  const handleRequestChanges = async (previewId: string) => {
    if (!feedbackText.trim()) return
    
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('previews')
        .update({
          status: 'rejected',
          client_feedback: feedbackText,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', previewId)

      if (error) {
        console.error('Error rejecting preview:', error)
        alert('Failed to reject preview')
        return
      }

      // Update local state
      setPreviews(prev => prev.map(p => 
        p.id === previewId ? { 
          ...p, 
          status: 'rejected' as const,
          client_feedback: feedbackText 
        } : p
      ))
      
      setFeedbackText('')
      setSelectedPreview(null)
      alert('Changes requested successfully!')
    } catch (error) {
      console.error('Error rejecting preview:', error)
      alert('Failed to request changes')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'Instagram': return 'bg-pink-100 text-pink-800'
      case 'LinkedIn': return 'bg-blue-100 text-blue-800'
      case 'X (Twitter)': return 'bg-sky-100 text-sky-800'
      case 'Facebook': return 'bg-indigo-100 text-indigo-800'
      case 'Blog Post': return 'bg-green-100 text-green-800'
      case 'Custom Post': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading previews...
        </div>
      </div>
    )
  }

  const stats = {
    total: previews.length,
    pending: previews.filter(p => p.status === 'pending').length,
    approved: previews.filter(p => p.status === 'approved').length,
    rejected: previews.filter(p => p.status === 'rejected').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mijn Previews</h1>
          <p className="mt-2 text-gray-300">Bekijk en beheer je content previews</p>
        </div>
        <Button onClick={refreshPreviews} variant="outline" className="flex items-center gap-2" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Previews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({previews.filter(p => p.status === tab).length})
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search previews by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-800 text-gray-200">All Statuses</option>
              <option value="pending" className="bg-gray-800 text-gray-200">Pending</option>
              <option value="approved" className="bg-gray-800 text-gray-200">Approved</option>
              <option value="rejected" className="bg-gray-800 text-gray-200">Rejected</option>
            </select>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-800 text-gray-200">All Channels</option>
              <option value="Instagram" className="bg-gray-800 text-gray-200">Instagram</option>
              <option value="LinkedIn" className="bg-gray-800 text-gray-200">LinkedIn</option>
              <option value="X (Twitter)" className="bg-gray-800 text-gray-200">X (Twitter)</option>
              <option value="Facebook" className="bg-gray-800 text-gray-200">Facebook</option>
              <option value="Blog Post" className="bg-gray-800 text-gray-200">Blog Post</option>
              <option value="Custom Post" className="bg-gray-800 text-gray-200">Custom Post</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Previews List */}
      <Card>
        <CardHeader>
          <CardTitle>Previews ({filteredPreviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPreviews.map((preview) => (
              <div key={preview.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(preview.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(preview.status)}
                            {preview.status}
                          </div>
                        </Badge>
                        <Badge className={getChannelColor(preview.channel)}>
                          {preview.channel}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {preview.ideas?.title || 'Untitled Preview'}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {preview.draft_content?.content || 'No content available'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {preview.scheduled_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Scheduled: {new Date(preview.scheduled_at).toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created: {new Date(preview.created_at).toLocaleDateString()}
                        </div>
                        {preview.clients?.name && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Client: {preview.clients.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {preview.admin_notes && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Admin Notes</span>
                      </div>
                      <p className="text-sm text-blue-700">{preview.admin_notes}</p>
                    </div>
                  )}

                  {/* Client Feedback */}
                  {preview.client_feedback && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Your Feedback</span>
                      </div>
                      <p className="text-sm text-green-700">{preview.client_feedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {preview.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(preview.id)}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPreview(preview.id)}
                        disabled={saving}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Request Changes
                      </Button>
                    </div>
                  )}

                  {/* Feedback Modal */}
                  {selectedPreview === preview.id && (
                    <div className="p-4 bg-gray-50 border rounded-lg">
                      <h4 className="font-medium mb-2">Request Changes</h4>
                      <Textarea
                        placeholder="Explain what changes you'd like..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="mb-3"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRequestChanges(preview.id)}
                          variant="outline"
                          disabled={saving}
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Request'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedPreview(null)
                            setFeedbackText('')
                          }}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredPreviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No previews found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
