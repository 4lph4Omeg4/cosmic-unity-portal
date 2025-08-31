import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export default function OnboardingTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Onboarding Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Test de verschillende onboarding routes en functionaliteiten
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Production Onboarding */}
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Sparkles className="w-5 h-5" />
                Production Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                De echte onboarding wizard voor nieuwe gebruikers. 
                Volledig functioneel met alle features.
              </p>
              <Link to="/onboarding">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start Production Wizard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Demo Onboarding */}
          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Play className="w-5 h-5" />
                Demo Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Demo versie voor development en testing. 
                Bevat extra informatie en test opties.
              </p>
              <Link to="/onboarding/demo">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo Wizard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/timeline-alchemy">
                <Button variant="outline" className="w-full">
                  ← Terug naar Timeline Alchemy
                </Button>
              </Link>
              <Link to="/timeline-alchemy/admin/dashboard">
                <Button variant="outline" className="w-full">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Onboarding Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="p-4 bg-white/50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">4 Stappen Wizard</h3>
              <p>Profiel, Organisatie, Social Media, Voorkeuren</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Autosave</h3>
              <p>Data wordt elke 600ms opgeslagen</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Responsief Design</h3>
              <p>Werkt op alle schermformaten</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
