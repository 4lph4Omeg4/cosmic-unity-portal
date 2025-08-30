'use server'

import { supabaseAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Test function to see what's in the database
export async function testDatabaseConnection() {
  try {
    // Check if previews table exists and has data
    const { data: previews, error: previewsError } = await supabaseAdmin
      .from('previews')
      .select('*')
      .limit(5)

    if (previewsError) {
      console.error('Error with previews table:', previewsError)
      return { error: 'Previews table error: ' + previewsError.message }
    }

    // Check if ideas table exists and has data
    const { data: ideas, error: ideasError } = await supabaseAdmin
      .from('ideas')
      .select('*')
      .limit(5)

    if (ideasError) {
      console.error('Error with ideas table:', ideasError)
      return { error: 'Ideas table error: ' + ideasError.message }
    }

    // Check if clients table exists and has data
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(5)

    if (clientsError) {
      console.error('Error with clients table:', clientsError)
      return { error: 'Clients table error: ' + clientsError.message }
    }

    return {
      previews: previews || [],
      ideas: ideas || [],
      clients: clients || [],
      message: 'Database connection successful'
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Unexpected error: ' + (error as Error).message }
  }
}

export async function getClientPreviews(userId: string) {
  try {
    console.log('getClientPreviews called with userId:', userId)
    
    // Just try to get basic previews data first
    const { data, error } = await supabaseAdmin
      .from('previews')
      .select('*')
      .limit(10)

    console.log('Basic query result:', { data, error })

    if (error) {
      console.error('Error fetching previews:', error)
      return []
    }

    // If we have data, return it
    if (data && data.length > 0) {
      console.log('Found previews:', data.length)
      return data
    } else {
      console.log('No previews found in database')
      return []
    }

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
