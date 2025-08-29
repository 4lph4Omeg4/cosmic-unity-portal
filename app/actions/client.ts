'use server'

import { supabaseAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getClientPreviews(userId: string) {
  try {
    // For now, get all previews without user restrictions
    // In a real app, you would implement proper user-client relationships
    const { data, error } = await supabaseAdmin
      .from('previews')
      .select(`
        *,
        ideas!inner(title, description),
        clients!inner(name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching client previews:', error)
      throw new Error('Failed to fetch previews')
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error in getClientPreviews:', error)
    return []
  }
}

export async function updatePreviewStatus(
  previewId: string, 
  status: 'approved' | 'rejected',
  feedback?: string
) {
  const { data, error } = await supabaseAdmin
    .from('previews')
    .update({
      status,
      metadata: {
        feedback,
        reviewed_at: new Date().toISOString()
      }
    })
    .eq('id', previewId)
    .select()
    .single()

  if (error) {
    console.error('Error updating preview status:', error)
    throw new Error('Failed to update preview status')
  }

  revalidatePath('/client/my-previews')
  
  return data
}

export async function getClientSocialConnections(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('social_tokens')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching social connections:', error)
    throw new Error('Failed to fetch social connections')
  }

  return data || []
}

export async function connectSocialPlatform(
  userId: string,
  platform: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: string
) {
  const { data, error } = await supabaseAdmin
    .from('social_tokens')
    .upsert({
      user_id: userId,
      platform,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error connecting social platform:', error)
    throw new Error('Failed to connect social platform')
  }

  revalidatePath('/client/social-connections')
  
  return data
}

export async function disconnectSocialPlatform(userId: string, platform: string) {
  const { error } = await supabaseAdmin
    .from('social_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('platform', platform)

  if (error) {
    console.error('Error disconnecting social platform:', error)
    throw new Error('Failed to disconnect social platform')
  }

  revalidatePath('/client/social-connections')
  
  return { success: true }
}
