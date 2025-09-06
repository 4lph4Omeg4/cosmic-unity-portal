import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get scheduled posts that are ready to publish
    const now = new Date().toISOString()
    const { data: scheduledPosts, error: postsError } = await supabaseClient
      .from('user_previews')
      .select(`
        *,
        profiles!inner(
          social_connections(
            platform,
            access_token,
            refresh_token,
            token_expires_at,
            is_active
          )
        )
      `)
      .eq('publish_status', 'scheduled')
      .lte('scheduled_publish_at', now)

    if (postsError) {
      console.error('Error fetching scheduled posts:', postsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch scheduled posts' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No posts scheduled for publishing' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Found ${scheduledPosts.length} posts ready for publishing`)

    // Process each scheduled post
    const results = []
    for (const post of scheduledPosts) {
      try {
        const result = await publishPost(post, supabaseClient)
        results.push(result)
      } catch (error) {
        console.error(`Error publishing post ${post.id}:`, error)
        results.push({
          postId: post.id,
          success: false,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${scheduledPosts.length} posts`,
        results: results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in scheduled-publisher function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function publishPost(post: any, supabaseClient: any) {
  const { social_connections } = post.profiles
  const platforms = post.social_platforms || []
  
  if (!platforms.length) {
    throw new Error('No platforms specified for this post')
  }

  const publishResults = []
  
  for (const platform of platforms) {
    const connection = social_connections.find((conn: any) => 
      conn.platform === platform && conn.is_active
    )
    
    if (!connection) {
      console.warn(`No active connection found for platform ${platform}`)
      continue
    }

    try {
      // Check if token is expired and refresh if needed
      const refreshedToken = await refreshTokenIfNeeded(connection, supabaseClient)
      const accessToken = refreshedToken || connection.access_token

      // Publish to platform
      const platformResult = await publishToPlatform(platform, accessToken, post)
      
      // Save social post record
      const { error: socialPostError } = await supabaseClient
        .from('social_posts')
        .insert({
          preview_id: post.id,
          platform: platform,
          platform_post_id: platformResult.id,
          status: 'published',
          published_at: new Date().toISOString()
        })

      if (socialPostError) {
        console.error('Error saving social post:', socialPostError)
      }

      publishResults.push({
        platform,
        success: true,
        platformPostId: platformResult.id
      })

    } catch (error) {
      console.error(`Error publishing to ${platform}:`, error)
      
      // Save failed social post record
      await supabaseClient
        .from('social_posts')
        .insert({
          preview_id: post.id,
          platform: platform,
          status: 'failed',
          error_message: error.message
        })

      publishResults.push({
        platform,
        success: false,
        error: error.message
      })
    }
  }

  // Update post status
  const allSuccessful = publishResults.every(result => result.success)
  const { error: updateError } = await supabaseClient
    .from('user_previews')
    .update({
      publish_status: allSuccessful ? 'published' : 'failed',
      published_at: allSuccessful ? new Date().toISOString() : null,
      publish_error: allSuccessful ? null : 'Some platforms failed to publish'
    })
    .eq('id', post.id)

  if (updateError) {
    console.error('Error updating post status:', updateError)
  }

  return {
    postId: post.id,
    success: allSuccessful,
    results: publishResults
  }
}

async function refreshTokenIfNeeded(connection: any, supabaseClient: any) {
  if (!connection.token_expires_at) {
    return null // No expiration, token is still valid
  }

  const expiresAt = new Date(connection.token_expires_at)
  const now = new Date()
  
  // Refresh if token expires within 5 minutes
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    try {
      const refreshedToken = await refreshAccessToken(connection.platform, connection.refresh_token)
      
      if (refreshedToken) {
        // Update token in database
        await supabaseClient
          .from('social_connections')
          .update({
            access_token: refreshedToken.access_token,
            refresh_token: refreshedToken.refresh_token || connection.refresh_token,
            token_expires_at: refreshedToken.expires_at ? new Date(refreshedToken.expires_at).toISOString() : null,
            last_used_at: new Date().toISOString()
          })
          .eq('id', connection.id)
        
        return refreshedToken.access_token
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }
  
  return null
}

async function refreshAccessToken(platform: string, refreshToken: string) {
  // Implementation would depend on each platform's refresh token flow
  // This is a simplified version
  console.log(`Refreshing token for ${platform}`)
  return null // Placeholder
}

async function publishToPlatform(platform: string, accessToken: string, post: any) {
  switch (platform) {
    case 'instagram':
      return await publishToInstagram(accessToken, post)
    case 'facebook':
      return await publishToFacebook(accessToken, post)
    case 'twitter':
      return await publishToTwitter(accessToken, post)
    case 'linkedin':
      return await publishToLinkedIn(accessToken, post)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

async function publishToInstagram(accessToken: string, post: any) {
  // Instagram Basic Display API doesn't support posting
  // You would need Instagram Graph API for business accounts
  throw new Error('Instagram posting requires Instagram Graph API (business accounts only)')
}

async function publishToFacebook(accessToken: string, post: any) {
  const response = await fetch('https://graph.facebook.com/v18.0/me/feed', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: post.preview_data?.content || 'Check out this post!',
      link: post.preview_data?.url || ''
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${error}`)
  }

  const data = await response.json()
  return { id: data.id }
}

async function publishToTwitter(accessToken: string, post: any) {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: post.preview_data?.content || 'Check out this post!'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter API error: ${error}`)
  }

  const data = await response.json()
  return { id: data.data.id }
}

async function publishToLinkedIn(accessToken: string, post: any) {
  // LinkedIn requires a different approach with UGC (User Generated Content) API
  // This is a simplified version
  throw new Error('LinkedIn posting requires UGC API implementation')
}
