import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Bell, Sparkles, Target } from 'lucide-react'

export default function PreferencesStep() {
  const { watch, setValue, formState: { errors } } = useFormContext()
  const weeklyDigest = watch('preferences.weeklyDigest') ?? true
  const aiSuggestions = watch('preferences.aiSuggestions') ?? true
  const goals = watch('preferences.goals') || ''

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Je voorkeuren instellen
        </CardTitle>
        <p className="text-gray-600">
          Personaliseer je Timeline Alchemy ervaring
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Digest Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <Label htmlFor="weeklyDigest" className="text-sm font-medium text-gray-900">
                Wekelijkse samenvatting
              </Label>
              <p className="text-xs text-gray-500">
                Ontvang elke week een overzicht van je activiteiten
              </p>
            </div>
          </div>
          <Switch
            id="weeklyDigest"
            checked={weeklyDigest}
            onCheckedChange={(checked) => setValue('preferences.weeklyDigest', checked)}
          />
        </div>

        {/* AI Suggestions Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div>
              <Label htmlFor="aiSuggestions" className="text-sm font-medium text-gray-900">
                AI suggesties
              </Label>
              <p className="text-xs text-gray-500">
                Krijg slimme suggesties voor je content en planning
              </p>
            </div>
          </div>
          <Switch
            id="aiSuggestions"
            checked={aiSuggestions}
            onCheckedChange={(checked) => setValue('preferences.aiSuggestions', checked)}
          />
        </div>

        {/* Goals Textarea */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <Label htmlFor="goals" className="text-sm font-medium text-gray-700">
              Wat zijn je doelen?
            </Label>
          </div>
          <Textarea
            id="goals"
            placeholder="Bijvoorbeeld: Ik wil meer content maken, mijn team beter laten samenwerken, of mijn projecten efficiënter beheren..."
            value={goals}
            onChange={(e) => setValue('preferences.goals', e.target.value)}
            className={`min-h-[100px] ${errors.preferences?.goals ? 'border-red-500' : ''}`}
            maxLength={240}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Vertel ons wat je wilt bereiken met Timeline Alchemy
            </p>
            <span className={`text-xs ${goals.length > 200 ? 'text-orange-600' : 'text-gray-400'}`}>
              {goals.length}/240
            </span>
          </div>
          {errors.preferences?.goals && (
            <p className="text-sm text-red-500">
              {errors.preferences.goals.message}
            </p>
          )}
        </div>

        {/* Final Note */}
        <div className="text-center pt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            🎉 Je bent bijna klaar! Na het afronden kun je direct beginnen met Timeline Alchemy.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
