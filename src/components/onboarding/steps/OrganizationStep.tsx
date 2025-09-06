import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Building2, Users, CheckCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export default function OrganizationStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const { user } = useAuth()
  const useCase = watch('organization.useCase')
  const orgName = watch('organization.orgName')

  // Load existing organization data
  useEffect(() => {
    const loadOrganizationData = async () => {
      if (!user) return;

      try {
        // Get user's organization data from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_name, org_id')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Set the organization name from the profile
          if (profile.organization_name) {
            setValue('organization.orgName', profile.organization_name);
          }
        }
      } catch (error) {
        console.error('Error loading organization data:', error);
      }
    };

    loadOrganizationData();
  }, [user, setValue]);

  return (
    <Card className="w-full max-w-xl mx-auto bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Je organisatie
        </CardTitle>
        <p className="text-gray-300">
          Je organisatie informatie is al ingesteld
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Name - Always show as read-only */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Organisatienaam
          </Label>
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{orgName || 'Organisatie wordt geladen...'}</span>
            <span className="text-green-600 text-sm">(ingesteld bij betaling)</span>
          </div>
          <p className="text-xs text-gray-500">
            Je organisatienaam is automatisch ingesteld op basis van je betaling
          </p>
        </div>


        {/* Use Case - Main focus */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Label className="text-lg font-semibold text-gray-800">
            Hoe ga je Timeline Alchemy gebruiken?
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Dit helpt ons je de juiste features en instellingen te tonen
          </p>
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
        </div>
      </CardContent>
    </Card>
  )
}
