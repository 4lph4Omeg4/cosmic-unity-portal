import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CommunityMembersList from '@/components/CommunityMembersList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, Save, MessageCircle, Instagram, Twitter, Linkedin, Youtube, Facebook } from 'lucide-react';
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
  role?: 'admin' | 'client' | 'user';
  social_links?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
  };
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

      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user?.id);
      if (updateError) throw updateError;

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
          bio: localProfile?.bio,
          social_links: localProfile?.social_links || {}
        })
        .eq('user_id', user?.id);
      if (error) throw error;

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
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="font-cosmic text-4xl md:text-5xl font-bold mb-4">
              <span className="text-cosmic-gradient">Cosmisch</span>{' '}
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

              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="font-mystical">Weergavenaam</Label>
                  <Input
                    id="displayName"
                    value={localProfile?.display_name || ''}
                    onChange={(e) =>
                      setLocalProfile(prev => prev ? { ...prev, display_name: e.target.value } : null)
                    }
                    className="font-mystical"
                    placeholder="Je kosmische naam..."
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="font-mystical">Bio</Label>
                  <Textarea
                    id="bio"
                    value={localProfile?.bio || ''}
                    onChange={(e) =>
                      setLocalProfile(prev => prev ? { ...prev, bio: e.target.value } : null)
                    }
                    className="font-mystical"
                    placeholder="Vertel over je spirituele reis..."
                  />
                </div>
              </div>

              {/* Social Media Links Section */}
              <div className="space-y-4">
                <Label className="font-mystical text-base">Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="font-mystical text-sm flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={localProfile?.social_links?.instagram || ''}
                      onChange={(e) =>
                        setLocalProfile(prev =>
                          prev
                            ? { ...prev, social_links: { ...prev.social_links, instagram: e.target.value } }
                            : null
                        )
                      }
                      className="font-mystical"
                      placeholder="https://instagram.com/jouwgebruikersnaam"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter" className="font-mystical text-sm flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      Twitter/X
                    </Label>
                    <Input
                      id="twitter"
                      value={localProfile?.social_links?.twitter || ''}
                      onChange={(e) =>
                        setLocalProfile(prev =>
                          prev
                            ? { ...prev, social_links: { ...prev.social_links, twitter: e.target.value } }
                            : null
                        )
                      }
                      className="font-mystical"
                      placeholder="https://twitter.com/jouwgebruikersnaam"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="font-mystical text-sm flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={localProfile?.social_links?.linkedin || ''}
                      onChange={(e) =>
                        setLocalProfile(prev =>
                          prev
                            ? { ...prev, social_links: { ...prev.social_links, linkedin: e.target.value } }
                            : null
                        )
                      }
                      className="font-mystical"
                      placeholder="https://linkedin.com/in/jouwprofiel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtube" className="font-mystical text-sm flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={localProfile?.social_links?.youtube || ''}
                      onChange={(e) =>
                        setLocalProfile(prev =>
                          prev
                            ? { ...prev, social_links: { ...prev.social_links, youtube: e.target.value } }
                            : null
                        )
                      }
                      className="font-mystical"
                      placeholder="https://youtube.com/@jouwkanaal"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tiktok" className="font-mystical text-sm flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 2.895-2.895c.183 0 .363.018.535.052V11.19a6.329 6.329 0 0 0-.535-.024 6.335 6.335 0 0 0-6.336 6.336A6.335 6.335 0 0 0 10.069 24a6.335 6.335 0 0 0 6.336-6.336V8.031a8.188 8.188 0 0 0 4.759 1.544V6.686h-.575Z"/>
                      </svg>
                      TikTok
                    </Label>
                    <Input
                      id="tiktok"
                      value={localProfile?.social_links?.tiktok || ''}
                      onChange={(e) =>
                        setLocalProfile(prev =>
                          prev
                            ? { ...prev, social_links: { ...prev.social_links, tiktok: e.target.value } }
                            : null
                        )
                      }
                      className="font-mystical"
                      placeholder="https://tiktok.com/@jouwgebruikersnaam"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook" className="font-mystical text-sm flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={localProfile?.social_links?.facebook || ''}
                      onChange={(e) =>
                        setLocalProfile(prev =>
                          prev
                            ? { ...prev, social_links: { ...prev.social_links, facebook: e.target.value } }
                            : null
                        )
                      }
                      className="font-mystical"
                      placeholder="https://facebook.com/jouwprofiel"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links Preview */}
              {localProfile?.social_links && Object.values(localProfile.social_links).some(link => link) && (
                <div className="space-y-2">
                  <Label className="font-mystical text-sm">Preview van je sociale links:</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                    {localProfile.social_links.instagram && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-pink-500">
                        <a href={localProfile.social_links.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {localProfile.social_links.twitter && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-400">
                        <a href={localProfile.social_links.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {localProfile.social_links.linkedin && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-600">
                        <a href={localProfile.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {localProfile.social_links.youtube && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-red-500">
                        <a href={localProfile.social_links.youtube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {localProfile.social_links.tiktok && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-foreground">
                        <a href={localProfile.social_links.tiktok} target="_blank" rel="noopener noreferrer">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 2.895-2.895c.183 0 .363.018.535.052V11.19a6.329 6.329 0 0 0-.535-.024 6.335 6.335 0 0 0-6.336 6.336A6.335 6.335 0 0 0 10.069 24a6.335 6.335 0 0 0 6.336-6.336V8.031a8.188 8.188 0 0 0 4.759 1.544V6.686h-.575Z"/>
                          </svg>
                        </a>
                      </Button>
                    )}
                    {localProfile.social_links.facebook && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-500">
                        <a href={localProfile.social_links.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

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

          {/* Community Members Section */}
          <div className="mt-8">
            <CommunityMembersList
              title={t('profile.communityMembers')}
              maxMembers={10}
              onMessageClick={(memberId) => navigate(`/messages/${memberId}`)}
            />
          </div>

          <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic mt-8">
            <CardHeader>
              <CardTitle className="font-cosmic text-cosmic-gradient">{t('profile.quickActions')}</CardTitle>
              <CardDescription className="font-mystical">
                {t('profile.quickActionsDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/messages')} variant="cosmic" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                {t('profile.viewMessages')}
              </Button>

              <Button onClick={() => navigate('/community')} variant="mystical" className="gap-2">
                <User className="w-4 h-4" />
                {t('profile.community')}
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
