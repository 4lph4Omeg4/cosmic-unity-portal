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

          // Check if user is part of this organization
          const { data: profile } = await supabase
            .from('profiles')
            .select('org_id')
            .eq('user_id', user.id)
            .single();

          if (profile?.org_id !== orgId) {
            // Update user's profile to link them to this organization
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ org_id: orgId })
              .eq('user_id', user.id);

            if (updateError) {
              console.error('Error updating user profile:', updateError);
            }
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
          }

          setIsValidRedirect(true);
          toast({
            title: "Welkom bij Timeline Alchemy! 🎉",
            description: "Laten we je profiel instellen om te beginnen.",
            duration: 5000,
          });
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
