import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Settings, Calendar, BarChart3, Users, Building } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  needs_onboarding: boolean;
  onboarding_completed: boolean;
}

interface Profile {
  user_id: string;
  display_name: string;
  org_id: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          toast({
            title: "Profiel niet gevonden",
            description: "Er is een probleem met je profiel. Neem contact op met support.",
            variant: "destructive",
          });
          return;
        }

        setProfile(profileData);

        // Get organization data
        if (profileData.org_id) {
          const { data: orgData, error: orgError } = await supabase
            .from('orgs')
            .select('*')
            .eq('id', profileData.org_id)
            .single();

          if (orgError) {
            console.error('Error loading organization:', orgError);
          } else {
            setOrganization(orgData);
          }
        }

        // Check if onboarding is completed
        if (profileData.org_id) {
          const { data: orgData } = await supabase
            .from('orgs')
            .select('needs_onboarding, onboarding_completed')
            .eq('id', profileData.org_id)
            .single();

          if (orgData?.needs_onboarding && !orgData?.onboarding_completed) {
            toast({
              title: "Onboarding nog niet voltooid",
              description: "Voltooi eerst je onboarding om toegang te krijgen tot alle functies.",
              variant: "destructive",
            });
            navigate('/onboarding');
            return;
          }
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast({
          title: "Er is iets misgegaan",
          description: "Er is een probleem opgetreden bij het laden van je dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Dashboard laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welkom terug, {profile?.display_name || 'Gebruiker'}! 👋
              </h1>
              <p className="text-lg text-gray-300">
                {organization?.name ? `Organisatie: ${organization.name}` : 'Timeline Alchemy Dashboard'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
                ✅ Actief abonnement
              </Badge>
              <Button variant="outline" size="sm" className="bg-transparent border-white/50 text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Instellingen
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Timeline Posts</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Geplande Posts</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Team Leden</p>
                  <p className="text-2xl font-bold text-white">1</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Organisatie</p>
                  <p className="text-2xl font-bold text-white">1</p>
                </div>
                <Building className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Alchemy Features */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Timeline Alchemy Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 flex flex-col items-center justify-center"
                    onClick={() => toast({
                      title: "Coming Soon! 🚀",
                      description: "Timeline creation feature wordt binnenkort gelanceerd.",
                    })}
                  >
                    <Calendar className="w-6 h-6 mb-2" />
                    <span>Timeline Creator</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-20 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 flex flex-col items-center justify-center"
                    onClick={() => toast({
                      title: "Coming Soon! 🚀",
                      description: "AI-powered content suggestions worden binnenkort gelanceerd.",
                    })}
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span>AI Insights</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-20 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 flex flex-col items-center justify-center"
                    onClick={() => toast({
                      title: "Coming Soon! 🚀",
                      description: "Team collaboration features worden binnenkort gelanceerd.",
                    })}
                  >
                    <Users className="w-6 h-6 mb-2" />
                    <span>Team Management</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-20 bg-gray-700 border-gray-600 text-white hover:bg-gray-600 flex flex-col items-center justify-center"
                    onClick={() => toast({
                      title: "Coming Soon! 🚀",
                      description: "Advanced analytics worden binnenkort gelanceerd.",
                    })}
                  >
                    <Settings className="w-6 h-6 mb-2" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Snelle Acties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => navigate('/timeline-alchemy')}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Terug naar Timeline Alchemy
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => navigate('/onboarding')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Onboarding bewerken
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => {
                    supabase.auth.signOut();
                    navigate('/');
                  }}
                >
                  Uitloggen
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Account Informatie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Naam:</span>
                  <span className="text-white">{profile?.display_name || 'Niet ingesteld'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Organisatie:</span>
                  <span className="text-white">{organization?.name || 'Niet ingesteld'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
