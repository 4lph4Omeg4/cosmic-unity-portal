import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, MessageSquare, Calendar, User, Loader2, Eye, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  created_by: string
  ideas?: {
    title: string
    description: string
  }
  profiles?: {
    display_name: string
    role: string
  }
}

export default function TimelineAlchemyAdminDashboard() {
  const navigate = useNavigate()
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    loadData()
  }, [])

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

      // Load all previews with proper joins
      console.log('Loading previews from database...')
      
      // First, try to load previews without joins to see if basic data loads
      const { data: basicData, error: basicError } = await supabase
        .from('previews')
        .select('*')
        .order('created_at', { ascending: false })

      if (basicError) {
        console.error('Error loading basic previews:', basicError)
        return
      }

      console.log('Basic previews loaded:', basicData)

      // Now try with joins
      const { data, error } = await supabase
        .from('previews')
        .select(`
          *,
          ideas(title, description)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading previews with joins:', error)
        // Fall back to basic data
        setPreviews(basicData || [])
        return
      }

      console.log('Previews with joins loaded:', data)

      if (error) {
        console.error('Error fetching previews:', error)
        return
      }

      console.log('Loaded previews:', data)
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

  const filteredPreviews = previews.filter(preview => {
    const matchesSearch = (preview.ideas?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (preview.draft_content?.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || preview.status === selectedStatus
    const matchesChannel = selectedChannel === 'all' || preview.channel === selectedChannel
    const matchesClient = selectedClient === 'all' || preview.client_id === selectedClient
    
    return matchesSearch && matchesStatus && matchesChannel && matchesClient
  })

  const handleDeletePreview = async (previewId: string) => {
    if (!confirm('Are you sure you want to delete this preview? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('previews')
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
          Loading dashboard...
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-gray-300">Beheer alle content previews en client goedkeuringen</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/timeline-alchemy/admin/preview-wizard')} className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Create Preview
          </Button>
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-800 text-gray-200">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id} className="bg-gray-800 text-gray-200">
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Previews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Previews ({filteredPreviews.length})</CardTitle>
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
                        {preview.client_id && (
                          <Badge variant="outline" className="text-gray-600 border-gray-400">
                            Client ID: {preview.client_id.substring(0, 8)}...
                          </Badge>
                        )}
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
                        {preview.client_id && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Client: {preview.client_id.substring(0, 8)}...
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
                        <span className="font-medium text-green-900">Client Feedback</span>
                      </div>
                      <p className="text-sm text-green-700">{preview.client_feedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/timeline-alchemy/admin/preview-wizard?id=${preview.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/timeline-alchemy/admin/preview-wizard?id=${preview.id}&edit=true`)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeletePreview(preview.id)}
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
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
              <p className="text-gray-500">No previews found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
