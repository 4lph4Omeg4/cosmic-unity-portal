import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Building2, Globe, Users } from 'lucide-react'

export default function OrganizationStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const useCase = watch('organization.useCase')

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Over je organisatie
        </CardTitle>
        <p className="text-gray-600">
          Help ons je beter te begrijpen
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="orgName" className="text-sm font-medium text-gray-700">
            Organisatienaam
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="orgName"
              placeholder="Jouw bedrijf of organisatie"
              className={`pl-10 ${errors.organization?.orgName ? 'border-red-500' : ''}`}
              {...register('organization.orgName')}
            />
          </div>
          {errors.organization?.orgName && (
            <p className="text-sm text-red-500">
              {errors.organization.orgName.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            De naam van je bedrijf, team of organisatie (optioneel)
          </p>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website (optioneel)
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="website"
              placeholder="https://jouwwebsite.nl"
              className="pl-10"
              {...register('organization.website', {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Voer een geldige URL in (begint met http:// of https://)'
                }
              })}
            />
          </div>
          {errors.organization?.website && (
            <p className="text-sm text-red-500">
              {errors.organization.website.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Je website of portfolio link
          </p>
        </div>

        {/* Use Case */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Hoe ga je Timeline Alchemy gebruiken?
          </Label>
          <RadioGroup 
            value={useCase} 
            onValueChange={(value) => setValue('organization.useCase', value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="Solo" id="solo" />
              <Label htmlFor="solo" className="flex items-center space-x-2 cursor-pointer">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Solo</span>
                <span className="text-sm text-gray-500">Ik werk alleen</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="Team" id="team" />
              <Label htmlFor="team" className="flex items-center space-x-2 cursor-pointer">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium">Team</span>
                <span className="text-sm text-gray-500">Ik werk in een team</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="Agency" id="agency" />
              <Label htmlFor="agency" className="flex items-center space-x-2 cursor-pointer">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Agency</span>
                <span className="text-sm text-gray-500">Ik werk voor een agency</span>
              </Label>
            </div>
          </RadioGroup>
          {errors.organization?.useCase && (
            <p className="text-sm text-red-500">
              Selecteer een gebruikscategorie
            </p>
          )}
          <p className="text-xs text-gray-500">
            Dit helpt ons je de juiste features te tonen
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
