import React, { useState } from 'react'
import WelcomeSuccess from './WelcomeSuccess'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WelcomeSuccessDemo() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [username, setUsername] = useState('Demo Gebruiker')

  const handleGoToDashboard = () => {
    alert('Navigeren naar dashboard...')
    setShowWelcome(false)
  }

  const handleSetupProfile = () => {
    alert('Navigeren naar profiel setup...')
    setShowWelcome(false)
  }

  const handleInviteTeam = () => {
    alert('Team uitnodigen functionaliteit wordt geladen...')
  }

  if (showWelcome) {
    return (
      <WelcomeSuccess
        username={username}
        onGoToDashboard={handleGoToDashboard}
        onSetupProfile={handleSetupProfile}
        onInviteTeam={handleInviteTeam}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">WelcomeSuccess Component Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Gebruikersnaam
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Voer een gebruikersnaam in"
            />
          </div>
          
          <Button
            onClick={() => setShowWelcome(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Toon Welkomstpagina
          </Button>
          
          <p className="text-sm text-gray-600 text-center">
            Klik op de knop hierboven om de WelcomeSuccess component te bekijken.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
