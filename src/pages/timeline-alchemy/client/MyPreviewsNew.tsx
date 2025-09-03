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
  Loader2,
  Search,
  Instagram,
  Youtube,
  Linkedin,
  X,
  Facebook,
  Video
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
  const [feedbackTexts, setFeedbackTexts] = useState<{[key: string]: string}>({})
  const [expandedPreviews, setExpandedPreviews] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    loadPreviews()
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'x':
      case 'twitter':
        return <X className="w-4 h-4" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      case 'tiktok':
        return <Video className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'text-blue-400'
      case 'instagram':
        return 'text-pink-400'
      case 'x':
      case 'twitter':
        return 'text-blue-300'
      case 'linkedin':
        return 'text-blue-500'
      case 'tiktok':
        return 'text-white'
      case 'youtube':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const toggleExpanded = (previewId: string) => {
    setExpandedPreviews(prev => ({
      ...prev,
      [previewId]: !prev[previewId]
    }))
  }

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

      // First test basic connection
      const { data: testData, error: testError } = await supabase
        .from('user_previews')
        .select('*')
        .limit(5)

      if (testError) {
        console.error('Database test error:', testError)
        setPreviews([])
        return
      }

      console.log('Database test successful, found previews:', testData?.length || 0)

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

      console.log('Successfully loaded previews for user:', data?.length || 0)
      console.log('Preview data:', data)
      setPreviews(data || [])
    } catch (error) {
      console.error('Error loading previews:', error)
      setPreviews([])
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    try {
      console.log('Testing database connection...')
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('User not authenticated')
        return
      }

      console.log('Current user ID:', user.id)

      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('user_previews')
        .select('*')
        .limit(5)

      if (testError) {
        console.error('Database test error:', testError)
        alert('Database test failed: ' + testError.message)
        return
      }

      console.log('Database test successful:', testData)
      
      // Debug social content specifically
      if (testData && testData.length > 0) {
        testData.forEach((preview, index) => {
          console.log(`Preview ${index + 1} social_content:`, preview.preview_data?.social_content)
          if (preview.preview_data?.social_content) {
            Object.entries(preview.preview_data.social_content).forEach(([platform, content]) => {
              console.log(`  ${platform}:`, content)
            })
          }
        })
      }
      
      alert(`Database test successful! Found ${testData?.length || 0} total previews. Check console for social content details.`)
      
      // Reload data
      loadPreviews()
    } catch (error) {
      console.error('Database test error:', error)
      alert('Database test failed: ' + error)
    }
  }

  const updatePreviewStatus = async (previewId: string, status: 'approved' | 'rejected') => {
    try {
      setSaving(true)
      
      const feedback = feedbackTexts[previewId] || ''
      
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
      
      // Clear feedback for this preview
      setFeedbackTexts(prev => {
        const newTexts = { ...prev }
        delete newTexts[previewId]
        return newTexts
      })
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
        <div className="mt-4">
          <Button onClick={testDatabase} variant="outline" className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600">
            <Search className="w-4 h-4 mr-2" />
            Test Database
          </Button>
          <Button onClick={() => {
            console.log('=== PREVIEW DATA DEBUG ===')
            previews.forEach((preview, index) => {
              console.log(`Preview ${index + 1}:`, {
                id: preview.id,
                images: preview.preview_data?.images,
                imageKeys: preview.preview_data?.images ? Object.keys(preview.preview_data.images) : 'No images'
              })
            })
            console.log('========================')
          }} variant="outline" className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600">
            <Search className="w-4 h-4 mr-2" />
            Debug Images
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
        <h4 className="text-lg font-medium text-blue-300 mb-2">Debug Info</h4>
        <div className="text-sm text-blue-200">
          <p>Total previews: {previews.length}</p>
          <p>Pending: {previews.filter(p => p.status === 'pending').length}</p>
          <p>Approved: {previews.filter(p => p.status === 'approved').length}</p>
          <p>Rejected: {previews.filter(p => p.status === 'rejected').length}</p>
          <p>🔄 Using new user_previews table</p>
        </div>
        {previews.length > 0 && (
          <div className="mt-3 text-xs text-blue-300">
            <p>Preview IDs: {previews.map(p => p.id.slice(-8)).join(', ')}</p>
          </div>
        )}
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
                {/* Images - Always visible at top */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-3">Preview Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Utopia Theme */}
                    <div className="bg-gray-600 rounded border border-gray-500 p-2">
                      <h6 className="text-xs font-medium text-gray-300 mb-1">Utopia Theme</h6>
                      <img 
                        src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-utopia.png" 
                        alt="Utopia Theme"
                        className="w-full h-24 object-cover rounded border border-gray-500"
                      />
                    </div>
                    
                    {/* Featured Image */}
                    <div className="bg-gray-600 rounded border border-gray-500 p-2">
                      <h6 className="text-xs font-medium text-gray-300 mb-1">Featured Image</h6>
                      <img 
                        src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-featured.png" 
                        alt="Featured preview"
                        className="w-full h-24 object-cover rounded border border-gray-500"
                      />
                    </div>
                    
                    {/* Cosmic Theme */}
                    <div className="bg-gray-600 rounded border border-gray-500 p-2">
                      <h6 className="text-xs font-medium text-gray-300 mb-1">Cosmic Theme</h6>
                      <img 
                        src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cosmic.png" 
                        alt="Cosmic preview"
                        className="w-full h-24 object-cover rounded border border-gray-500"
                      />
                    </div>
                    
                    {/* Cyberpunk Theme */}
                    <div className="bg-gray-600 rounded border border-gray-500 p-2">
                      <h6 className="text-xs font-medium text-gray-300 mb-1">Cyberpunk Theme</h6>
                      <img 
                        src="https://wdclgadjetxhcududipz.supabase.co/storage/v1/object/public/blog-images/0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cyberpunk.png" 
                        alt="Cyberpunk preview"
                        className="w-full h-24 object-cover rounded border border-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Data */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Preview Content</h4>
                    <Button
                      onClick={() => toggleExpanded(preview.id)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {expandedPreviews[preview.id] ? 'Verberg volledige content' : 'Toon volledige content'}
                    </Button>
                  </div>
                  
                  {/* Idea Title */}
                  {preview.preview_data?.idea_title && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-300 mb-1">Idea Title:</h5>
                      <p className="text-white">{preview.preview_data.idea_title}</p>
                    </div>
                  )}
                  
                  {/* Idea Content - Always show first part */}
                  {preview.preview_data?.idea_content && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-300 mb-1">Idea Content:</h5>
                      <p className="text-gray-200 whitespace-pre-wrap">
                        {expandedPreviews[preview.id] 
                          ? preview.preview_data.idea_content
                          : preview.preview_data.idea_content.substring(0, 200) + (preview.preview_data.idea_content.length > 200 ? '...' : '')
                        }
                      </p>
                    </div>
                  )}
                  


                  {/* Social Content */}
                  {preview.preview_data?.social_content && expandedPreviews[preview.id] && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-300 mb-2">Social Media Content:</h5>
                      <div className="space-y-2">
                        {Object.entries(preview.preview_data.social_content).map(([platform, content]) => {
                          console.log(`Rendering platform: ${platform}, content:`, content)
                          if (!content || content === 'null' || content === '') return null;
                          return (
                            <div key={platform} className="bg-gray-600 rounded border border-gray-500">
                              <div className="flex items-center gap-2 p-2 border-b border-gray-500">
                                <div className={`flex-shrink-0 ${getPlatformColor(platform)}`}>
                                  {getPlatformIcon(platform)}
                                </div>
                                <span className="font-medium text-gray-200 text-sm capitalize">
                                  {platform === 'x' ? 'X (Twitter)' : platform}
                                </span>
                              </div>
                              <div className="p-2">
                                <div className="bg-gray-700 rounded p-2">
                                  <p className="text-xs text-gray-200 whitespace-pre-wrap">
                                    {String(content)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Platform Debug Info */}
                  {preview.preview_data?.social_content && (
                    <div className="mt-3 p-2 bg-yellow-900/20 rounded border border-yellow-700">
                      <h6 className="text-xs font-medium text-yellow-300 mb-1">Platform Debug:</h6>
                      <div className="text-xs text-yellow-200">
                        {Object.keys(preview.preview_data.social_content).map(platform => (
                          <span key={platform} className="inline-block mr-2 px-1 bg-yellow-800/50 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Data (for debugging) */}
                  <details className="mt-3">
                    <summary className="text-xs text-gray-400 cursor-pointer">Show raw data (debug)</summary>
                    <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                      {JSON.stringify(preview.preview_data, null, 2)}
                    </pre>
                  </details>
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
                        value={feedbackTexts[preview.id] || ''}
                        onChange={(e) => setFeedbackTexts(prev => ({ ...prev, [preview.id]: e.target.value }))}
                        placeholder="Add your feedback or comments..."
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updatePreviewStatus(preview.id, 'approved')}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => updatePreviewStatus(preview.id, 'rejected')}
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
