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

// Add image upload functionality
const uploadImageToSupabase = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('blog_images') // Using the bucket name from your automation
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Error uploading image:', error)
      return null
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('blog_images')
      .getPublicUrl(fileName)
    
    return urlData.publicUrl
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error)
    return null
  }
}

interface BlogPost {
  id: string
  title: string
  content: string
  body?: string
  excerpt?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  author_id: string
  created_at: string
  updated_at: string
  published_at?: string
  tags?: string[]
  category?: string
  image_url?: string
  image_public_url?: string
  facebook?: string
  instagram?: string
  x?: string
  linkedin?: string
  ai_blog?: any // Use any to avoid TypeScript issues with dynamic field names
  imageLoading?: boolean
  imageError?: boolean
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
  const [imageStates, setImageStates] = useState<Record<string, { loading: boolean; error: boolean }>>({})

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

      console.log('=== LOADING FROM BLOG_POSTS TABLE ===')
      console.log('Raw blog posts data:', data) // Debug log
      console.log('Number of posts found:', data?.length || 0)
      
      if (data && data.length > 0) {
        console.log('First post structure:', data[0])
        console.log('First post ai_blog field:', data[0].ai_blog)
        console.log('First post ai_blog type:', typeof data[0].ai_blog)
        console.log('All available columns in first post:', Object.keys(data[0]))
        
        // Check for image-related columns
        const imageColumns = Object.keys(data[0]).filter(key => 
          key.toLowerCase().includes('image') || 
          key.toLowerCase().includes('img') || 
          key.toLowerCase().includes('picture') ||
          key.toLowerCase().includes('photo')
        )
        console.log('Image-related columns found:', imageColumns)
        
        // Show values for image columns
        imageColumns.forEach(col => {
          console.log(`Column "${col}" value:`, data[0][col])
        })
        
        // Check for social media columns
        const socialColumns = Object.keys(data[0]).filter(key => 
          key.toLowerCase().includes('facebook') || 
          key.toLowerCase().includes('instagram') || 
          key.toLowerCase().includes('x') ||
          key.toLowerCase().includes('linkedin') ||
          key.toLowerCase().includes('twitter')
        )
        console.log('Social media columns found:', socialColumns)
        
        // Show values for social media columns
        socialColumns.forEach(col => {
          console.log(`Column "${col}" value:`, data[0][col])
        })
        
        // Check for body/content columns
        const contentColumns = Object.keys(data[0]).filter(key => 
          key.toLowerCase().includes('body') || 
          key.toLowerCase().includes('content')
        )
        console.log('Content columns found:', contentColumns)
        
        // Show values for content columns
        contentColumns.forEach(col => {
          console.log(`Column "${col}" value:`, data[0][col])
        })
        
        // Check image columns
        console.log('=== IMAGE COLUMN CHECK ===')
        console.log('image_url value:', data[0].image_url)
        console.log('image_url exists:', !!data[0].image_url)
        console.log('image_public_url value:', data[0].image_public_url)
        console.log('image_public_url exists:', !!data[0].image_public_url)
        
        // Check if image columns have valid URLs
        const imageUrl = data[0].image_url
        const imagePublicUrl = data[0].image_public_url
        
        if (imageUrl) {
          try {
            const url = new URL(imageUrl)
            console.log('image_url is valid:', url.href)
            console.log('image_url protocol:', url.protocol)
            console.log('image_url hostname:', url.hostname)
          } catch (urlError) {
            console.log('image_url is not valid:', imageUrl)
          }
        }
        
        if (imagePublicUrl) {
          try {
            const url = new URL(imagePublicUrl)
            console.log('image_public_url is valid:', url.href)
            console.log('image_public_url protocol:', url.protocol)
            console.log('image_public_url hostname:', url.hostname)
          } catch (urlError) {
            console.log('image_public_url is not valid:', imagePublicUrl)
          }
        }
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
            console.log('ai_blog keys:', aiBlog ? Object.keys(aiBlog) : 'no keys')
          } catch (parseError) {
            console.error('Error parsing ai_blog JSON:', parseError, 'Raw value:', post.ai_blog)
            aiBlog = null
          }
        }
        
        // Safe extraction with fallbacks for all fields - check multiple possible field names
        const safeTitle = aiBlog?.Title || aiBlog?.title || aiBlog?.Title || post.title || 'Geen titel'
        const safeBody = post.body || aiBlog?.Body || aiBlog?.body || aiBlog?.content || post.content || ''
        const safeTags = aiBlog?.Tags || aiBlog?.tags || aiBlog?.tag || post.tags || []
        const safeSources = aiBlog?.Sources || aiBlog?.sources || aiBlog?.source || []
        const safeSocial = aiBlog?.Social || aiBlog?.social || null
        const safeSEO = aiBlog?.SEO || aiBlog?.seo || null
        
        // Image extraction - prioritize image_public_url over image_url
        const safeImage = post.image_public_url || post.image_url || null
        
        // Social media links extraction
        const facebookLink = post.facebook || null
        const instagramLink = post.instagram || null
        const xLink = post.x || null
        const linkedinLink = post.linkedin || null
        
        // Ensure arrays are always arrays to prevent .length errors
        const normalizedTags = Array.isArray(safeTags) ? safeTags : (safeTags ? [safeTags] : [])
        const normalizedSources = Array.isArray(safeSources) ? safeSources : (safeSources ? [safeSources] : [])
        const normalizedKeywords = Array.isArray(safeSEO?.keywords) ? safeSEO.keywords : []
        
        console.log('Safe extraction results:', {
          safeTitle,
          safeBody: safeBody ? (safeBody.substring(0, 100) + '...') : 'NO BODY',
          normalizedTags,
          aiBlogKeys: aiBlog ? Object.keys(aiBlog) : 'no aiBlog',
          originalPostTitle: post.title,
          originalPostContent: post.content ? post.content.substring(0, 50) + '...' : 'NO CONTENT',
          originalPostBody: post.body ? post.body.substring(0, 50) + '...' : 'NO BODY',
          safeImage,
          imageUrlFromBlogPosts: post.image_url,
          imagePublicUrlFromBlogPosts: post.image_public_url,
          socialLinks: {
            facebook: facebookLink,
            instagram: instagramLink,
            x: xLink,
            linkedin: linkedinLink
          }
        })
        
                 return {
           id: post.id,
           title: safeTitle,
           content: safeBody,
           body: safeBody,
           excerpt: post.excerpt || (safeBody ? safeBody.substring(0, 150) + '...' : 'Geen content'),
           status: post.status || 'draft',
           author_id: post.author_id || post.user_id || 'Onbekende auteur',
           created_at: post.created_at,
           updated_at: post.updated_at || post.created_at,
           published_at: post.published_at || post.created_at,
           tags: normalizedTags,
           category: post.category || 'Algemeen',
           image_url: safeImage,
           facebook: facebookLink,
           instagram: instagramLink,
           x: xLink,
           linkedin: linkedinLink,
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
      
             // Initialize image loading states for posts with images
       const initialImageStates: Record<string, { loading: boolean; error: boolean }> = {}
       transformedPosts.forEach(post => {
         if (post.image_url) {
           initialImageStates[post.id] = { loading: true, error: false }
           
           // Test image URL validity
           testImageUrl(post.image_url).then(isValid => {
             if (!isValid) {
               setImageStates(prev => ({
                 ...prev,
                 [post.id]: { loading: false, error: true }
               }))
             }
           })
         }
       })
      setImageStates(initialImageStates)
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
      (post.body && post.body.toLowerCase().includes(searchLower)) ||
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

  const handleImageLoad = (postId: string) => {
    setImageStates(prev => ({
      ...prev,
      [postId]: { loading: false, error: false }
    }))
  }

  const handleImageError = (postId: string) => {
    setImageStates(prev => ({
      ...prev,
      [postId]: { loading: false, error: true }
    }))
  }

  const testImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Gekopieerd!",
        description: `${platform} link gekopieerd naar klembord.`,
        variant: "default",
      })
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast({
        title: "Fout bij kopiëren",
        description: "Kon link niet kopiëren naar klembord.",
        variant: "destructive",
      })
    }
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
       case 'published': return 'bg-green-900 text-green-200 border border-green-700'
       case 'scheduled': return 'bg-purple-900 text-purple-200 border border-purple-700'
       case 'draft': return 'bg-gray-700 text-gray-200 border border-gray-600'
       case 'archived': return 'bg-red-900 text-red-200 border border-red-700'
       default: return 'bg-gray-700 text-gray-200 border border-gray-600'
     }
   }
 
   const getCategoryColor = (category: string) => {
     switch (category) {
       case 'Technology': return 'bg-blue-900 text-blue-200 border border-blue-700'
       case 'Wellness': return 'bg-green-900 text-green-200 border border-green-700'
       case 'Community': return 'bg-purple-900 text-purple-200 border border-purple-700'
       case 'Trends': return 'bg-orange-900 text-orange-200 border border-orange-700'
       case 'Strategy': return 'bg-indigo-900 text-indigo-200 border border-indigo-700'
       default: return 'bg-gray-700 text-gray-200 border border-gray-600'
     }
   }

     if (loading) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-gray-900">
         <div className="text-lg text-white">Loading ideas...</div>
       </div>
     )
   }

  const categories = [...new Set(blogPosts.map(post => post.category))]
  const statuses = [...new Set(blogPosts.map(post => post.status))]

     return (
     <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
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
       <Card className="bg-gray-800 border-gray-700">
         <CardHeader>
           <CardTitle className="text-white">Search & Filters</CardTitle>
         </CardHeader>
                 <CardContent className="space-y-4 text-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                 <Input
                   placeholder="Search ideas by title, description, or author..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                 />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-800 text-gray-200">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800 text-gray-200">{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 focus:border-blue-400"
            >
              <option value="all" className="bg-gray-800 text-gray-200">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status} className="bg-gray-800 text-gray-200">{status}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

             {/* Ideas List */}
       <Card className="bg-gray-800 border-gray-700">
         <CardHeader>
           <div className="flex items-center justify-between">
             <CardTitle className="text-white">Blog Posts ({filteredPosts.length})</CardTitle>
            {filteredPosts.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                                       <span className="text-sm text-gray-300">
                         Select All ({selectedPosts.size} selected)
                       </span>
              </div>
            )}
          </div>
        </CardHeader>
                 <CardContent className="text-gray-100">
           <div className="space-y-4">
            {filteredPosts.map((post) => (
                             <div key={post.id} className="border border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedPosts.has(post.id)}
                    onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                  />
                  
                                     {/* Featured Image - Prominent position */}
                   {post.image_url && (
                    <div className="flex-shrink-0 relative">
                      {/* Loading state */}
                      {imageStates[post.id]?.loading !== false && (
                        <div className="w-32 h-32 bg-gray-700 rounded-lg border border-gray-600 shadow-sm flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      
                                             {/* Image */}
                       <img 
                         src={post.image_url} 
                         alt={post.title}
                         className={`w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer ${
                           imageStates[post.id]?.loading !== false ? 'hidden' : ''
                         }`}
                         onLoad={() => handleImageLoad(post.id)}
                         onError={() => handleImageError(post.id)}
                         onClick={() => {
                           // Open image in full size in new tab
                           window.open(post.image_url, '_blank')
                         }}
                         title="Klik om afbeelding in volledige grootte te bekijken"
                       />
                      
                      {/* Error state */}
                      {imageStates[post.id]?.error && (
                        <div className="absolute inset-0 w-32 h-32 bg-red-900 rounded-lg border border-red-600 shadow-sm flex items-center justify-center">
                          <div className="text-red-400 text-xs text-center">
                            <div className="w-8 h-8 mx-auto mb-1">❌</div>
                            Afbeelding kon niet laden
                          </div>
                        </div>
                      )}
                      
                      {/* Image overlay with info */}
                      {!imageStates[post.id]?.error && !imageStates[post.id]?.loading && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 text-white text-xs font-medium">
                            Bekijk afbeelding
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                                     {/* Fallback placeholder when no image */}
                   {!post.image_url && (
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-700 rounded-lg border border-gray-600 shadow-sm flex items-center justify-center">
                      <div className="text-gray-400 text-xs text-center">
                        <div className="w-8 h-8 mx-auto mb-1">📄</div>
                        Geen afbeelding
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                                             <Badge className={getStatusColor(post.status)}>
                         {post.status}
                       </Badge>
                       <Badge className={getCategoryColor(post.category || 'Algemeen')}>
                         {post.category || 'Algemeen'}
                       </Badge>
                       {post.ai_blog && (
                         <Badge className="bg-purple-900 text-purple-200 border border-purple-700">
                           AI Generated
                         </Badge>
                       )}
                       {/* Tags - Display as badges in the top section */}
                       {post.tags && post.tags.length > 0 && (
                         post.tags.map((tag, index) => (
                           <Badge key={index} className="bg-blue-900 text-blue-200 border border-blue-700">
                             #{tag}
                           </Badge>
                         ))
                       )}
                    </div>
                    
                    <h3 className="font-semibold text-lg text-white mb-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-200 mb-3">
                      {post.excerpt || (post.body || post.content ? (post.body || post.content).substring(0, 150) + '...' : 'Geen content')}
                    </p>
                   
                   {/* Show full content if available */}
                   {(post.body || post.content) && (post.body || post.content).length > 150 && (
                     <details className="mb-3">
                       <summary className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm">
                         Toon volledige content
                       </summary>
                       <div className="mt-2 p-3 bg-gray-800 rounded text-sm text-gray-200 whitespace-pre-wrap border border-gray-700">
                         {post.body || post.content}
                       </div>
                     </details>
                   )}
                   
                   {/* Sources - Safe rendering with fallback */}
                   {post.ai_blog?.Sources && post.ai_blog.Sources.length > 0 && (
                     <div className="mb-3">
                       <span className="text-sm text-gray-300 font-medium">Sources:</span>
                       <div className="flex flex-wrap gap-2 mt-1">
                         {post.ai_blog.Sources.map((source, index) => (
                                                    <span
                           key={index}
                           className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded-full border border-gray-600"
                         >
                           📚 {source}
                         </span>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {/* Social Media Links */}
                   {(post.facebook || post.instagram || post.x || post.linkedin) && (
                     <div className="mb-3">
                                               <span className="text-sm text-gray-300 font-medium">Social Media Links:</span>
                       <div className="flex flex-wrap gap-2 mt-1">
                          {post.facebook && (
                            <div className="flex items-center gap-1">
                              <a
                                href={post.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition-colors duration-200 flex items-center gap-1"
                              >
                                📘 Facebook
                              </a>
                              <button
                                onClick={() => copyToClipboard(post.facebook!, 'Facebook')}
                                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full transition-colors duration-200"
                                title="Kopieer Facebook link"
                              >
                                📋
                              </button>
                            </div>
                          )}
                          {post.instagram && (
                            <div className="flex items-center gap-1">
                              <a
                                href={post.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-full transition-colors duration-200 flex items-center gap-1"
                              >
                                📷 Instagram
                              </a>
                              <button
                                onClick={() => copyToClipboard(post.instagram!, 'Instagram')}
                                className="px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white text-xs rounded-full transition-colors duration-200"
                                title="Kopieer Instagram link"
                              >
                                📋
                              </button>
                            </div>
                          )}
                          {post.x && (
                            <div className="flex items-center gap-1">
                              <a
                                href={post.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-xs rounded-full transition-colors duration-200 flex items-center gap-1"
                              >
                                🐦 X (Twitter)
                              </a>
                              <button
                                onClick={() => copyToClipboard(post.x!, 'X (Twitter)')}
                                className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-full transition-colors duration-200"
                                title="Kopieer X link"
                              >
                                📋
                              </button>
                            </div>
                          )}
                          {post.linkedin && (
                            <div className="flex items-center gap-1">
                              <a
                                href={post.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white text-xs rounded-full transition-colors duration-200 flex items-center gap-1"
                              >
                                💼 LinkedIn
                              </a>
                              <button
                                onClick={() => copyToClipboard(post.linkedin!, 'LinkedIn')}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition-colors duration-200"
                                title="Kopieer LinkedIn link"
                              >
                                📋
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                 </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                     <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
                       <Edit className="w-4 h-4" />
                       Edit
                     </Button>
                     
                     {/* Image Upload Button */}
                     <input
                       type="file"
                       id={`image-upload-${post.id}`}
                       accept="image/*"
                       className="hidden"
                       onChange={async (e) => {
                         const file = e.target.files?.[0]
                         if (file) {
                           const imageUrl = await uploadImageToSupabase(file)
                           if (imageUrl) {
                             // Update both image columns in the database
                             const { error } = await supabase
                               .from('blog_posts' as any)
                               .update({ 
                                 image_url: imageUrl,
                                 image_public_url: imageUrl 
                               })
                               .eq('id', post.id)
                             
                             if (error) {
                               console.error('Error updating post:', error)
                               toast({
                                 title: "Fout bij bijwerken",
                                 description: "Kon afbeelding niet bijwerken in database.",
                                 variant: "destructive",
                               })
                             } else {
                               // Update local state for both image fields
                               setBlogPosts(prev => prev.map(p => 
                                 p.id === post.id ? { 
                                   ...p, 
                                   image_url: imageUrl,
                                   image_public_url: imageUrl 
                                 } : p
                               ))
                               toast({
                                 title: "Succes!",
                                 description: "Afbeelding geüpload en bijgewerkt in beide kolommen.",
                                 variant: "default",
                               })
                             }
                           } else {
                             toast({
                               title: "Fout bij uploaden",
                               description: "Kon afbeelding niet uploaden naar Supabase.",
                               variant: "destructive",
                             })
                           }
                         }
                       }}
                     />
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="flex items-center gap-2 bg-blue-900 border-blue-700 text-blue-200 hover:bg-blue-800"
                       onClick={() => document.getElementById(`image-upload-${post.id}`)?.click()}
                     >
                       📷 Upload Image
                     </Button>
                     
                     <Button variant="outline" size="sm" className="flex items-center gap-2 bg-red-900 border-red-700 text-red-200 hover:bg-red-800">
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
               <p className="text-gray-300">No ideas found matching your criteria.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
