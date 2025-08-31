import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Users, ArrowRight, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface WelcomeSuccessProps {
  username?: string
  onGoToDashboard?: () => void
  onSetupProfile?: () => void
  onInviteTeam?: () => void
}

export default function WelcomeSuccess({
  username = 'Gebruiker',
  onGoToDashboard,
  onSetupProfile,
  onInviteTeam
}: WelcomeSuccessProps) {
  const navigate = useNavigate()

  const handleGoToDashboard = () => {
    if (onGoToDashboard) {
      onGoToDashboard()
    } else {
      navigate('/dashboard')
    }
  }

  const handleSetupProfile = () => {
    if (onSetupProfile) {
      onSetupProfile()
    } else {
      navigate('/profile/setup')
    }
  }

  const handleInviteTeam = () => {
    if (onInviteTeam) {
      onInviteTeam()
    } else {
      // Placeholder voor toekomstige invite-functie
      console.log('Team uitnodigen functionaliteit komt binnenkort!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoratieve elementen */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      
      <div className="w-full max-w-2xl mx-auto relative z-10">
        {/* Hoofdinhoud */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Succes Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welkom bij Timeline Alchemy,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {username}!
              </span>
            </h1>

            {/* Subtekst */}
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              Gefeliciteerd! Je bent succesvol aangemeld bij Timeline Alchemy. 
              Je account is klaar en je kunt nu beginnen met het verkennen van alle mogelijkheden.
            </p>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Account setup</span>
                <span>1 van 3 voltooid</span>
              </div>
              <Progress value={33} className="h-2" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>✓ Aangemeld</span>
                <span>Profiel instellen</span>
                <span>Dashboard verkennen</span>
              </div>
            </div>

            {/* Hoofdknoppen */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Ga naar je dashboard
              </Button>
              
              <Button
                onClick={handleSetupProfile}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 text-lg font-semibold transition-all duration-200"
              >
                <Settings className="w-5 h-5 mr-2" />
                Profiel instellen
              </Button>
            </div>

            {/* Team uitnodigen sectie */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Nog geen team?</span>
              </div>
              <Button
                onClick={handleInviteTeam}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
              >
                Teamleden uitnodigen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
