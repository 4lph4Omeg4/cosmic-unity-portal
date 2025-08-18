'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Link, 
  Unlink, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Facebook,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { 
  getClientSocialConnections, 
  connectSocialPlatform, 
  disconnectSocialPlatform 
} from '@/app/actions/client'

interface SocialConnection {
  id: string
  platform: string
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  created_at: string
}

const platforms = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-500',
    description: 'Connect your Twitter account to post content automatically'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    description: 'Connect your LinkedIn account for professional content'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-pink-500',
    description: 'Connect your Instagram account for visual content'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    description: 'Connect your Facebook account for social content'
  }
]

export default function SocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [formData, setFormData] = useState({
    accessToken: '',
    refreshToken: '',
    expiresAt: ''
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      // In a real app, get userId from auth context
      const userId = 'current-user-id'
      const data = await getClientSocialConnections(userId)
      setConnections(data)
    } catch (error) {
      console.error('Error loading social connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!selectedPlatform || !formData.accessToken) {
      alert('Please fill in all required fields')
      return
    }

    setActionLoading(true)
    try {
      await connectSocialPlatform(
        'current-user-id', // In real app, get from auth context
        selectedPlatform,
        formData.accessToken,
        formData.refreshToken || undefined,
        formData.expiresAt || undefined
      )
      
      setShowConnectDialog(false)
      setFormData({ accessToken: '', refreshToken: '', expiresAt: '' })
      setSelectedPlatform('')
      await loadConnections()
    } catch (error) {
      console.error('Error connecting platform:', error)
      alert('Failed to connect platform')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return

    setActionLoading(true)
    try {
      await disconnectSocialPlatform('current-user-id', platform)
      await loadConnections()
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      alert('Failed to disconnect platform')
    } finally {
      setActionLoading(false)
    }
  }

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform)
  }

  const getConnection = (platform: string) => {
    return connections.find(conn => conn.platform === platform)
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Media Connections</h1>
        <Button onClick={loadConnections} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => {
          const connected = isConnected(platform.id)
          const connection = getConnection(platform.id)
          const expired = connection && isExpired(connection.expires_at)

          return (
            <Card key={platform.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${platform.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <platform.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <p className="text-sm text-gray-600">{platform.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                {connected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Connected</span>
                    </div>
                    
                    {expired && (
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-600">Token Expired</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Connected: {formatDate(connection!.created_at)}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      <Unlink className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Not Connected</span>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full"
                          onClick={() => setSelectedPlatform(platform.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect {platform.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="accessToken">Access Token *</Label>
                            <Input
                              id="accessToken"
                              placeholder="Enter your access token"
                              value={formData.accessToken}
                              onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="refreshToken">Refresh Token (Optional)</Label>
                            <Input
                              id="refreshToken"
                              placeholder="Enter your refresh token"
                              value={formData.refreshToken}
                              onChange={(e) => setFormData(prev => ({ ...prev, refreshToken: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                            <Input
                              id="expiresAt"
                              type="datetime-local"
                              value={formData.expiresAt}
                              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowConnectDialog(false)
                                setFormData({ accessToken: '', refreshToken: '', expiresAt: '' })
                                setSelectedPlatform('')
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleConnect}
                              disabled={actionLoading || !formData.accessToken}
                            >
                              {actionLoading ? 'Connecting...' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {connections.length}
              </div>
              <div className="text-sm text-gray-600">Connected Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {platforms.length - connections.length}
              </div>
              <div className="text-sm text-gray-600">Available Platforms</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Connect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Access Token:</strong> This is required to post content to your social media accounts. 
                You can get this from your platform's developer settings.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Refresh Token:</strong> Optional but recommended. This allows us to automatically 
                refresh your access token when it expires.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Expires At:</strong> Optional. Set this if you know when your access token expires. 
                We'll notify you before expiration.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
