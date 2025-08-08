import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CommunityMembersList from '@/components/CommunityMembersList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, Save, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (profile) {
      setLocalProfile(profile);
      setLoading(false);
    }
  }, [user, profile, navigate]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Je moet een bestand selecteren om te uploaden.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      // Refresh the profile data to update the navigation
      refreshProfile();
      
      setLocalProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);
      
      toast({
        title: "Avatar geüpload",
        description: "Je profielfoto is succesvol bijgewerkt.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload fout",
        description: error instanceof Error ? error.message : "Avatar kon niet worden geüpload.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: localProfile?.display_name,
          bio: localProfile?.bio
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      // Refresh the profile data to update the navigation
      refreshProfile();

      toast({
        title: "Profiel bijgewerkt",
        description: "Je profiel is succesvol opgeslagen.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update fout",
        description: "Profiel kon niet worden bijgewerkt.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">Profiel laden...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-5xl font-bold mb-4">
              <span className="text-cosmic-gradient">Kosmisch</span>{' '}
              <span className="text-mystical-gradient">Profiel</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground">
              Personaliseer je spirituele identiteit in onze community
            </p>
          </div>

          <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
            <CardHeader>
              <CardTitle className="font-cosmic text-cosmic-gradient">
                Profiel Informatie
              </CardTitle>
              <CardDescription className="font-mystical">
                Beheer je profiel en avatar voor de community
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-cosmic/20 shadow-cosmic">
                  <AvatarImage src={localProfile?.avatar_url} />
                  <AvatarFallback className="bg-cosmic-gradient text-white text-2xl">
                    {localProfile?.display_name?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={uploading} asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploaden...' : 'Avatar Uploaden'}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="font-mystical">
                    Weergavenaam
                  </Label>
                  <Input
                    id="displayName"
                    value={localProfile?.display_name || ''}
                    onChange={(e) => setLocalProfile(prev => 
                      prev ? { ...prev, display_name: e.target.value } : null
                    )}
                    className="font-mystical"
                    placeholder="Je kosmische naam..."
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="font-mystical">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={localProfile?.bio || ''}
                    onChange={(e) => setLocalProfile(prev => 
                      prev ? { ...prev, bio: e.target.value } : null
                    )}
                    className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md font-mystical"
                    placeholder="Vertel over je spirituele reis..."
                  />
                </div>
              </div>

              {/* Save Button */}
              <Button 
                onClick={updateProfile}
                disabled={saving}
                variant="cosmic"
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Opslaan...' : 'Profiel Opslaan'}
              </Button>
            </CardContent>
          </Card>

          {/* Friends Section */}
          <div className="mt-8">
            <FriendsList
              onMessageClick={(friendId) => navigate(`/messages/${friendId}`)}
            />
          </div>

          {/* Quick Actions */}
          <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic mt-8">
            <CardHeader>
              <CardTitle className="font-cosmic text-cosmic-gradient">
                Quick Actions
              </CardTitle>
              <CardDescription className="font-mystical">
                Navigate to other sections of your cosmic journey
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/messages')}
                variant="cosmic"
                className="gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                View Messages
              </Button>

              <Button
                onClick={() => navigate('/community')}
                variant="mystical"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
