import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Instagram, X, Facebook, Linkedin, Youtube, Link, Plus, Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle, ExternalLink, Clock, Users } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface SocialConnection {
  id: string
  platform: string
  platform_username: string
  is_active: boolean
  connected_at: string
  last_used_at?: string
  token_expires_at?: string
  user_id: string
  user_email?: string
  user_organization?: string
}

export default function AdminSocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      setLoading(true)
      
      // Load all social connections from database with user info
      const { data, error } = await supabase
        .from('social_connections')
        .select(`
          id, 
          platform, 
          platform_username, 
          is_active, 
          connected_at, 
          last_used_at, 
          token_expires_at,
          user_id,
          profiles!inner(email, organization_name)
        `)
        .order('connected_at', { ascending: false })

      if (error) {
        console.error('Error loading connections:', error)
        toast({
          title: "Error",
          description: "Failed to load social media connections",
          variant: "destructive",
        })
        return
      }

      // Transform the data to include user info
      const transformedData = data?.map(conn => ({
        ...conn,
        user_email: conn.profiles?.email,
        user_organization: conn.profiles?.organization_name
      })) || []

      setConnections(transformedData)
    } catch (error) {
      console.error('Error loading social connections:', error)
      toast({
        title: "Error",
        description: "Failed to load social media connections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const connectPlatform = async (platform: string) => {
    try {
      setConnecting(platform)
      
      const { data, error } = await supabase.functions.invoke('social-oauth', {
        body: { platform }
      })

      if (error) throw error

      if (data?.authUrl) {
        // Open OAuth in popup window
        const popup = window.open(
          data.authUrl,
          `${platform}_oauth`,
          'width=600,height=700,scrollbars=yes,resizable=yes'
        )

        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            setConnecting(null)
            loadConnections() // Refresh connections
          }
        }, 1000)

      } else {
        throw new Error('No auth URL received')
      }
    } catch (error) {
      console.error('Error connecting platform:', error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${platform}. Please try again.`,
        variant: "destructive",
      })
      setConnecting(null)
    }
  }

  const disconnectPlatform = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('social_connections')
        .update({ is_active: false })
        .eq('id', connectionId)

      if (error) throw error

      toast({
        title: "Disconnected",
        description: "Social media account disconnected successfully",
      })

      loadConnections()
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (isActive: boolean, isExpired?: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-800'
    if (isExpired) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusIcon = (isActive: boolean, isExpired?: boolean) => {
    if (!isActive) return <XCircle className="w-4 h-4" />
    if (isExpired) return <Clock className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  const isTokenExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-5 h-5" />
      case 'twitter': return <X className="w-5 h-5" />
      case 'x': return <X className="w-5 h-5" />
      case 'facebook': return <Facebook className="w-5 h-5" />
      case 'linkedin': return <Linkedin className="w-5 h-5" />
      case 'youtube': return <Youtube className="w-5 h-5" />
      default: return <Link className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'facebook': return 'bg-blue-600'
      case 'twitter': return 'bg-black'
      case 'x': return 'bg-black'
      case 'linkedin': return 'bg-blue-700'
      case 'youtube': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  // Group connections by user
  const connectionsByUser = connections.reduce((acc, conn) => {
    const key = `${conn.user_email}-${conn.user_organization}`
    if (!acc[key]) {
      acc[key] = {
        user_email: conn.user_email,
        user_organization: conn.user_organization,
        connections: []
      }
    }
    acc[key].connections.push(conn)
    return acc
  }, {} as Record<string, { user_email?: string, user_organization?: string, connections: SocialConnection[] }>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-lg text-white">Loading social connections...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Social Connections</h1>
          <p className="mt-2 text-gray-300">Beheer alle sociale media verbindingen van clients</p>
        </div>
        <Button onClick={loadConnections} variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Connections</p>
                <p className="text-2xl font-bold text-white">{connections.length}</p>
              </div>
              <Link className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Connections</p>
                <p className="text-2xl font-bold text-green-400">
                  {connections.filter(c => c.is_active).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Connected Users</p>
                <p className="text-2xl font-bold text-purple-400">
                  {Object.keys(connectionsByUser).length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Expired Tokens</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {connections.filter(c => c.is_active && isTokenExpired(c.token_expires_at)).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connections by User */}
      <div className="space-y-6">
        {Object.entries(connectionsByUser).map(([key, userData]) => (
          <Card key={key} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                {userData.user_organization || 'Unknown Organization'} 
                <span className="text-sm font-normal text-gray-400">
                  ({userData.user_email})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.connections.map((connection) => {
                  const isExpired = isTokenExpired(connection.token_expires_at)
                  return (
                    <div key={connection.id} className="border border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getPlatformColor(connection.platform)}`}>
                            {getPlatformIcon(connection.platform)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-white capitalize">{connection.platform}</h3>
                            <p className="text-gray-300 text-sm mb-2">@{connection.platform_username}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getStatusColor(connection.is_active, isExpired)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(connection.is_active, isExpired)}
                                  {!connection.is_active ? 'Disconnected' : isExpired ? 'Token Expired' : 'Connected'}
                                </div>
                              </Badge>
                              <span className="text-sm text-gray-400">
                                Connected: {new Date(connection.connected_at).toLocaleDateString()}
                              </span>
                            </div>
                            {connection.last_used_at && (
                              <p className="text-sm text-gray-400">
                                Last used: {new Date(connection.last_used_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => disconnectPlatform(connection.id)}
                            className="flex items-center gap-1 text-red-400 border-red-600 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Platforms for Admin */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Connect New Admin Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'instagram', name: 'Instagram', description: 'Share visual content and stories' },
              { id: 'facebook', name: 'Facebook', description: 'Reach your audience with posts' },
              { id: 'twitter', name: 'X (Twitter)', description: 'Share quick updates and engage' },
              { id: 'linkedin', name: 'LinkedIn', description: 'Professional networking content' }
            ].map((platform) => {
              const isConnecting = connecting === platform.id
              
              return (
                <div
                  key={platform.id}
                  className="p-4 border border-gray-600 rounded-lg cursor-pointer transition-all bg-gray-700 hover:border-gray-500"
                  onClick={() => !isConnecting && connectPlatform(platform.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full text-white mb-3 ${getPlatformColor(platform.id)}`}>
                      {getPlatformIcon(platform.id)}
                    </div>
                    <h3 className="font-medium text-white mb-1">{platform.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{platform.description}</p>
                    
                    {isConnecting ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Connecting...
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          connectPlatform(platform.id)
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert className="bg-gray-800 border-gray-700">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-gray-300">
          <strong className="text-white">Admin Note:</strong> This page shows all social media connections from all clients. 
          You can manage these connections and also connect your own admin accounts for posting.
        </AlertDescription>
      </Alert>
    </div>
  )
}
