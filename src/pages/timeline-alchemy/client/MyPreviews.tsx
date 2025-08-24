import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, MessageSquare, Calendar, User } from 'lucide-react'

interface Preview {
  id: string
  title: string
  content: string
  channel: string
  scheduledDate: string
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
  clientFeedback?: string
  createdAt: string
}

export default function TimelineAlchemyMyPreviews() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)

  useEffect(() => {
    loadPreviews()
  }, [])

  const loadPreviews = async () => {
    try {
      // TODO: Implement actual API call
      const mockData: Preview[] = [
        {
          id: '1',
          title: 'AI-Powered Content Calendar',
          content: 'Discover how AI can transform your content creation workflow with intelligent scheduling and optimization.',
          channel: 'Instagram',
          scheduledDate: '2025-01-20 09:00',
          status: 'pending',
          adminNotes: 'Content looks great! Ready for your review.',
          createdAt: '2025-01-15'
        },
        {
          id: '2',
          title: 'Mindfulness Integration',
          content: 'Mindfulness isn\'t just about meditation—it\'s about presence in everything you do.',
          channel: 'LinkedIn',
          scheduledDate: '2025-01-22 14:00',
          status: 'approved',
          createdAt: '2025-01-14'
        },
        {
          id: '3',
          title: 'Community Collaboration Hub',
          content: 'Building community starts with authentic connection and shared purpose.',
          channel: 'Twitter',
          scheduledDate: '2025-01-25 16:00',
          status: 'rejected',
          adminNotes: 'Content needs more specific examples and actionable insights.',
          clientFeedback: 'I\'ll revise with more concrete examples and practical tips.',
          createdAt: '2025-01-13'
        },
        {
          id: '4',
          title: 'Future of Content Creation',
          content: 'The future of content creation is collaborative, AI-enhanced, and deeply human.',
          channel: 'Facebook',
          scheduledDate: '2025-01-28 10:00',
          status: 'pending',
          adminNotes: 'Excellent concept! Ready for your approval.',
          createdAt: '2025-01-12'
        }
      ]
      setPreviews(mockData)
    } catch (error) {
      console.error('Error loading previews:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshPreviews = () => {
    setLoading(true)
    loadPreviews()
  }

  const filteredPreviews = previews.filter(preview => {
    const matchesSearch = preview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preview.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || preview.status === selectedStatus
    const matchesChannel = selectedChannel === 'all' || preview.channel === selectedChannel
    const matchesTab = preview.status === activeTab
    
    return matchesSearch && matchesStatus && matchesChannel && matchesTab
  })

  const handleApprove = (previewId: string) => {
    // TODO: Implement actual API call
    setPreviews(prev => prev.map(p => 
      p.id === previewId ? { ...p, status: 'approved' as const } : p
    ))
  }

  const handleRequestChanges = (previewId: string) => {
    if (!feedbackText.trim()) return
    
    // TODO: Implement actual API call
    setPreviews(prev => prev.map(p => 
      p.id === previewId ? { 
        ...p, 
        status: 'rejected' as const,
        clientFeedback: feedbackText 
      } : p
    ))
    
    setFeedbackText('')
    setSelectedPreview(null)
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
      case 'Twitter': return 'bg-sky-100 text-sky-800'
      case 'Facebook': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading previews...</div>
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Mijn Previews</h1>
          <p className="mt-2 text-gray-300">Bekijk en beheer je content previews</p>
        </div>
        <Button onClick={refreshPreviews} variant="outline" className="flex items-center gap-2">
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({previews.filter(p => p.status === tab).length})
          </button>
        ))}
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
              <option value="Twitter" className="bg-gray-800 text-gray-200">Twitter</option>
              <option value="Facebook" className="bg-gray-800 text-gray-200">Facebook</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Previews List */}
      <Card>
        <CardHeader>
          <CardTitle>Previews ({filteredPreviews.length})</CardTitle>
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
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {preview.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {preview.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {new Date(preview.scheduledDate).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created: {new Date(preview.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {preview.adminNotes && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Admin Notes</span>
                      </div>
                      <p className="text-sm text-blue-700">{preview.adminNotes}</p>
                    </div>
                  )}

                  {/* Client Feedback */}
                  {preview.clientFeedback && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Your Feedback</span>
                      </div>
                      <p className="text-sm text-green-700">{preview.clientFeedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {preview.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(preview.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPreview(preview.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Request Changes
                      </Button>
                    </div>
                  )}

                  {/* Feedback Modal */}
                  {selectedPreview === preview.id && (
                    <div className="p-4 bg-gray-50 border rounded-lg">
                      <h4 className="font-medium mb-2">Request Changes</h4>
                      <Textarea
                        placeholder="Explain what changes you'd like..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="mb-3"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRequestChanges(preview.id)}
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        >
                          Submit Request
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedPreview(null)
                            setFeedbackText('')
                          }}
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
