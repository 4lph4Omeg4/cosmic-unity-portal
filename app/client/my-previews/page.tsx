'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Calendar,
  User,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react'
import { getClientPreviews, updatePreviewStatus } from '@/app/actions/client'

interface Preview {
  id: string
  channel: string
  template: string
  scheduled_at: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  ideas: {
    title: string
    description: string | null
  }
  clients: {
    name: string
  }
  metadata?: {
    feedback?: string
    reviewed_at?: string
  }
}

export default function MyPreviews() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPreview, setSelectedPreview] = useState<Preview | null>(null)
  const [feedback, setFeedback] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [showFullContent, setShowFullContent] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadPreviews()
  }, [])

  const loadPreviews = async () => {
    try {
      // In a real app, get userId from auth context
      const userId = 'current-user-id'
      const data = await getClientPreviews(userId)
      setPreviews(data)
    } catch (error) {
      console.error('Error loading previews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (previewId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true)
    try {
      await updatePreviewStatus(previewId, status, feedback)
      setFeedback('')
      setSelectedPreview(null)
      await loadPreviews() // Refresh the list
    } catch (error) {
      console.error('Error updating preview status:', error)
      alert('Failed to update preview status')
    } finally {
      setActionLoading(false)
    }
  }

  const toggleFullContent = (previewId: string) => {
    setShowFullContent(prev => ({
      ...prev,
      [previewId]: !prev[previewId]
    }))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    } as const

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    } as const

    const Icon = icons[status as keyof typeof icons]

    return (
      <Badge className={`${variants[status as keyof typeof icons]} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
    return new Date(dateString).toLocaleDateString()
  }

  const getPreviewsByStatus = (status: string) => {
    if (status === 'all') return previews
    return previews.filter(preview => preview.status === status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your previews...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Previews</h1>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({previews.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({previews.filter(p => p.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({previews.filter(p => p.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({previews.filter(p => p.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {status === 'all' ? 'All Previews' : `${status} Previews`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPreviewsByStatus(status).map((preview) => (
                    <div
                      key={preview.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getChannelIcon(preview.channel)}</span>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {preview.ideas.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="capitalize">{preview.channel}</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{preview.template}</span>
                                <span className="mx-2">•</span>
                                <Calendar className="w-4 h-4" />
                                Created: {formatDate(preview.created_at)}
                              </div>
                            </div>
                          </div>

                          {preview.ideas.description && (
                            <div className="mb-3">
                              {showFullContent[preview.id] ? (
                                <p className="text-gray-600">{preview.ideas.description}</p>
                              ) : (
                                <p className="text-gray-600">
                                  {preview.ideas.description.length > 150 
                                    ? `${preview.ideas.description.substring(0, 150)}...` 
                                    : preview.ideas.description
                                  }
                                </p>
                              )}
                              
                              {preview.ideas.description.length > 150 && (
                                <button
                                  onClick={() => toggleFullContent(preview.id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                                >
                                  {showFullContent[preview.id] ? (
                                    <>
                                      <EyeOff className="w-4 h-4" />
                                      Verberg content
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4" />
                                      Toon volledige content
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}

                          {preview.scheduled_at && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                              <Calendar className="w-4 h-4" />
                              Scheduled for: {formatDate(preview.scheduled_at)}
                            </div>
                          )}

                          {/* Feedback if rejected */}
                          {preview.status === 'rejected' && preview.metadata?.feedback && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                              <div className="text-sm font-medium text-red-800 mb-1">Feedback:</div>
                              <div className="text-sm text-red-700">{preview.metadata.feedback}</div>
                            </div>
                          )}

                          {/* Action buttons for pending previews */}
                          {preview.status === 'pending' && (
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => setSelectedPreview(preview)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve Preview</DialogTitle>
                                    <p className="text-sm text-gray-600">
                                      Review the preview details and optionally add feedback before approving.
                                    </p>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Preview Details:</h4>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <div><strong>Title:</strong> {preview.ideas.title}</div>
                                        <div><strong>Channel:</strong> {preview.channel}</div>
                                        <div><strong>Template:</strong> {preview.template}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Optional Feedback:</label>
                                      <Textarea
                                        placeholder="Add any feedback or notes..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedPreview(null)
                                          setFeedback('')
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleAction(preview.id, 'approved')}
                                        disabled={actionLoading}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        {actionLoading ? 'Approving...' : 'Approve'}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setSelectedPreview(preview)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Request Changes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Request Changes</DialogTitle>
                                    <p className="text-sm text-gray-600">
                                      Provide feedback on what changes are needed for this preview.
                                    </p>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Preview Details:</h4>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <div><strong>Title:</strong> {preview.ideas.title}</div>
                                        <div><strong>Channel:</strong> {preview.channel}</div>
                                        <div><strong>Template:</strong> {preview.template}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Feedback Required:</label>
                                      <Textarea
                                        placeholder="Please explain what changes are needed..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={3}
                                        required
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedPreview(null)
                                          setFeedback('')
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleAction(preview.id, 'rejected')}
                                        disabled={actionLoading || !feedback.trim()}
                                        variant="destructive"
                                      >
                                        {actionLoading ? 'Sending...' : 'Send Feedback'}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          {getStatusBadge(preview.status)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {getPreviewsByStatus(status).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No {status} previews found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
