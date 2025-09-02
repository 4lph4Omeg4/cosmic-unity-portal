import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { Crown, CheckCircle, AlertCircle } from 'lucide-react'

export default function MakeMeAdmin() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const makeMeAdmin = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in')
        return
      }

      // Update profile to make user admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          role: 'admin'
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error making user admin:', updateError)
        setError('Failed to make you admin: ' + updateError.message)
        return
      }

      setSuccess(true)
      console.log('Successfully made user admin')
      
      // Redirect to new admin dashboard after 2 seconds
      setTimeout(() => {
        navigate('/timeline-alchemy/admin/dashboard-new')
      }, 2000)
      
    } catch (error) {
      console.error('Error in makeMeAdmin:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Make Me Admin</h1>
        <p className="mt-2 text-gray-300">Quick admin access for testing</p>
      </div>

      <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <div className="text-green-400 font-medium">
                Success! You are now admin
              </div>
              <div className="text-sm text-gray-300">
                Redirecting to admin dashboard...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-gray-300">
                Click the button below to make yourself admin for testing purposes.
              </div>
              
              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <Button
                onClick={makeMeAdmin}
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {loading ? 'Making you admin...' : 'Make Me Admin'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
