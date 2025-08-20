import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  author_id: string
  created_at: string
  updated_at: string
  published_at?: string
  tags?: string[]
  category?: string
  featured_image?: string
  ai_blog?: {
    Title?: string
    Body?: string
    Tags?: string[]
    Sources?: string[]
    Social?: {
      title?: string
      description?: string
      image?: string
    }
    SEO?: {
      title?: string
      description?: string
      keywords?: string[]
    }
  }
}

export default function TimelineAlchemyIdeas() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      
      const { data, error } = (await supabase
        .from('blog_posts' as any)
        .select('*')
        .order('created_at', { ascending: false })) as any

      if (error) {
        console.error('Error loading blog posts:', error)
        toast({
          title: "Fout bij laden",
          description: "Kon blog posts niet laden uit de database.",
          variant: "destructive",
        })
        return
      }

      console.log('Raw blog posts data:', data) // Debug log
      console.log('Number of posts found:', data?.length || 0)
      
      if (data && data.length > 0) {
        console.log('First post structure:', data[0])
        console.log('First post ai_blog field:', data[0].ai_blog)
        console.log('First post ai_blog type:', typeof data[0].ai_blog)
      }

      // Transform the data to match our interface
      const transformedPosts: BlogPost[] = (data || []).map((post: any) => {
        console.log('Processing post:', post) // Debug log
        
        // Safely parse ai_blog JSON with comprehensive error handling
        let aiBlog = null
        if (post.ai_blog) {
          try {
            // Check if it's already an object or needs parsing
            if (typeof post.ai_blog === 'string') {
              aiBlog = JSON.parse(post.ai_blog)
            } else if (typeof post.ai_blog === 'object') {
              aiBlog = post.ai_blog
            }
            console.log('Parsed ai_blog:', aiBlog)
          } catch (parseError) {
            console.error('Error parsing ai_blog JSON:', parseError, 'Raw value:', post.ai_blog)
            aiBlog = null
          }
        }
        
        // Safe extraction with fallbacks for all fields
        const safeTitle = aiBlog?.Title || post.title || 'Geen titel'
        const safeBody = aiBlog?.Body || post.content || ''
        const safeTags = aiBlog?.Tags || post.tags || []
        const safeSources = aiBlog?.Sources || []
        const safeSocial = aiBlog?.Social || null
        const safeSEO = aiBlog?.SEO || null
        
        // Ensure arrays are always arrays to prevent .length errors
        const normalizedTags = Array.isArray(safeTags) ? safeTags : []
        const normalizedSources = Array.isArray(safeSources) ? safeSources : []
        const normalizedKeywords = Array.isArray(safeSEO?.keywords) ? safeSEO.keywords : []
        
        console.log('Safe extraction results:', {
          safeTitle,
          safeBody: safeBody?.substring(0, 100) + '...',
          normalizedTags,
          aiBlogKeys: aiBlog ? Object.keys(aiBlog) : 'no aiBlog'
        })
        
        return {
          id: post.id,
          title: safeTitle,
          content: safeBody,
          excerpt: post.excerpt || (safeBody ? safeBody.substring(0, 150) + '...' : 'Geen content'),
          status: post.status || 'draft',
          author_id: post.author_id || post.user_id || 'Onbekende auteur',
          created_at: post.created_at,
          updated_at: post.updated_at || post.created_at,
          published_at: post.published_at || post.created_at,
          tags: normalizedTags,
          category: post.category || 'Algemeen',
          featured_image: post.featured_image || post.image_url,
          ai_blog: aiBlog
        }
      })

      console.log('Transformed posts:', transformedPosts) // Debug log
      
      // Test if we have any data at all
      if (transformedPosts.length === 0) {
        console.log('No posts found - checking if this is a data issue or parsing issue')
        if (data && data.length > 0) {
          console.log('Raw data exists but transformation failed')
        } else {
          console.log('No raw data from database')
        }
      } else {
        console.log('Successfully transformed posts:', transformedPosts.length)
        console.log('Sample transformed post:', transformedPosts[0])
      }
      
      setBlogPosts(transformedPosts)
    } catch (error) {
      console.error('Error loading blog posts:', error)
      toast({
        title: "Fout bij laden",
        description: "Er is een onverwachte fout opgetreden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = blogPosts.filter(post => {
    const searchLower = searchTerm.toLowerCase()
    
    const matchesSearch = 
      post.title.toLowerCase().includes(searchLower) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
      (post.content && post.content.toLowerCase().includes(searchLower)) ||
      (post.author_id && post.author_id.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (post.category && post.category.toLowerCase().includes(searchLower)) ||
      (post.ai_blog?.Title && post.ai_blog.Title.toLowerCase().includes(searchLower)) ||
      (post.ai_blog?.Body && post.ai_blog.Body.toLowerCase().includes(searchLower)) ||
      (post.ai_blog?.Tags && post.ai_blog.Tags.some(tag => tag.toLowerCase().includes(searchLower)))
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(new Set(filteredPosts.map(post => post.id)))
      setSelectAll(true)
    } else {
      setSelectedPosts(new Set())
      setSelectAll(false)
    }
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    const newSelected = new Set(selectedPosts)
    if (checked) {
      newSelected.add(postId)
    } else {
      newSelected.delete(postId)
    }
    setSelectedPosts(newSelected)
    setSelectAll(newSelected.size === filteredPosts.length)
  }

  const handleCreatePreview = () => {
    if (selectedPosts.size === 0) return
    
    // Store selected post IDs in sessionStorage for the Preview Wizard
    const selectedIds = Array.from(selectedPosts)
    sessionStorage.setItem('selectedPostIds', JSON.stringify(selectedIds))
    
    // Navigate to Preview Wizard
    navigate('/timeline-alchemy/admin/preview-wizard')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-purple-100 text-purple-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'bg-blue-100 text-blue-800'
      case 'Wellness': return 'bg-green-100 text-green-800'
      case 'Community': return 'bg-purple-100 text-purple-800'
      case 'Trends': return 'bg-orange-100 text-orange-800'
      case 'Strategy': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading ideas...</div>
      </div>
    )
  }

  const categories = [...new Set(blogPosts.map(post => post.category))]
  const statuses = [...new Set(blogPosts.map(post => post.status))]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Blog Posts</h1>
          <p className="mt-2 text-gray-300">Beheer en organiseer je blog posts</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Post
          </Button>
          {selectedPosts.size > 0 && (
            <Button onClick={handleCreatePreview} className="flex items-center gap-2">
              Create Preview
            </Button>
          )}
        </div>
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
                  placeholder="Search ideas by title, description, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
            {filteredPosts.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  Select All ({selectedPosts.size} selected)
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedPosts.has(post.id)}
                    onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                          <Badge className={getCategoryColor(post.category || 'Algemeen')}>
                            {post.category || 'Algemeen'}
                          </Badge>
                          {post.ai_blog && (
                            <Badge className="bg-purple-100 text-purple-800">
                              AI Generated
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-3">
                          {post.excerpt}
                        </p>
                        
                        {/* Show full content if available */}
                        {post.content && post.content.length > 150 && (
                          <details className="mb-3">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                              Toon volledige content
                            </summary>
                            <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                              {post.content}
                            </div>
                          </details>
                        )}
                        
                        {/* AI Blog Data Section */}
                        {post.ai_blog && (
                          <div className="mb-3 p-3 bg-purple-50 rounded border-l-4 border-purple-200">
                            <h4 className="font-medium text-purple-800 mb-2">AI Blog Data:</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>AI Titel:</strong> {post.ai_blog.Title || 'Geen titel'}</div>
                              <div><strong>AI Body:</strong> {post.ai_blog.Body ? (post.ai_blog.Body.length > 200 ? post.ai_blog.Body.substring(0, 200) + '...' : post.ai_blog.Body) : 'Geen content'}</div>
                              
                              {/* AI Tags - Always safe to render */}
                              {post.ai_blog.Tags && post.ai_blog.Tags.length > 0 && (
                                <div><strong>AI Tags:</strong> {post.ai_blog.Tags.join(', ')}</div>
                              )}
                              
                              {/* Sources - Safe rendering with fallback */}
                              {post.ai_blog.Sources && post.ai_blog.Sources.length > 0 && (
                                <div><strong>Sources:</strong> {post.ai_blog.Sources.join(', ')}</div>
                              )}
                              
                              {/* Social - Safe rendering with optional chaining */}
                              {post.ai_blog.Social && (
                                <div className="mt-2 p-2 bg-blue-50 rounded">
                                  <strong>Social:</strong>
                                  <div className="ml-2 space-y-1">
                                    {post.ai_blog.Social.title && <div>Title: {post.ai_blog.Social.title}</div>}
                                    {post.ai_blog.Social.description && <div>Description: {post.ai_blog.Social.description}</div>}
                                    {post.ai_blog.Social.image && <div>Image: {post.ai_blog.Social.image}</div>}
                                  </div>
                                </div>
                              )}
                              
                              {/* SEO - Safe rendering with optional chaining */}
                              {post.ai_blog.SEO && (
                                <div className="mt-2 p-2 bg-green-50 rounded">
                                  <div className="ml-2 space-y-1">
                                    {post.ai_blog.SEO.title && <div>Title: {post.ai_blog.SEO.title}</div>}
                                    {post.ai_blog.SEO.description && <div>Description: {post.ai_blog.SEO.description}</div>}
                                    {post.ai_blog.SEO.keywords && post.ai_blog.SEO.keywords.length > 0 && (
                                      <div>Keywords: {post.ai_blog.SEO.keywords.join(', ')}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author_id}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created: {new Date(post.created_at).toLocaleDateString('nl-NL')}
                          </div>
                          {post.updated_at !== post.created_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Updated: {new Date(post.updated_at).toLocaleDateString('nl-NL')}
                            </div>
                          )}
                        </div>
                        
                        {/* Tags - Safe rendering with fallback */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-600 font-medium">Tags:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* AI Tags - Display separately if different from regular tags */}
                        {post.ai_blog?.Tags && post.ai_blog.Tags.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-600 font-medium">AI Tags:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {post.ai_blog.Tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                >
                                  🤖 {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Sources - Safe rendering with fallback */}
                        {post.ai_blog?.Sources && post.ai_blog.Sources.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-600 font-medium">Sources:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {post.ai_blog.Sources.map((source, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  📚 {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {post.featured_image && (
                          <div className="mb-3">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-32 h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ideas found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
