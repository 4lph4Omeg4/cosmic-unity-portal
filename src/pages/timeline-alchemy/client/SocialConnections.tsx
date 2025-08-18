import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Instagram, Twitter, Facebook, Linkedin, Youtube, Link, Plus, Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface SocialConnection {
  id: string
  platform: string
  username: string
  displayName: string
  profileUrl: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  followers?: number
  posts?: number
}

export default function TimelineAlchemySocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      // TODO: Implement actual API call
      const mockData: SocialConnection[] = [
        {
          id: '1',
          platform: 'Instagram',
          username: '@cosmic_creator',
          displayName: 'Cosmic Creator',
          profileUrl: 'https://instagram.com/cosmic_creator',
          status: 'connected',
          lastSync: '2025-01-15 10:30',
          followers: 12500,
          posts: 345
        },
        {
          id: '2',
          platform: 'LinkedIn',
          username: 'cosmic-creator-official',
          displayName: 'Cosmic Creator Official',
          profileUrl: 'https://linkedin.com/in/cosmic-creator-official',
          status: 'connected',
          lastSync: '2025-01-15 09:00',
          followers: 8700,
          posts: 120
        },
        {
          id: '3',
          platform: 'Twitter',
          username: '@cosmic_creator',
          displayName: 'Cosmic Creator',
          profileUrl: 'https://twitter.com/cosmic_creator',
          status: 'error',
          lastSync: '2025-01-13 16:45'
        }
      ]
      setConnections(mockData)
    } catch (error) {
      console.error('Error loading social connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <XCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'Instagram': return <Instagram className="w-5 h-5" />
      case 'Twitter': return <Twitter className="w-5 h-5" />
      case 'LinkedIn': return <Linkedin className="w-5 h-5" />
      case 'Facebook': return <Facebook className="w-5 h-5" />
      case 'YouTube': return <Youtube className="w-5 h-5" />
      default: return <Link className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading social connections...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Connections</h1>
          <p className="text-gray-600 mt-2">Manage your social media platform connections</p>
        </div>
        <Button onClick={loadConnections} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Platforms</p>
                <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
              </div>
              <Link className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {connections.filter(c => c.status === 'connected').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {connections
                    .filter(c => c.status === 'connected' && c.followers)
                    .reduce((sum, c) => sum + (c.followers || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.38 4.38 0 0 0-4.121-4.112h-.875c-.371 0-.725.119-1.024.334M15 19.128a9.368 9.368 0 0 1-3.027.867 9.368 9.368 0 0 1-3.027-.867M15 19.128v2.25c0 .29-.115.56-.319.754A12.152 12.152 0 0 1 12 21.75c-2.354 0-4.6-.74-6.468-2.043a1.157 1.157 0 0 1-.319-.754v-2.25m7.5-10.872a9.364 9.364 0 0 0-3.027-.867 9.364 9.364 0 0 0-3.027.867m7.5-10.872c1.251.243 2.413.713 3.463 1.394M12 4.5c1.497 0 2.906.426 4.121 1.152M12 4.5v2.25m-4.121 1.152a9.364 9.364 0 0 0-3.027.867M12 4.5c-1.497 0-2.906.426-4.121 1.152m0 0a9.364 9.364 0 0 0-3.027-.867m7.5 3.372h-.875c-.371 0-.725.119-1.024.334M14.25 12h-.004M12 7.5h.004M10.5 12h-.004M12 10.5h-.004m-7.5 3.372c1.251-.243 2.413-.713 3.463-1.394m0 0A9.364 9.364 0 0 1 12 10.5c1.497 0 2.906.426 4.121 1.152m0 0c1.05.681 2.212 1.151 3.463 1.394M17.25 12h-.004M12 14.25h.004M4.5 15.75h-.004M12 18.75h.004M19.5 15.75h-.004" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Current Connections ({connections.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      {getPlatformIcon(connection.platform)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{connection.displayName}</h3>
                      <p className="text-gray-600 text-sm mb-2">@{connection.username} ({connection.platform})</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(connection.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(connection.status)}
                            {connection.status}
                          </div>
                        </Badge>
                        <span className="text-sm text-gray-500">Last Sync: {new Date(connection.lastSync).toLocaleString()}</span>
                      </div>
                      {connection.followers && (
                        <p><span className="font-medium">Followers:</span> {connection.followers.toLocaleString()}</p>
                      )}
                      {connection.posts && (
                        <p><span className="font-medium">Posts:</span> {connection.posts}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(connection.profileUrl, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {connections.length === 0 && (
            <div className="text-center py-8">
              <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No social connections found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
