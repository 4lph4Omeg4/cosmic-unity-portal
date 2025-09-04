import React, { useState, useEffect, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Check, Loader, SkipForward } from 'lucide-react'
import { loadDraft, saveDraft, finishOnboarding, OnboardingDraft } from '@/lib/onboardingStorage'

import ProfileStep from './steps/ProfileStep'
import OrganizationStep from './steps/OrganizationStep'
import SocialsStep from './steps/SocialsStep'
import SocialConnectionsStep from './steps/SocialConnectionsStep'
import PreferencesStep from './steps/PreferencesStep'

// Zod schema voor validatie
const onboardingSchema = z.object({
  profile: z.object({
    displayName: z.string().min(2, 'Weergavenaam moet minimaal 2 karakters zijn'),
    avatar: z.string().optional(),
    role: z.enum(['Creator', 'Client', 'Admin']).optional()
  }),
  organization: z.object({
    orgName: z.string(),
    website: z.string().url('Voer een geldige URL in').optional().or(z.literal('')),
    useCase: z.enum(['Solo', 'Team', 'Agency']).optional()
  }),
  socials: z.object({
    X: z.boolean().optional(),
    Facebook: z.boolean().optional(),
    Instagram: z.boolean().optional(),
    TikTok: z.boolean().optional(),
    YouTube: z.boolean().optional(),
    LinkedIn: z.boolean().optional()
  }),
  socialConnections: z.object({
    platforms: z.array(z.string()).default([])
  }).optional(),
  preferences: z.object({
    weeklyDigest: z.boolean().default(true),
    aiSuggestions: z.boolean().default(true),
    goals: z.string().max(240, 'Doelen mogen maximaal 240 karakters zijn').optional()
  })
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

const STEPS = [
  { id: 'profile', title: 'Profiel', component: ProfileStep },
  { id: 'organization', title: 'Organisatie', component: OrganizationStep },
  { id: 'socials', title: 'Social Media', component: SocialsStep },
  { id: 'socialConnections', title: 'Connect Accounts', component: SocialConnectionsStep },
  { id: 'preferences', title: 'Voorkeuren', component: PreferencesStep }
]

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      profile: { displayName: 'Gebruiker', avatar: '', role: undefined },
      organization: { orgName: 'Mijn Organisatie', website: '', useCase: undefined },
      socials: { X: false, Facebook: false, Instagram: false, TikTok: false, YouTube: false, LinkedIn: false },
      preferences: { weeklyDigest: true, aiSuggestions: true, goals: '' }
    }
  })

  const { handleSubmit, watch, reset } = methods

  // Load draft data on mount and check user-organization link
  useEffect(() => {
    const loadDraftData = async () => {
      try {
        // First check if user is linked to an organization
        if (user) {
          console.log('Checking user-organization link for user:', user.id);
          
          const { supabase } = await import('@/integrations/supabase/client');
          
          // Check if user has a profile with org_id
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('org_id')
            .eq('user_id', user.id)
            .single();

          console.log('Profile check result:', { profile, profileError });

          if (profileError || !profile?.org_id) {
            console.log('User not linked to organization, trying to find TLA organization...');
            
            // Try to find a TLA organization that needs onboarding
            const { data: orgs, error: orgsError } = await supabase
              .from('orgs')
              .select('id, name, tla_client, needs_onboarding')
              .eq('tla_client', true)
              .eq('needs_onboarding', true)
              .order('created_at', { ascending: false })
              .limit(1);

            if (orgsError) {
              console.error('Error finding TLA organizations:', orgsError);
            } else if (orgs && orgs.length > 0) {
              const org = orgs[0];
              console.log('Found TLA organization:', org);
              
              // Link user to this organization
              if (!profile) {
                // Create profile if it doesn't exist
                const { error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    user_id: user.id,
                    org_id: org.id,
                    display_name: user.email?.split('@')[0] || 'User',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });

                if (createError) {
                  console.error('Error creating profile:', createError);
                } else {
                  console.log('✅ Profile created and linked to organization:', org.id);
                }
              } else {
                // Update existing profile
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ org_id: org.id })
                  .eq('user_id', user.id);

                if (updateError) {
                  console.error('Error updating profile:', updateError);
                } else {
                  console.log('✅ Profile updated and linked to organization:', org.id);
                }
              }
            } else {
              console.log('No TLA organizations found that need onboarding');
            }
          } else {
            console.log('✅ User already linked to organization:', profile.org_id);
          }
        }

        // Then load draft data
        const draft = await loadDraft()
        if (draft && Object.keys(draft).length > 0) {
          reset(draft as OnboardingFormData)
          toast({
            title: "Draft geladen",
            description: "Je vorige voortgang is hersteld",
            duration: 3000
          })
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
    loadDraftData()
  }, [reset, toast, user])

  // Debounced autosave
  const debouncedSave = useCallback(
    debounce(async (data: OnboardingFormData) => {
      try {
        setIsSaving(true)
        await saveDraft(data)
        console.log('Draft opgeslagen:', data)
      } catch (error) {
        console.error('Error saving draft:', error)
        toast({
          title: "Opslaan mislukt",
          description: "Je gegevens worden lokaal opgeslagen",
          variant: "destructive",
          duration: 3000
        })
      } finally {
        setIsSaving(false)
      }
    }, 600),
    [toast]
  )

  // Watch form data for autosave
  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSave(data as OnboardingFormData)
    })
    return () => subscription.unsubscribe()
  }, [watch, debouncedSave])

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(stepIndex)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }

  const skipStep = () => {
    goToNextStep()
  }

  const onSubmit = async (data: OnboardingFormData) => {
    if (currentStep === STEPS.length - 1) {
      // Final step - finish onboarding
      try {
        setIsLoading(true)
        await finishOnboarding(data)
        toast({
          title: "Welkom bij Timeline Alchemy! 🎉",
          description: "Je onboarding is voltooid. Je wordt doorgestuurd naar je dashboard.",
          duration: 5000
        })
        setTimeout(() => {
          navigate('/timeline-alchemy/client/my-previews')
        }, 2000)
      } catch (error) {
        console.error('Error finishing onboarding:', error)
        toast({
          title: "Er is iets misgegaan",
          description: "Probeer het opnieuw of neem contact op met support",
          variant: "destructive",
          duration: 5000
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      // Go to next step
      goToNextStep()
    }
  }

  const CurrentStepComponent = STEPS[currentStep].component
  const progress = ((currentStep + 1) / STEPS.length) * 100
  const isLastStep = currentStep === STEPS.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welkom bij Timeline Alchemy
          </h1>
          <p className="text-lg text-gray-300">
            Laten we je profiel instellen in {STEPS.length} eenvoudige stappen
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <span>Stap {currentStep + 1} van {STEPS.length}</span>
            <span>{Math.round(progress)}% voltooid</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {STEPS.map((step, index) => (
              <span
                key={step.id}
                className={`${
                  index <= currentStep ? 'text-blue-400 font-medium' : ''
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div 
              className={`mb-8 transition-all duration-300 ease-in-out ${
                isTransitioning 
                  ? 'opacity-0 transform translate-x-4' 
                  : 'opacity-100 transform translate-x-0'
              }`}
            >
              <CurrentStepComponent />
            </div>

            {/* Navigation */}
            <Card className="max-w-xl mx-auto bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                        className="flex items-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Vorige</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {!isLastStep && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={skipStep}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <SkipForward className="w-4 h-4 mr-2" />
                        Overslaan
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={isLoading || isSaving || isTransitioning}
                      className="flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : isLastStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      <span>
                        {isLoading ? 'Bezig...' : isLastStep ? 'Afronden' : 'Volgende'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Save indicator */}
                {isSaving && (
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Opslaan...
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
