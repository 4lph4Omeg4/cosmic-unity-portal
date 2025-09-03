import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TimelineAlchemyAdminDashboard() {
  const navigate = useNavigate()
  
  // Redirect to new dashboard immediately
  useEffect(() => {
    console.log('Redirecting to new admin dashboard...')
    navigate('/timeline-alchemy/admin/dashboard-new')
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="text-lg text-white mb-2">Redirecting to new dashboard...</div>
        <div className="text-sm text-gray-400">Please wait...</div>
      </div>
    </div>
  )
}