import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'

export default function ProfileStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const avatar = watch('profile.avatar')
  const displayName = watch('profile.displayName')

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Upload to Supabase Storage
        const { supabase } = await import('@/integrations/supabase/client')
        
        const fileExt = file.name.split('.').pop()
        const fileName = `avatars/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          console.error('Error uploading avatar:', error)
          // Fallback to base64
          const reader = new FileReader()
          reader.onload = (e) => {
            setValue('profile.avatar', e.target?.result as string)
          }
          reader.readAsDataURL(file)
          return
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
        
        setValue('profile.avatar', urlData.publicUrl)
      } catch (error) {
        console.error('Error in handleAvatarChange:', error)
        // Fallback to base64
        const reader = new FileReader()
        reader.onload = (e) => {
          setValue('profile.avatar', e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
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

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio (optioneel)
          </Label>
          <Textarea
            id="bio"
            placeholder="Vertel iets over jezelf..."
            {...register('profile.bio', { 
              maxLength: { value: 500, message: 'Bio mag maximaal 500 karakters zijn' }
            })}
            className={errors.profile?.bio ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.profile?.bio && (
            <p className="text-sm text-red-500">
              {errors.profile.bio.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Een korte beschrijving van jezelf (maximaal 500 karakters)
          </p>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website (optioneel)
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://jouwwebsite.com"
            {...register('profile.website', { 
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Voer een geldige URL in (begin met http:// of https://)'
              }
            })}
            className={errors.profile?.website ? 'border-red-500' : ''}
          />
          {errors.profile?.website && (
            <p className="text-sm text-red-500">
              {errors.profile.website.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Je persoonlijke of bedrijfswebsite
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
