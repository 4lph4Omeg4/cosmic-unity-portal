'use server'

import { supabaseAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getIdeas() {
  const { data, error } = await supabaseAdmin
    .from('ideas')
    .select(`
      *,
      clients!inner(name, org_id),
      organizations!inner(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching ideas:', error)
    throw new Error('Failed to fetch ideas')
  }

  return data || []
}

export async function getClients() {
  const { data, error } = await supabaseAdmin
    .from('clients')
    .select(`
      *,
      organizations!inner(name)
    `)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching clients:', error)
    throw new Error('Failed to fetch clients')
  }

  return data || []
}

export async function createPreview(previewData: {
  idea_id: string
  client_id: string
  channel: string
  template: string
  draft_content: any
  scheduled_at?: string
}) {
  const { data, error } = await supabaseAdmin
    .from('previews')
    .insert({
      ...previewData,
      status: 'pending',
      created_by: 'admin', // In real app, get from auth context
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating preview:', error)
    throw new Error('Failed to create preview')
  }

  revalidatePath('/admin/preview-wizard')
  revalidatePath('/admin/ideas')
  
  return data
}

export async function getDashboardStats() {
  // Get new ideas count (last 24h)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const { count: newIdeas } = await supabaseAdmin
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', yesterday.toISOString())

  // Get pending approvals count
  const { count: pendingApprovals } = await supabaseAdmin
    .from('previews')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Get scheduled for today count
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
  
  const { count: scheduledToday } = await supabaseAdmin
    .from('previews')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
    .gte('scheduled_at', todayStart.toISOString())
    .lt('scheduled_at', todayEnd.toISOString())

  // Get posted/failed in last 24h
  const { count: posted24h } = await supabaseAdmin
    .from('publishes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'posted')
    .gte('published_at', yesterday.toISOString())

  const { count: failed24h } = await supabaseAdmin
    .from('publishes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed')
    .gte('published_at', yesterday.toISOString())

  return {
    newIdeas: newIdeas || 0,
    pendingApprovals: pendingApprovals || 0,
    scheduledToday: scheduledToday || 0,
    posted24h: posted24h || 0,
    failed24h: failed24h || 0
  }
}

export async function getPublishQueue() {
  const { data, error } = await supabaseAdmin
    .from('publishes')
    .select(`
      *,
      previews!inner(
        *,
        ideas!inner(title),
        clients!inner(name)
      )
    `)
    .order('published_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching publish queue:', error)
    throw new Error('Failed to fetch publish queue')
  }

  return data || []
}
