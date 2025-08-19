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

interface Idea {
  id: string
  title: string
  description: string
  category: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  priority: 'low' | 'medium' | 'high'
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export default function TimelineAlchemyIdeas() {
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedIdeas, setSelectedIdeas] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      // TODO: Implement actual API call
      const mockData: Idea[] = [
        {
          id: '1',
          title: 'AI-Powered Content Calendar',
          description: 'An intelligent system that automatically schedules and optimizes content based on audience engagement patterns and trending topics.',
          category: 'Technology',
          status: 'approved',
          priority: 'high',
          author: 'Sarah Chen',
          createdAt: '2025-01-15',
          updatedAt: '2025-01-18',
          tags: ['AI', 'Automation', 'Analytics']
        },
        {
          id: '2',
          title: 'Mindfulness Integration Guide',
          description: 'A comprehensive guide for integrating mindfulness practices into daily content creation routines.',
          category: 'Wellness',
          status: 'review',
          priority: 'medium',
          author: 'Michael Rodriguez',
          createdAt: '2025-01-14',
          updatedAt: '2025-01-16',
          tags: ['Mindfulness', 'Wellness', 'Productivity']
        },
        {
          id: '3',
          title: 'Community Collaboration Hub',
          description: 'A platform for creators to collaborate, share resources, and co-create content.',
          category: 'Community',
          status: 'draft',
          priority: 'high',
          author: 'Emma Thompson',
          createdAt: '2025-01-13',
          updatedAt: '2025-01-13',
          tags: ['Collaboration', 'Community', 'Networking']
        },
        {
          id: '4',
          title: 'Future of Content Creation',
          description: 'Exploring emerging trends and technologies that will shape the future of digital content.',
          category: 'Trends',
          status: 'approved',
          priority: 'medium',
          author: 'David Kim',
          createdAt: '2025-01-12',
          updatedAt: '2025-01-15',
          tags: ['Future', 'Trends', 'Innovation']
        },
        {
          id: '5',
          title: 'Sustainable Content Strategy',
          description: 'Building long-term content strategies that prioritize quality over quantity.',
          category: 'Strategy',
          status: 'draft',
          priority: 'low',
          author: 'Lisa Wang',
          createdAt: '2025-01-11',
          updatedAt: '2025-01-11',
          tags: ['Strategy', 'Sustainability', 'Quality']
        }
      ]
      setIdeas(mockData)
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || idea.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || idea.priority === selectedPriority
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIdeas(new Set(filteredIdeas.map(idea => idea.id)))
      setSelectAll(true)
    } else {
      setSelectedIdeas(new Set())
      setSelectAll(false)
    }
  }

  const handleSelectIdea = (ideaId: string, checked: boolean) => {
    const newSelected = new Set(selectedIdeas)
    if (checked) {
      newSelected.add(ideaId)
    } else {
      newSelected.delete(ideaId)
    }
    setSelectedIdeas(newSelected)
    setSelectAll(newSelected.size === filteredIdeas.length)
  }

  const handleCreatePreview = () => {
    if (selectedIdeas.size === 0) return
    
    // Store selected idea IDs in sessionStorage for the Preview Wizard
    const selectedIds = Array.from(selectedIdeas)
    sessionStorage.setItem('selectedIdeaIds', JSON.stringify(selectedIds))
    
    // Navigate to Preview Wizard
    navigate('/timeline-alchemy/admin/preview-wizard')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
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

  const categories = [...new Set(ideas.map(idea => idea.category))]
  const statuses = [...new Set(ideas.map(idea => idea.status))]
  const priorities = [...new Set(ideas.map(idea => idea.priority))]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content Ideeën</h1>
          <p className="mt-2 text-gray-300">Beheer en organiseer je content ideeën</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Idea
          </Button>
          {selectedIdeas.size > 0 && (
            <Button onClick={handleCreatePreview} className="flex items-center gap-2">
              Create Preview
              <ArrowRight className="w-4 h-4" />
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
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ideas ({filteredIdeas.length})</CardTitle>
            {filteredIdeas.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  Select All ({selectedIdeas.size} selected)
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIdeas.map((idea) => (
              <div key={idea.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedIdeas.has(idea.id)}
                    onCheckedChange={(checked) => handleSelectIdea(idea.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(idea.status)}>
                            {idea.status}
                          </Badge>
                          <Badge className={getPriorityColor(idea.priority)}>
                            {idea.priority}
                          </Badge>
                          <Badge className={getCategoryColor(idea.category)}>
                            {idea.category}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {idea.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-3">
                          {idea.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {idea.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created: {new Date(idea.createdAt).toLocaleDateString()}
                          </div>
                          {idea.updatedAt !== idea.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Updated: {new Date(idea.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {idea.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {idea.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
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
          
          {filteredIdeas.length === 0 && (
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
