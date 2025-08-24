import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Plus,
  Star,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DashboardStats {
  totalClients: number
  totalIdeas: number
  pendingPreviews: number
  publishedContent: number
  recentActivity: Array<{
    id: string
    type: 'preview_created' | 'content_published' | 'client_joined'
    message: string
    timestamp: string
  }>
}

export default function TimelineAlchemyDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalIdeas: 0,
    pendingPreviews: 0,
    publishedContent: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // TODO: Implement actual API call
      const mockStats: DashboardStats = {
        totalClients: 12,
        totalIdeas: 45,
        pendingPreviews: 8,
        publishedContent: 156,
        recentActivity: [
          {
            id: '1',
            type: 'preview_created',
            message: 'New preview created for TechCorp',
            timestamp: '2025-01-18 14:30'
          },
          {
            id: '2',
            type: 'content_published',
            message: 'AI-Powered Content Calendar published to Instagram',
            timestamp: '2025-01-18 12:15'
          },
          {
            id: '3',
            type: 'client_joined',
            message: 'Wellness Inc joined the platform',
            timestamp: '2025-01-18 10:00'
          }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'preview_created': return <MessageSquare className="w-4 h-4" />
      case 'content_published': return <Star className="w-4 h-4" />
      case 'client_joined': return <Users className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'preview_created': return 'text-blue-600'
      case 'content_published': return 'text-green-600'
      case 'client_joined': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Timeline Alchemy Dashboard</h1>
          <p className="mt-2 text-gray-300">Beheer je content en monitor prestaties</p>
        </div>
        <Button onClick={loadDashboardStats} variant="outline" className="flex items-center gap-2">
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
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Previews</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPreviews}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published Content</p>
                <p className="text-2xl font-bold text-green-600">{stats.publishedContent}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/timeline-alchemy/admin/ideas')}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-6 h-6" />
              <span>Create New Idea</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/timeline-alchemy/admin/preview-wizard')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-gray-500"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Start Preview Wizard</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/timeline-alchemy/admin/publish-queue')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Calendar className="w-6 h-6" />
              <span>View Publish Queue</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
          
          {stats.recentActivity.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity to show.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
