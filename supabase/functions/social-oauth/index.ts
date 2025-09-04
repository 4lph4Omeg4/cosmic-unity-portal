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
    const { platform } = await req.json()
    
    if (!platform) {
      return new Response(
        JSON.stringify({ error: 'Platform is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate OAuth URLs based on platform
    let authUrl = ''
    const state = `${user.id}_${platform}_${Date.now()}`
    
    switch (platform) {
      case 'instagram':
        authUrl = generateInstagramAuthUrl(state)
        break
      case 'facebook':
        authUrl = generateFacebookAuthUrl(state)
        break
      case 'twitter':
        authUrl = generateTwitterAuthUrl(state)
        break
      case 'linkedin':
        authUrl = generateLinkedInAuthUrl(state)
        break
      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported platform' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    return new Response(
      JSON.stringify({ authUrl, state }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in social-oauth function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateInstagramAuthUrl(state: string): string {
  const clientId = Deno.env.get('INSTAGRAM_CLIENT_ID')
  const redirectUri = `${Deno.env.get('SITE_URL')}/auth/callback/instagram`
  
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: 'user_profile,user_media',
    response_type: 'code',
    state: state
  })
  
  return `https://api.instagram.com/oauth/authorize?${params.toString()}`
}

function generateFacebookAuthUrl(state: string): string {
  const clientId = Deno.env.get('FACEBOOK_CLIENT_ID')
  const redirectUri = `${Deno.env.get('SITE_URL')}/auth/callback/facebook`
  
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: 'pages_manage_posts,pages_read_engagement,instagram_basic',
    response_type: 'code',
    state: state
  })
  
  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
}

function generateTwitterAuthUrl(state: string): string {
  const clientId = Deno.env.get('TWITTER_CLIENT_ID')
  const redirectUri = `${Deno.env.get('SITE_URL')}/auth/callback/twitter`
  
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: 'tweet.read tweet.write users.read',
    response_type: 'code',
    state: state,
    code_challenge: 'challenge', // In production, use PKCE
    code_challenge_method: 'plain'
  })
  
  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`
}

function generateLinkedInAuthUrl(state: string): string {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
  const redirectUri = `${Deno.env.get('SITE_URL')}/auth/callback/linkedin`
  
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: 'r_liteprofile r_emailaddress w_member_social',
    response_type: 'code',
    state: state
  })
  
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
}
