import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'

export default function ProfileStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const avatar = watch('profile.avatar')
  const displayName = watch('profile.displayName')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setValue('profile.avatar', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="w-full max-w-xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Maak je profiel compleet
        </CardTitle>
        <p className="text-gray-300">
          Vertel ons wie je bent en wat je doet
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt="Profile avatar" />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                {displayName ? getInitials(displayName) : 'U'}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Klik op de camera om een foto toe te voegen
          </p>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
            Weergavenaam
          </Label>
          <Input
            id="displayName"
            placeholder="Jouw naam"
            {...register('profile.displayName', { 
              minLength: { value: 2, message: 'Minimaal 2 karakters' }
            })}
            className={errors.profile?.displayName ? 'border-red-500' : ''}
          />
          {errors.profile?.displayName && (
            <p className="text-sm text-red-500">
              {errors.profile.displayName.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Dit is hoe je naam wordt weergegeven in de app (optioneel)
          </p>
        </div>

        {/* Role Selection - Only Client for new users */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-gray-700">
            Wat ben je?
          </Label>
          <Select onValueChange={(value) => setValue('profile.role', value)} defaultValue="Client">
            <SelectTrigger>
              <SelectValue placeholder="Selecteer je rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Client">Client</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Nieuwe gebruikers zijn standaard clients
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
