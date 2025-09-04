import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      setLoading(true)
      
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')
      
      console.log('OAuth callback received:', { code, state, error })
      
      if (error) {
        setError(`OAuth error: ${error}`)
        return
      }
      
      if (!code || !state) {
        setError('Missing code or state parameter')
        return
      }
      
      // Parse state to get platform
      const [userId, platform] = state.split('_')
      
      if (!platform) {
        setError('Invalid state parameter')
        return
      }
      
      console.log('Processing callback for platform:', platform)
      
      // Call the Supabase Edge Function to handle the callback
      const { data, error: callbackError } = await supabase.functions.invoke('social-callback', {
        body: {
          code,
          state,
          platform
        }
      })
      
      if (callbackError) {
        console.error('Callback error:', callbackError)
        setError(JSON.stringify(callbackError, null, 2))
        return
      }
      
      console.log('Callback success:', data)
      
      toast({
        title: "Success!",
        description: `Successfully connected to ${platform}`,
      })
      
      // Close the popup window if it was opened in a popup
      if (window.opener) {
        window.close()
      } else {
        // Navigate back to social connections page
        navigate('/timeline-alchemy/admin/social-connections')
      }
      
    } catch (err) {
      console.error('Callback error:', err)
      setError(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-white mb-2">Processing OAuth callback...</div>
          <div className="text-sm text-gray-400">Please wait...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-red-400 mb-2">OAuth Error</div>
          <div className="text-sm text-gray-400 mb-4">{error}</div>
          <button 
            onClick={() => window.close()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="text-lg text-green-400 mb-2">Success!</div>
        <div className="text-sm text-gray-400">OAuth callback processed successfully</div>
      </div>
    </div>
  )
}
