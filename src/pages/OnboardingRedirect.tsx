import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { supabase } from '@/integrations/supabase/client';

const OnboardingRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isValidRedirect, setIsValidRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const session = searchParams.get('session');
        const orgId = searchParams.get('org_id');

        console.log('OnboardingRedirect - URL params:', { session, orgId });
        console.log('OnboardingRedirect - User:', user);

        // Wait for user to be loaded
        if (user === undefined) {
          console.log('User still loading, waiting...');
          return;
        }

        // Check if this is a valid Stripe success redirect
        if (session === 'success' && orgId) {
          // If user is not authenticated, redirect to auth with special parameters
          if (!user) {
            // Store the onboarding redirect info in sessionStorage for after login
            sessionStorage.setItem('pendingOnboarding', JSON.stringify({
              orgId,
              session: 'success',
              timestamp: Date.now()
            }));
            
            toast({
              title: "Account vereist",
              description: "Maak een account aan of log in om je Timeline Alchemy onboarding te voltooien.",
              duration: 5000,
            });
            
            // Redirect to auth with special onboarding flag
            navigate('/auth?onboarding=true&org_id=' + orgId);
            return;
          }

                  // Check if organization exists and needs onboarding
        console.log('Checking organization:', orgId);
        const { data: org, error: orgError } = await supabase
          .from('orgs')
          .select('*')
          .eq('id', orgId)
          .single();

        console.log('Organization check result:', { org, orgError });

        if (orgError || !org) {
          console.error('Organization not found:', orgError);
          toast({
            title: "Organisatie niet gevonden",
            description: "Er is een probleem met je abonnement. Neem contact op met support.",
            variant: "destructive",
          });
          navigate('/timeline-alchemy');
          return;
        }

        // Check if this is a TLA client organization
        if (!org.tla_client) {
          console.log('Not a TLA client organization, updating to TLA client...');
          
          // Update organization to be a TLA client
          const { error: updateTlaError } = await supabase
            .from('orgs')
            .update({ 
              tla_client: true,
              needs_onboarding: true,
              onboarding_completed: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', orgId);

          if (updateTlaError) {
            console.error('Error updating organization to TLA client:', updateTlaError);
            toast({
              title: "Organisatie update mislukt",
              description: "Er is een probleem opgetreden. Probeer het opnieuw.",
              variant: "destructive",
            });
            navigate('/timeline-alchemy');
            return;
          }
          
          console.log('✅ Organization updated to TLA client');
        }

        // Check if onboarding is already completed
        if (org.onboarding_completed) {
          console.log('Onboarding already completed, redirecting to dashboard');
          toast({
            title: "Welkom terug! 🎉",
            description: "Je onboarding is al voltooid. Je wordt doorgestuurd naar je dashboard.",
            duration: 3000,
          });
          navigate('/timeline-alchemy/client/my-previews');
          return;
        }

        // Check if user is part of this organization
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('user_id', user.id)
          .single();

        console.log('Profile check result:', { profile, profileError });

        if (profileError) {
          console.error('Error checking profile:', profileError);
          // Profile might not exist, try to create it
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              org_id: orgId,
              display_name: user.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
            toast({
              title: "Profiel aanmaken mislukt",
              description: "Er is een probleem opgetreden. Probeer het opnieuw.",
              variant: "destructive",
            });
            navigate('/timeline-alchemy');
            return;
          }
          console.log('✅ Profile created and linked to organization');
        } else if (profile?.org_id !== orgId) {
          // Update user's profile to link them to this organization
          console.log('Updating user profile to link to organization:', orgId);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ org_id: orgId })
            .eq('user_id', user.id);

          if (updateError) {
            console.error('Error updating user profile:', updateError);
            toast({
              title: "Profiel bijwerken mislukt",
              description: "Er is een probleem opgetreden. Probeer het opnieuw.",
              variant: "destructive",
            });
            navigate('/timeline-alchemy');
            return;
          }
          console.log('✅ Profile updated and linked to organization');
        } else {
          console.log('✅ User already linked to organization');
        }

        // Mark organization as needing onboarding
        const { error: onboardingError } = await supabase
          .from('orgs')
          .update({ 
            needs_onboarding: true,
            onboarding_completed: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', orgId);

        if (onboardingError) {
          console.error('Error updating onboarding status:', onboardingError);
        } else {
          console.log('✅ Organization marked as needing onboarding');
        }

          setIsValidRedirect(true);
          toast({
            title: "Welkom bij Timeline Alchemy! 🎉",
            description: "Je wordt doorgestuurd naar de onboarding wizard.",
            duration: 3000,
          });
          
          // Redirect to onboarding wizard after a short delay
          setTimeout(() => {
            navigate('/timeline-alchemy?onboarding=true');
          }, 2000);
        } else {
          // Not a valid redirect, go back to Timeline Alchemy
          navigate('/timeline-alchemy');
        }
      } catch (error) {
        console.error('Error checking redirect:', error);
        toast({
          title: "Er is iets misgegaan",
          description: "Er is een probleem opgetreden. Probeer het opnieuw.",
          variant: "destructive",
        });
        navigate('/timeline-alchemy');
      } finally {
        setLoading(false);
      }
    };

    checkRedirect();
  }, [searchParams, user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Bezig met laden...</p>
          <p className="text-sm text-gray-400 mt-2">Debug: {JSON.stringify({ user: !!user, loading, isValidRedirect })}</p>
        </div>
      </div>
    );
  }

  if (!isValidRedirect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Redirecting...</p>
          <p className="text-sm text-gray-400 mt-2">Debug: {JSON.stringify({ user: !!user, loading, isValidRedirect })}</p>
        </div>
      </div>
    );
  }

  return <OnboardingWizard />;
};

export default OnboardingRedirect;
