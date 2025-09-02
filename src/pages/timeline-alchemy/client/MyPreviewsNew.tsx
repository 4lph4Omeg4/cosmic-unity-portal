import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  Calendar,
  User,
  FileText,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface UserPreview {
  id: string
  user_id: string
  preview_data: any
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  client_feedback?: string
  created_at: string
  updated_at: string
}

export default function MyPreviewsNew() {
  const [previews, setPreviews] = useState<UserPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)

  useEffect(() => {
    loadPreviews()
  }, [])

  const loadPreviews = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('User not authenticated')
        return
      }

      console.log('Loading previews for user:', user.id)

      // Load previews directly by user_id - much simpler!
      const { data, error } = await supabase
        .from('user_previews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching previews:', error)
        setPreviews([])
        return
      }

      console.log('Successfully loaded previews:', data?.length || 0)
      setPreviews(data || [])
    } catch (error) {
      console.error('Error loading previews:', error)
      setPreviews([])
    } finally {
      setLoading(false)
    }
  }

  const updatePreviewStatus = async (previewId: string, status: 'approved' | 'rejected', feedback?: string) => {
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('user_previews')
        .update({ 
          status,
          client_feedback: feedback || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', previewId)

      if (error) {
        console.error('Error updating preview:', error)
        alert('Failed to update preview')
        return
      }

      // Reload previews
      await loadPreviews()
      setSelectedPreview(null)
      setFeedbackText('')
    } catch (error) {
      console.error('Error updating preview:', error)
      alert('Failed to update preview')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="text-green-400 border-green-400"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-red-400 border-red-400"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <div className="text-lg text-white">Loading previews...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Previews</h1>
        <p className="mt-2 text-gray-300">Review and approve your content previews</p>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
        <h4 className="text-lg font-medium text-blue-300 mb-2">Debug Info</h4>
        <div className="text-sm text-blue-200">
          <p>Total previews: {previews.length}</p>
          <p>Pending: {previews.filter(p => p.status === 'pending').length}</p>
          <p>Approved: {previews.filter(p => p.status === 'approved').length}</p>
          <p>Rejected: {previews.filter(p => p.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Previews List */}
      {previews.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No previews yet</h3>
            <p className="text-gray-400">Your admin hasn't created any previews for you yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {previews.map((preview) => (
            <Card key={preview.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    Preview #{preview.id.slice(-8)}
                  </CardTitle>
                  {getStatusBadge(preview.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(preview.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Admin
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview Data */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Preview Content</h4>
                  <div className="text-sm text-gray-300">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(preview.preview_data, null, 2)}</pre>
                  </div>
                </div>

                {/* Admin Notes */}
                {preview.admin_notes && (
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
                    <h4 className="font-medium text-blue-300 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Admin Notes
                    </h4>
                    <p className="text-blue-200 text-sm">{preview.admin_notes}</p>
                  </div>
                )}

                {/* Client Feedback */}
                {preview.client_feedback && (
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
                    <h4 className="font-medium text-green-300 mb-2">Your Feedback</h4>
                    <p className="text-green-200 text-sm">{preview.client_feedback}</p>
                  </div>
                )}

                {/* Actions */}
                {preview.status === 'pending' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Add feedback (optional)
                      </label>
                      <Textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Add your feedback or comments..."
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updatePreviewStatus(preview.id, 'approved', feedbackText)}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => updatePreviewStatus(preview.id, 'rejected', feedbackText)}
                        disabled={saving}
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-900/20"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
