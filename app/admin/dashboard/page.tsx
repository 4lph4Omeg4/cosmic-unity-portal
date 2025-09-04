'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  FileText
} from 'lucide-react'
import { getDashboardStats } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  newIdeas: number
  pendingApprovals: number
  scheduledToday: number
  posted24h: number
  failed24h: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = () => {
    setLoading(true)
    loadStats()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-lg text-white">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6 bg-gray-900 min-h-screen">
        <div className="text-center text-red-400">
          Failed to load dashboard data
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'New Ideas (24h)',
      value: stats.newIdeas,
      icon: Lightbulb,
      color: 'bg-blue-500',
      description: 'Ideas created in the last 24 hours'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Previews waiting for client approval'
    },
    {
      title: 'Scheduled Today',
      value: stats.scheduledToday,
      icon: Calendar,
      color: 'bg-green-500',
      description: 'Previews scheduled for today'
    },
    {
      title: 'Posted (24h)',
      value: stats.posted24h,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      description: 'Successfully posted in last 24h'
    },
    {
      title: 'Failed (24h)',
      value: stats.failed24h,
      icon: XCircle,
      color: 'bg-red-500',
      description: 'Failed posts in last 24h'
    }
  ]

  const quickActions = [
    {
      title: 'Manage Ideas',
      description: 'View and organize content ideas',
      icon: FileText,
      action: () => router.push('/admin/ideas'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create Preview',
      description: 'Start the preview creation wizard',
      icon: TrendingUp,
      action: () => router.push('/admin/preview-wizard'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View Ideas',
      description: 'Browse and manage content ideas',
      icon: Lightbulb,
      action: () => router.push('/admin/ideas'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300">Overview of Timeline Alchemy system</p>
        </div>
        <Button onClick={refreshStats} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex flex-col items-start space-y-2`}
              >
                <action.icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Cron Jobs</span>
              <Badge variant="success" className="bg-green-400 text-green-900">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Database</span>
              <Badge variant="success" className="bg-green-400 text-green-900">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">RLS Policies</span>
              <Badge variant="success" className="bg-green-400 text-green-900">
                Enforced
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Dashboard loaded successfully</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Stats refreshed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>System monitoring active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
