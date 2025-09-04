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
    // Check if this is a POST request with body data
    if (req.method === 'POST') {
      const body = await req.json()
      const { code, state, platform } = body
      
      console.log('Callback received via POST:', { code, state, platform })
      
      return await processCallback(code, state, platform)
    }
    
    // Handle GET request (direct URL callback)
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    if (error) {
      return new Response(
        JSON.stringify({ error: `OAuth error: ${error}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!code || !state) {
      return new Response(
        JSON.stringify({ error: 'Missing code or state parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse state to get user ID and platform
    const [userId, platform] = state.split('_')
    
    if (!userId || !platform) {
      return new Response(
        JSON.stringify({ error: 'Invalid state parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return await processCallback(code, state, platform)

  } catch (error) {
    console.error('Error in social-callback function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function processCallback(code: string, state: string, platform: string) {
  // Parse state to get user ID and platform
  const [userId, platformFromState] = state.split('_')
  
  if (!userId || !platformFromState) {
    return new Response(
      JSON.stringify({ error: 'Invalid state parameter' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  // Use platform from state if not provided in body
  const actualPlatform = platform || platformFromState

  // Initialize Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Exchange code for access token
  const tokenData = await exchangeCodeForToken(actualPlatform, code, '')
  
  if (!tokenData) {
    return new Response(
      JSON.stringify({ error: 'Failed to exchange code for token' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  // Get user profile from platform
  const profileData = await getUserProfile(actualPlatform, tokenData.access_token)
  
  if (!profileData) {
    return new Response(
      JSON.stringify({ error: 'Failed to get user profile' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  // Save connection to database
  const { error: dbError } = await supabaseClient
    .from('social_connections')
    .upsert({
      user_id: userId,
      platform: actualPlatform,
      platform_user_id: profileData.id,
      platform_username: profileData.username,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_expires_at: tokenData.expires_at ? new Date(tokenData.expires_at).toISOString() : null,
      scope: tokenData.scope,
      is_active: true,
      last_used_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    })

  if (dbError) {
    console.error('Database error:', dbError)
    return new Response(
      JSON.stringify({ error: 'Failed to save connection' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  // Return success response
  return new Response(
    JSON.stringify({ 
      success: true, 
      platform: actualPlatform,
      username: profileData.username 
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
}

async function exchangeCodeForToken(platform: string, code: string, redirectUri: string) {
  const siteUrl = Deno.env.get('SITE_URL')
  const redirectUriParam = `${siteUrl}/auth/callback/${platform}`
  
  switch (platform) {
    case 'instagram':
      return await exchangeInstagramToken(code, redirectUriParam)
    case 'facebook':
      return await exchangeFacebookToken(code, redirectUriParam)
    case 'twitter':
      return await exchangeTwitterToken(code, redirectUriParam)
    case 'linkedin':
      return await exchangeLinkedInToken(code, redirectUriParam)
    default:
      return null
  }
}

async function exchangeInstagramToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('INSTAGRAM_CLIENT_ID')
  const clientSecret = Deno.env.get('INSTAGRAM_CLIENT_SECRET')
  
  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    })
  })
  
  if (!response.ok) {
    console.error('Instagram token exchange failed:', await response.text())
    return null
  }
  
  return await response.json()
}

async function exchangeFacebookToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('FACEBOOK_CLIENT_ID')
  const clientSecret = Deno.env.get('FACEBOOK_CLIENT_SECRET')
  
  console.log('Facebook token exchange:', { clientId, redirectUri, code: code.substring(0, 10) + '...' })
  
  const url = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
  url.searchParams.set('client_id', clientId!)
  url.searchParams.set('client_secret', clientSecret!)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('code', code)
  
  console.log('Facebook token URL:', url.toString())
  
  const response = await fetch(url.toString())
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Facebook token exchange failed:', errorText)
    return null
  }
  
  const tokenData = await response.json()
  console.log('Facebook token response:', tokenData)
  
  return tokenData
}

async function exchangeTwitterToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('TWITTER_CLIENT_ID')
  const clientSecret = Deno.env.get('TWITTER_CLIENT_SECRET')
  
  const basicAuth = btoa(`${clientId}:${clientSecret}`)
  
  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: 'challenge' // In production, use proper PKCE
    })
  })
  
  if (!response.ok) {
    console.error('Twitter token exchange failed:', await response.text())
    return null
  }
  
  return await response.json()
}

async function exchangeLinkedInToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')
  
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!
    })
  })
  
  if (!response.ok) {
    console.error('LinkedIn token exchange failed:', await response.text())
    return null
  }
  
  return await response.json()
}

async function getUserProfile(platform: string, accessToken: string) {
  switch (platform) {
    case 'instagram':
      return await getInstagramProfile(accessToken)
    case 'facebook':
      return await getFacebookProfile(accessToken)
    case 'twitter':
      return await getTwitterProfile(accessToken)
    case 'linkedin':
      return await getLinkedInProfile(accessToken)
    default:
      return null
  }
}

async function getInstagramProfile(accessToken: string) {
  const response = await fetch('https://graph.instagram.com/me?fields=id,username', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  if (!response.ok) {
    console.error('Instagram profile fetch failed:', await response.text())
    return null
  }
  
  const data = await response.json()
  return {
    id: data.id,
    username: data.username
  }
}

async function getFacebookProfile(accessToken: string) {
  console.log('Fetching Facebook profile with token:', accessToken.substring(0, 10) + '...')
  
  const response = await fetch('https://graph.facebook.com/me?fields=id,name', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Facebook profile fetch failed:', errorText)
    return null
  }
  
  const data = await response.json()
  console.log('Facebook profile data:', data)
  
  return {
    id: data.id,
    username: data.name
  }
}

async function getTwitterProfile(accessToken: string) {
  const response = await fetch('https://api.twitter.com/2/users/me?user.fields=username', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  if (!response.ok) {
    console.error('Twitter profile fetch failed:', await response.text())
    return null
  }
  
  const data = await response.json()
  return {
    id: data.data.id,
    username: data.data.username
  }
}

async function getLinkedInProfile(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName)', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  if (!response.ok) {
    console.error('LinkedIn profile fetch failed:', await response.text())
    return null
  }
  
  const data = await response.json()
  return {
    id: data.id,
    username: `${data.firstName} ${data.lastName}`
  }
}
