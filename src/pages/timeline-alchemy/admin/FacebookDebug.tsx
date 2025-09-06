import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function FacebookDebug() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if this is a callback from OAuth
  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (code && state) {
      console.log('OAuth callback detected:', { code, state, error })
      handleOAuthCallback(code, state, error)
    }
  }, [searchParams])

  const handleOAuthCallback = async (code: string, state: string, error: string | null) => {
    if (error) {
      setError(`OAuth error: ${error}`)
      return
    }
    
    toast({
      title: "OAuth Callback Received!",
      description: `Received callback with code: ${code.substring(0, 10)}...`,
    })
    
    setResult({
      type: 'oauth_callback',
      code: code.substring(0, 10) + '...',
      state: state,
      message: 'OAuth callback received successfully!'
    })
  }

  const testFacebookOAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)

      console.log('Testing Facebook OAuth...')
      
      const { data, error } = await supabase.functions.invoke('social-oauth', {
        body: { platform: 'facebook' }
      })

      if (error) {
        console.error('OAuth error:', error)
        setError(JSON.stringify(error, null, 2))
        return
      }

      console.log('OAuth response:', data)
      setResult(data)

      if (data?.authUrl) {
        // Open in new tab for testing
        window.open(data.authUrl, '_blank')
      }

    } catch (err) {
      console.error('Test error:', err)
      setError(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const testDirectFacebook = async () => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)

      // Test direct Facebook API call
      const testUrl = 'https://graph.facebook.com/v18.0/oauth/access_token'
      console.log('Testing direct Facebook API...')
      
      const response = await fetch(testUrl)
      const data = await response.json()
      
      console.log('Direct Facebook API response:', data)
      setResult(data)

    } catch (err) {
      console.error('Direct test error:', err)
      setError(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-white">Facebook Integration Debug</h1>
        <p className="text-gray-300">Test Facebook OAuth integration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">OAuth Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testFacebookOAuth} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Facebook OAuth'}
            </Button>
            
            <Button 
              onClick={testDirectFacebook} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Direct Facebook API'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Environment Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-gray-300">
              <strong>Site URL:</strong> {window.location.origin}
            </div>
            <div className="text-sm text-gray-300">
              <strong>Current URL:</strong> {window.location.href}
            </div>
            <div className="text-sm text-gray-300">
              <strong>Expected Callback:</strong> {window.location.origin}/auth/callback/facebook
            </div>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-300 bg-gray-700 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-gray-800 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-red-300 bg-gray-700 p-4 rounded overflow-auto">
              {error}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
