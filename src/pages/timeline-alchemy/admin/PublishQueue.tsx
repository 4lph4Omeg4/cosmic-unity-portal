import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Calendar,
  MessageSquare
} from 'lucide-react'

interface PublishResult {
  id: string
  previewId: string
  previewTitle: string
  clientName: string
  channel: string
  scheduledDate: string
  publishedDate: string
  status: 'success' | 'failed' | 'pending'
  externalUrl?: string
  errorMessage?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

export default function TimelineAlchemyPublishQueue() {
  const [publishResults, setPublishResults] = useState<PublishResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')

  useEffect(() => {
    loadPublishQueue()
  }, [])

  const loadPublishQueue = async () => {
    try {
      // TODO: Implement actual API call
      const mockData: PublishResult[] = [
        {
          id: '1',
          previewId: 'preview-1',
          previewTitle: 'AI-Powered Content Calendar',
          clientName: 'TechCorp',
          channel: 'Instagram',
          scheduledDate: '2025-01-20 09:00',
          publishedDate: '2025-01-20 09:02',
          status: 'success',
          externalUrl: 'https://instagram.com/p/ABC123',
          engagement: {
            likes: 45,
            comments: 12,
            shares: 8
          }
        },
        {
          id: '2',
          previewId: 'preview-2',
          previewTitle: 'Mindfulness Integration',
          clientName: 'Wellness Inc',
          channel: 'LinkedIn',
          scheduledDate: '2025-01-22 14:00',
          publishedDate: '2025-01-22 14:01',
          status: 'success',
          externalUrl: 'https://linkedin.com/posts/XYZ789',
          engagement: {
            likes: 23,
            comments: 5,
            shares: 3
          }
        },
        {
          id: '3',
          previewId: 'preview-3',
          previewTitle: 'Community Collaboration Hub',
          clientName: 'Community Builders',
          channel: 'Twitter',
          scheduledDate: '2025-01-25 16:00',
          publishedDate: '2025-01-25 16:00',
          status: 'failed',
          errorMessage: 'Rate limit exceeded. Please try again later.'
        }
      ]
      setPublishResults(mockData)
    } catch (error) {
      console.error('Error loading publish queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshPublishQueue = () => {
    setLoading(true)
    loadPublishQueue()
  }

  const filteredResults = publishResults.filter(result => {
    const matchesSearch = result.previewTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || result.status === selectedStatus
    const matchesChannel = selectedChannel === 'all' || result.channel === selectedChannel
    
    return matchesSearch && matchesStatus && matchesChannel
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'Instagram': return 'bg-pink-100 text-pink-800'
      case 'LinkedIn': return 'bg-blue-100 text-blue-800'
      case 'Twitter': return 'bg-sky-100 text-sky-800'
      case 'Facebook': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading publish queue...</div>
      </div>
    )
  }

  const stats = {
    total: publishResults.length,
    success: publishResults.filter(r => r.status === 'success').length,
    failed: publishResults.filter(r => r.status === 'failed').length,
    pending: publishResults.filter(r => r.status === 'pending').length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Publish Queue</h1>
          <p className="mt-2 text-gray-300">Monitor publishing status en resultaten</p>
        </div>
        <Button onClick={refreshPublishQueue} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Published</p>
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
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
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
                  placeholder="Search by title or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Publish Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Results ({filteredResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(result.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(result.status)}
                            {result.status}
                          </div>
                        </Badge>
                        <Badge className={getChannelColor(result.channel)}>
                          {result.channel}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Client: {result.clientName}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {result.previewTitle}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {new Date(result.scheduledDate).toLocaleString()}
                        </div>
                        {result.publishedDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Published: {new Date(result.publishedDate).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Success Details */}
                  {result.status === 'success' && result.externalUrl && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700">
                            <span className="font-medium">Successfully published!</span>
                          </p>
                          {result.engagement && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
                              <span>❤️ {result.engagement.likes}</span>
                              <span>💬 {result.engagement.comments}</span>
                              <span>🔄 {result.engagement.shares}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.externalUrl, '_blank')}
                          className="border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Post
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Error Details */}
                  {result.status === 'failed' && result.errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-900">Publishing Failed</span>
                      </div>
                      <p className="text-sm text-red-700">{result.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {filteredResults.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No publish results found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
