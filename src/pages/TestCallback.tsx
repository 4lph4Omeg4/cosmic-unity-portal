import React from 'react'

export default function TestCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Test Callback Page</h1>
        <p className="text-gray-300">This page is working!</p>
        <p className="text-sm text-gray-400 mt-2">URL: {window.location.href}</p>
      </div>
    </div>
  )
}
