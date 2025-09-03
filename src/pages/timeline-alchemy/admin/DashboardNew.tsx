import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, MessageSquare, Calendar, User, Loader2, Eye, Edit, Trash2, Sparkles, Play, Plus, Instagram, Youtube, Linkedin, X, Facebook, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

interface UserPreview {
  id: string
  user_id: string
  preview_data: any
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  client_feedback?: string
  created_at: string
  updated_at: string
  profiles?: {
    display_name: string
    role: string
  }
}

export default function DashboardNew() {
  const navigate = useNavigate()
  const [previews, setPreviews] = useState<UserPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    checkAdminStatus()
    loadData()
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'x':
      case 'twitter':
        return <X className="w-4 h-4" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      case 'tiktok':
        return <Video className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'text-blue-400'
      case 'instagram':
        return 'text-pink-400'
      case 'x':
      case 'twitter':
        return 'text-blue-300'
      case 'linkedin':
        return 'text-blue-500'
      case 'tiktok':
        return 'text-white'
      case 'youtube':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

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
        navigate('/timeline-alchemy/client/my-previews-new')
        return
      }

      setIsAdmin(true)
      console.log('User is admin, proceeding...')
    } catch (error) {
      console.error('Error in checkAdminStatus:', error)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load clients from profiles where role = 'client'
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .eq('role', 'client')
        .order('display_name')

      if (!clientsError && clientsData) {
        setClients(clientsData.map(c => ({ id: c.user_id, name: c.display_name })))
        console.log('Clients loaded:', clientsData)
      } else {
        console.error('Error loading clients:', clientsError)
      }

      // Load all previews from user_previews table
      console.log('Loading previews from user_previews table...')
      
      // First try without joins to see if basic data loads
      const { data: basicData, error: basicError } = await supabase
        .from('user_previews')
        .select('*')
        .order('created_at', { ascending: false })

      if (basicError) {
        console.error('Error loading basic previews:', basicError)
        setPreviews([])
        return
      }

      console.log('Basic previews loaded:', basicData)

      // Now try with joins
      const { data, error } = await supabase
        .from('user_previews')
        .select(`
          *,
          profiles(display_name, role)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading previews with joins:', error)
        // Fall back to basic data
        setPreviews(basicData || [])
        return
      }

      console.log('Previews with joins loaded:', data)
      setPreviews(data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadData()
  }

  const testDatabase = async () => {
    try {
      console.log('Testing database connection...')
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('user_previews')
        .select('*')
        .limit(5)

      if (testError) {
        console.error('Database test error:', testError)
        alert('Database test failed: ' + testError.message)
        return
      }

      console.log('Database test successful:', testData)
      alert(`Database test successful! Found ${testData?.length || 0} previews. Check console for details.`)
      
      // Reload data
      loadData()
    } catch (error) {
      console.error('Database test error:', error)
      alert('Database test failed: ' + error)
    }
  }

  const filteredPreviews = previews.filter(preview => {
    const matchesSearch = (preview.preview_data?.idea_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (preview.preview_data?.idea_content || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || preview.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleDeletePreview = async (previewId: string) => {
    if (!confirm('Are you sure you want to delete this preview? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('user_previews')
        .delete()
        .eq('id', previewId)

      if (error) {
        console.error('Error deleting preview:', error)
        alert('Failed to delete preview')
        return
      }

      // Update local state
      setPreviews(prev => prev.filter(p => p.id !== previewId))
      alert('Preview deleted successfully!')
    } catch (error) {
      console.error('Error deleting preview:', error)
      alert('Failed to delete preview')
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

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-white mb-2">
            {loading ? 'Loading dashboard...' : 'Checking admin access...'}
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

  const stats = {
    total: previews.length,
    pending: previews.filter(p => p.status === 'pending').length,
    approved: previews.filter(p => p.status === 'approved').length,
    rejected: previews.filter(p => p.status === 'rejected').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard (New)</h1>
          <p className="mt-2 text-gray-300">Beheer alle content previews en client goedkeuringen</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/timeline-alchemy/admin/preview-wizard-new')} className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Create Preview (New)
          </Button>
          <Button onClick={() => navigate('/timeline-alchemy/admin/create-test-preview')} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Test Preview
          </Button>
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={testDatabase} variant="outline" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-purple-600">
            <Search className="w-4 h-4" />
            Test DB
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
        <h4 className="text-lg font-medium text-green-300 mb-2">Admin Status</h4>
        <div className="text-sm text-green-200">
          <p>✅ Admin access confirmed</p>
          <p>📊 Previews loaded: {previews.length}</p>
          <p>👥 Clients loaded: {clients.length}</p>
          <p>🔄 Using new user_previews table</p>
          <p>🔍 Search term: "{searchTerm}"</p>
          <p>📋 Status filter: {selectedStatus}</p>
          <p>📝 Filtered previews: {filteredPreviews.length}</p>
        </div>
        {previews.length > 0 && (
          <div className="mt-3 text-xs text-green-300">
            <p>Preview IDs: {previews.map(p => p.id.slice(-8)).join(', ')}</p>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Previews</p>
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
                <p className="text-sm font-medium text-gray-400">Pending Review</p>
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
                <p className="text-sm font-medium text-gray-400">Approved</p>
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
                <p className="text-sm font-medium text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
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
              <option value="rejected" className="bg-gray-700 text-gray-200">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Previews List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Previews ({filteredPreviews.length})</CardTitle>
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
                        {preview.profiles?.display_name && (
                          <Badge variant="outline" className="text-gray-300 border-gray-400">
                            Client: {preview.profiles.display_name}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-lg text-white mb-2">
                        {preview.preview_data?.idea_title || 'Untitled Preview'}
                      </h3>
                      
                      {/* Main Content */}
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-300 mb-2">Idea Content:</h4>
                        <p className="text-gray-200 whitespace-pre-wrap">
                          {preview.preview_data?.idea_content || 'No content available'}
                        </p>
                      </div>
                      
                      {/* Social Content */}
                      {preview.preview_data?.social_content && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-300 mb-2">Social Media Content:</h4>
                          <div className="space-y-2">
                            {Object.entries(preview.preview_data.social_content).map(([platform, content]) => {
                              if (!content || content === 'null' || content === '') return null;
                              return (
                                <div key={platform} className="bg-gray-600 rounded border border-gray-500">
                                  <div className="flex items-center gap-2 p-2 border-b border-gray-500">
                                    <div className={`flex-shrink-0 ${getPlatformColor(platform)}`}>
                                      {getPlatformIcon(platform)}
                                    </div>
                                    <span className="font-medium text-gray-200 text-sm capitalize">
                                      {platform === 'x' ? 'X (Twitter)' : platform}
                                    </span>
                                  </div>
                                  <div className="p-2">
                                    <div className="bg-gray-700 rounded p-2 max-h-24 overflow-y-auto">
                                      <p className="text-xs text-gray-200 whitespace-pre-wrap">
                                        {content ? String(content).substring(0, 200) + (String(content).length > 200 ? '...' : '') : 'No content available'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Platform Debug Info */}
                      {preview.preview_data?.social_content && (
                        <div className="mt-3 p-2 bg-yellow-900/20 rounded border border-yellow-700">
                          <h6 className="text-xs font-medium text-yellow-300 mb-1">Platform Debug:</h6>
                          <div className="text-xs text-yellow-200">
                            {Object.keys(preview.preview_data.social_content).map(platform => (
                              <span key={platform} className="inline-block mr-2 px-1 bg-yellow-800/50 rounded">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created: {new Date(preview.created_at).toLocaleDateString()}
                        </div>
                        {preview.updated_at !== preview.created_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Updated: {new Date(preview.updated_at).toLocaleDateString()}
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
                        <span className="font-medium text-green-300">Client Feedback</span>
                      </div>
                      <p className="text-sm text-green-200">{preview.client_feedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/timeline-alchemy/admin/preview-wizard-new?id=${preview.id}`)}
                      className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeletePreview(preview.id)}
                      className="flex items-center gap-2 text-red-400 border-red-600 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPreviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No previews found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
