'use client'

import { useState, useEffect } from 'react'
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
  User
} from 'lucide-react'
import { getPublishQueue } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface Publish {
  id: string
  published_at: string
  status: 'posted' | 'failed'
  result: any
  created_at: string
  previews: {
    id: string
    channel: string
    template: string
    scheduled_at: string | null
    ideas: {
      title: string
    }
    clients: {
      name: string
    }
  }
}

export default function PublishQueue() {
  const [publishes, setPublishes] = useState<Publish[]>([])
  const [filteredPublishes, setFilteredPublishes] = useState<Publish[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadPublishes()
  }, [])

  useEffect(() => {
    filterPublishes()
  }, [publishes, searchTerm, statusFilter])

  const loadPublishes = async () => {
    try {
      const data = await getPublishQueue()
      setPublishes(data)
    } catch (error) {
      console.error('Error loading publishes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPublishes = () => {
    let filtered = publishes

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(publish =>
        publish.previews.ideas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publish.previews.clients.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publish.previews.channel.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(publish => publish.status === statusFilter)
    }

    setFilteredPublishes(filtered)
  }

  const refreshData = () => {
    setLoading(true)
    loadPublishes()
  }

  const getStatusBadge = (status: string) => {
    if (status === 'posted') {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Posted
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Failed
        </Badge>
      )
    }
  }

  const getChannelIcon = (channel: string) => {
    const icons: { [key: string]: string } = {
      twitter: '🐦',
      linkedin: '💼',
      instagram: '📸',
      facebook: '📘'
    }
    return icons[channel] || '📱'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading publish queue...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Publish Queue</h1>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, client, or channel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="posted">Posted</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Publish Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Results ({filteredPublishes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPublishes.map((publish) => (
              <div
                key={publish.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getChannelIcon(publish.previews.channel)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {publish.previews.ideas.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          {publish.previews.clients.name}
                          <span className="mx-2">•</span>
                          <span className="capitalize">{publish.previews.channel}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{publish.previews.template}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Published: {formatDate(publish.published_at)}
                      </div>
                      {publish.previews.scheduled_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Scheduled: {formatDate(publish.previews.scheduled_at)}
                        </div>
                      )}
                    </div>

                    {/* Result Details */}
                    {publish.result && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium mb-2">Publish Result:</div>
                        {publish.status === 'posted' ? (
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Successfully posted to {publish.previews.channel}</span>
                            </div>
                            {publish.result.postId && (
                              <div className="flex items-center gap-2">
                                <span>Post ID: {publish.result.postId}</span>
                                {publish.result.url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(publish.result.url, '_blank')}
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                )}
                              </div>
                            )}
                            <div className="text-gray-500">
                              Posted at: {formatDate(publish.result.timestamp)}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Failed to post to {publish.previews.channel}</span>
                            </div>
                            {publish.result.error && (
                              <div className="text-red-600">
                                Error: {publish.result.error}
                              </div>
                            )}
                            <div className="text-gray-500">
                              Failed at: {formatDate(publish.result.timestamp)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {getStatusBadge(publish.status)}
                  </div>
                </div>
              </div>
            ))}

            {filteredPublishes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No publish results found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {publishes.filter(p => p.status === 'posted').length}
              </div>
              <div className="text-sm text-gray-600">Successfully Posted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {publishes.filter(p => p.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {publishes.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
