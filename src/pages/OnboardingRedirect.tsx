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

        // Add user to the working account structure (like existing accounts)
        console.log('Setting up user with working account structure...');
        
        // 1. Add to org_members table (like existing accounts)
        const { error: orgMembersError } = await supabase
          .from('org_members')
          .insert({
            org_id: 'timeline-alchemy', // Use the main TLA org
            user_id: user.id,
            role: 'member' // New users get member role
          });

        if (orgMembersError) {
          console.error('Error adding to org_members:', orgMembersError);
          // Don't fail if user already exists
        } else {
          console.log('✅ User added to org_members');
        }

        // 2. Add to has_tla_access table
        const { error: tlaAccessError } = await supabase
          .from('has_tla_access')
          .insert({
            user_id: user.id
          });

        if (tlaAccessError) {
          console.error('Error adding to has_tla_access:', tlaAccessError);
          // Don't fail if user already exists
        } else {
          console.log('✅ User added to has_tla_access');
        }

        // 3. Add to tla_org_access table
        const { error: tlaOrgAccessError } = await supabase
          .from('tla_org_access')
          .insert({
            user_id: user.id,
            org_id: 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8' // The main TLA org ID
          });

        if (tlaOrgAccessError) {
          console.error('Error adding to tla_org_access:', tlaOrgAccessError);
          // Don't fail if user already exists
        } else {
          console.log('✅ User added to tla_org_access');
        }

        // 4. Add to client_users table (crucial for dashboard access)
        const { error: clientUsersError } = await supabase
          .from('client_users')
          .insert({
            client_id: '1c75c839-87a9-46ad-8fe7-5c4cfb68a1db', // The main client ID
            user_id: user.id
          });

        if (clientUsersError) {
          console.error('Error adding to client_users:', clientUsersError);
          // Don't fail if user already exists
        } else {
          console.log('✅ User added to client_users');
        }

        // 5. Update user profile with client_id (crucial for preview access)
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ 
            client_id: '1c75c839-87a9-46ad-8fe7-5c4cfb68a1db' // The main client ID
          })
          .eq('user_id', user.id);

        if (profileUpdateError) {
          console.error('Error updating profile with client_id:', profileUpdateError);
          // Don't fail if update fails
        } else {
          console.log('✅ Profile updated with client_id');
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
