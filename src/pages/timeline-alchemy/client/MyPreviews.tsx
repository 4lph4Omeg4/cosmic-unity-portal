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
  blogPosts?: Array<{
    id: string
    title: string
    body: string
    facebook?: string
    instagram?: string
    x?: string
    linkedin?: string
  }>
}

export default function TimelineAlchemyMyPreviews() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'published' | 'rejected'>('all')
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

      // First, check if user has client role in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('user_id', user.id)
        .single()

      if (profileError || profileData?.role !== 'client') {
        console.log('User is not a client or profile not found')
        setPreviews([])
        return
      }

      // First, get the client_id for this user from client_users table
      const { data: clientUserData, error: clientUserError } = await supabase
        .from('client_users')
        .select('client_id')
        .eq('user_id', user.id)
        .single()

      if (clientUserError || !clientUserData?.client_id) {
        console.log('User not found in client_users table or no client_id')
        setPreviews([])
        return
      }

      console.log('Found client_id for user:', clientUserData.client_id)

      // Now load previews for this client_id
      const { data, error } = await supabase
        .from('previews')
        .select(`
          *,
          ideas(title, description)
        `)
        .eq('client_id', clientUserData.client_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching previews:', error)
        setPreviews([])
        return
      }

      console.log('Successfully loaded previews:', data?.length || 0)
      console.log('Preview statuses:', data?.map(p => ({ id: p.id, status: p.status, title: p.ideas?.title })))

      // Load blog posts for platform-specific content
      if (data && data.length > 0) {
        const postIds = data
          .map(preview => preview.draft_content?.selectedPosts)
          .flat()
          .filter(Boolean)
        
        if (postIds.length > 0) {
          const { data: blogPostsData, error: blogPostsError } = await supabase
            .from('blog_posts')
            .select('id, title, body, facebook, instagram, x, linkedin')
            .in('id', postIds)
          
          if (!blogPostsError && blogPostsData) {
            // Attach blog posts data to previews
            data.forEach(preview => {
              if (preview.draft_content?.selectedPosts) {
                preview.blogPosts = blogPostsData.filter(post => 
                  preview.draft_content.selectedPosts.includes(post.id)
                )
              }
            })
          }
        }
      }

      console.log('Final data being set:', data)
      setPreviews(data || [])
    } catch (error) {
      console.error('Error loading previews:', error)
      setPreviews([])
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
    
    // Only apply tab filtering if we're not on 'all' tab
    const matchesTab = activeTab === 'all' || preview.status === activeTab
    
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
    published: previews.filter(p => p.status === 'published').length,
    rejected: previews.filter(p => p.status === 'rejected').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mijn Previews</h1>
          <p className="mt-2 text-gray-300">Bekijk en beheer je content previews</p>
        </div>
        <Button onClick={refreshPreviews} variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Previews</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Published</p>
                <p className="text-2xl font-bold text-purple-400">{stats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg border border-gray-700">
        {(['all', 'pending', 'approved', 'published', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)} 
            {tab === 'all' ? ` (${previews.length})` : ` (${previews.filter(p => p.status === tab).length})`}
          </button>
        ))}
      </div>



      {/* Search and Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Search & Filters</CardTitle>
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
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-700 text-gray-200">All Statuses</option>
              <option value="pending" className="bg-gray-700 text-gray-200">Pending</option>
              <option value="approved" className="bg-gray-700 text-gray-200">Approved</option>
              <option value="published" className="bg-gray-700 text-gray-200">Published</option>
              <option value="rejected" className="bg-gray-700 text-gray-200">Rejected</option>
            </select>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-700 text-gray-200">All Channels</option>
              <option value="Instagram" className="bg-gray-700 text-gray-200">Instagram</option>
              <option value="LinkedIn" className="bg-gray-700 text-gray-200">LinkedIn</option>
              <option value="X (Twitter)" className="bg-gray-700 text-gray-200">X (Twitter)</option>
              <option value="Facebook" className="bg-gray-700 text-gray-200">Facebook</option>
              <option value="Blog Post" className="bg-gray-700 text-gray-200">Blog Post</option>
              <option value="Custom Post" className="bg-gray-700 text-gray-200">Custom Post</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Previews List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Previews ({filteredPreviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPreviews.map((preview) => (
              <div key={preview.id} className="border border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
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
                      
                      <h3 className="font-semibold text-lg text-white mb-2">
                        {preview.ideas?.title || 'Untitled Preview'}
                      </h3>
                      
                      {/* Content Preview */}
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-300 mb-2">Content Preview:</h4>
                        <div className="bg-gray-800 rounded p-3 border border-gray-600">
                          <p className="text-gray-200 whitespace-pre-wrap">
                            {preview.draft_content?.content || 'No content available'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Platform Information */}
                      {preview.draft_content?.template && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-300 mb-2">Platforms:</h4>
                          <div className="flex flex-wrap gap-2">
                            {preview.draft_content.template.split(', ').map((template, index) => (
                              <Badge key={index} className="bg-gray-700 text-gray-200 border-gray-600">
                                {template === 'Facebook' && '📘'}
                                {template === 'Instagram' && '📷'}
                                {template === 'X (Twitter)' && '🐦'}
                                {template === 'LinkedIn' && '💼'}
                                {template === 'Blog Post' && '📝'}
                                {template === 'Custom Post' && '✨'}
                                {' '}{template}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Platform-Specific Content */}
                      {preview.draft_content?.template && preview.blogPosts && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-300 mb-2">Platform Content:</h4>
                          <div className="space-y-2">
                            {preview.draft_content.template.split(', ').map((template, index) => {
                              const blogPost = preview.blogPosts?.[0]; // Get first blog post
                              if (!blogPost) return null;
                              
                              let content = '';
                              let contentType = '';
                              
                              switch (template) {
                                case 'Facebook':
                                  content = blogPost.facebook || blogPost.body;
                                  contentType = 'Facebook promotional content';
                                  break;
                                case 'Instagram':
                                  content = blogPost.instagram || blogPost.body;
                                  contentType = 'Instagram promotional content';
                                  break;
                                case 'X (Twitter)':
                                  content = blogPost.x || blogPost.body;
                                  contentType = 'X (Twitter) promotional content';
                                  break;
                                case 'LinkedIn':
                                  content = blogPost.linkedin || blogPost.body;
                                  contentType = 'LinkedIn promotional content';
                                  break;
                                case 'Blog Post':
                                  content = blogPost.body;
                                  contentType = 'Full blog post content';
                                  break;
                                case 'Custom Post':
                                  content = preview.draft_content?.content || blogPost.body;
                                  contentType = 'Custom content';
                                  break;
                                default:
                                  content = blogPost.body;
                                  contentType = 'Content';
                              }
                              
                              return (
                                <div key={index} className="bg-gray-700 rounded border border-gray-600">
                                  <div className="flex items-center gap-2 p-2 border-b border-gray-600">
                                    <div className="flex-shrink-0">
                                      {template === 'Facebook' && <span className="text-blue-400">📘</span>}
                                      {template === 'Instagram' && <span className="text-pink-400">📷</span>}
                                      {template === 'X (Twitter)' && <span className="text-blue-300">🐦</span>}
                                      {template === 'LinkedIn' && <span className="text-blue-500">💼</span>}
                                      {template === 'Blog Post' && <span className="text-green-400">📝</span>}
                                      {template === 'Custom Post' && <span className="text-purple-400">✨</span>}
                                    </div>
                                    <span className="font-medium text-gray-200 text-sm">{template}</span>
                                  </div>
                                  <div className="p-2">
                                    <p className="text-xs text-gray-400 mb-2">{contentType}</p>
                                    <div className="bg-gray-800 rounded p-2 max-h-24 overflow-y-auto">
                                      <p className="text-xs text-gray-200 whitespace-pre-wrap">
                                        {content ? content.substring(0, 200) + (content.length > 200 ? '...' : '') : 'No content available'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
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
                    <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-blue-300">Admin Notes</span>
                      </div>
                      <p className="text-sm text-blue-200">{preview.admin_notes}</p>
                    </div>
                  )}

                  {/* Client Feedback */}
                  {preview.client_feedback && (
                    <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-green-300">Your Feedback</span>
                      </div>
                      <p className="text-sm text-green-200">{preview.client_feedback}</p>
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

                  {/* Actions for Approved/Published Items */}
                  {(preview.status === 'approved' || preview.status === 'published') && (
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {preview.status === 'approved' ? 'Approved and ready for publishing' : 'Published'}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPreview(preview.id)}
                        disabled={saving}
                        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Request Changes
                      </Button>
                    </div>
                  )}

                  {/* Feedback Modal */}
                  {selectedPreview === preview.id && (
                    <div className="p-4 bg-gray-800 border border-gray-600 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Request Changes</h4>
                      <Textarea
                        placeholder="Explain what changes you'd like..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="mb-3 bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRequestChanges(preview.id)}
                          variant="outline"
                          disabled={saving}
                          className="bg-red-900/20 text-red-300 border-red-600 hover:bg-red-800/30"
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
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
