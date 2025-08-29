'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus } from 'lucide-react'
import { getIdeas } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface Idea {
  id: string
  title: string
  description: string | null
  status: 'draft' | 'approved' | 'rejected'
  created_at: string
  created_by: string
  clients: {
    name: string
    org_id: string
  }
  organizations: {
    name: string
  }
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [selectedIdeas, setSelectedIdeas] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadIdeas()
  }, [])

  useEffect(() => {
    filterIdeas()
  }, [ideas, searchTerm, statusFilter])

  const loadIdeas = async () => {
    try {
      const data = await getIdeas()
      setIdeas(data)
    } catch (error) {
      console.error('Error loading ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterIdeas = () => {
    let filtered = ideas

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.clients.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(idea => idea.status === statusFilter)
    }

    setFilteredIdeas(filtered)
  }

  const toggleIdeaSelection = (ideaId: string) => {
    const newSelected = new Set(selectedIdeas)
    if (newSelected.has(ideaId)) {
      newSelected.delete(ideaId)
    } else {
      newSelected.add(ideaId)
    }
    setSelectedIdeas(newSelected)
  }

  const deselectIdea = (ideaId: string) => {
    const newSelected = new Set(selectedIdeas)
    newSelected.delete(ideaId)
    setSelectedIdeas(newSelected)
  }

  const selectAll = () => {
    if (selectedIdeas.size === filteredIdeas.length) {
      setSelectedIdeas(new Set())
    } else {
      setSelectedIdeas(new Set(filteredIdeas.map(idea => idea.id)))
    }
  }

  const clearSelection = () => {
    setSelectedIdeas(new Set())
  }

  const createPreview = () => {
    if (selectedIdeas.size === 0) return
    
    // Store selected ideas in sessionStorage and navigate to preview wizard
    sessionStorage.setItem('selectedIdeas', JSON.stringify(Array.from(selectedIdeas)))
    router.push('/admin/preview-wizard')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      approved: 'success',
      rejected: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading ideas...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ideas Management</h1>
          {selectedIdeas.size > 0 && (
            <p className="text-gray-600 mt-1">
              {selectedIdeas.size} idee{selectedIdeas.size !== 1 ? 'ën' : ''} geselecteerd voor preview
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {selectedIdeas.size > 0 && (
            <Button 
              onClick={() => router.push('/admin/preview-wizard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Preview ({selectedIdeas.size})
            </Button>
          )}
          <Button 
            onClick={() => router.push('/admin/preview-wizard')}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Preview
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas, descriptions, or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedIdeas.size === filteredIdeas.length && filteredIdeas.length > 0}
                onCheckedChange={selectAll}
              />
              <span>Select All ({filteredIdeas.length})</span>
            </div>
            

            
            {selectedIdeas.size > 0 && (
              <div className="flex gap-2">
                <Button onClick={clearSelection} variant="outline" size="sm">
                  Clear Selection
                </Button>
                <Button onClick={createPreview} variant="default">
                  Create Preview from {selectedIdeas.size} Selected
                </Button>
              </div>
            )}
            

          </div>
        </CardContent>
      </Card>

      {/* Ideas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ideas ({filteredIdeas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                  selectedIdeas.has(idea.id) ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <Checkbox
                  checked={selectedIdeas.has(idea.id)}
                  onCheckedChange={() => toggleIdeaSelection(idea.id)}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{idea.title}</h3>
                    {getStatusBadge(idea.status)}
                    {selectedIdeas.has(idea.id) && (
                      <Badge variant="default" className="bg-blue-600">
                        Selected
                      </Badge>
                    )}
                  </div>
                  
                  {idea.description && (
                    <p className="text-gray-600 mb-2">{idea.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Client: {idea.clients.name}</span>
                    <span>Organization: {idea.organizations.name}</span>
                    <span>Created: {new Date(idea.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {selectedIdeas.has(idea.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deselectIdea(idea.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Deselect
                  </Button>
                )}
              </div>
            ))}
            
            {filteredIdeas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No ideas found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
