import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OnboardingWizard from './OnboardingWizard'

export default function OnboardingDemo() {
  const [showWizard, setShowWizard] = useState(false)

  // Focus management voor toegankelijkheid
  useEffect(() => {
    if (showWizard) {
      // Focus op de eerste input van de wizard
      setTimeout(() => {
        const firstInput = document.querySelector('input, select, textarea')
        if (firstInput instanceof HTMLElement) {
          firstInput.focus()
        }
      }, 100)
    }
  }, [showWizard])

  if (showWizard) {
    return <OnboardingWizard />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Onboarding Wizard Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Test de Onboarding Wizard component. Deze wizard begeleidt nieuwe gebruikers door 4 stappen:
          </p>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
              <span>Profiel instellen</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
              <span>Organisatie informatie</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
              <span>Social media koppelen</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
              <span>Voorkeuren instellen</span>
            </div>
          </div>
          
          <Button
            onClick={() => setShowWizard(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
            aria-label="Start de onboarding wizard"
          >
            Start Onboarding Wizard
          </Button>
          
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Features:</p>
            <p>• Autosave elke 600ms</p>
            <p>• CSS animaties</p>
            <p>• Zod validatie</p>
            <p>• Responsief design</p>
            <p>• Toegankelijk (ARIA, focus)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
