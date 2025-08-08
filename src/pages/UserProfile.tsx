import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FriendButton from '@/components/FriendButton';
import FriendsList from '@/components/FriendsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, ArrowLeft, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes: { id: string }[];
  comments: { id: string }[];
}

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Get user's posts with likes and comments count
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id, 
          title, 
          content, 
          created_at,
          likes(id),
          comments(id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      setPosts(postsData || []);
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load the user profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPostDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">Loading profile...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Profile not found
              </h1>
              <Button onClick={() => navigate('/community')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              onClick={() => navigate('/community')} 
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </Button>
          </div>

          {/* Profile Header */}
          <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic mb-8">
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-32 h-32 border-4 border-cosmic/20 shadow-cosmic">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-cosmic-gradient text-white text-3xl">
                    {profile.display_name?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <h1 className="font-cosmic text-3xl font-bold text-cosmic-gradient">
                      {profile.display_name}
                    </h1>
                    <Badge variant="cosmic" className="w-fit">
                      Cosmic Traveler
                    </Badge>
                  </div>
                  
                  {profile.bio && (
                    <p className="font-mystical text-muted-foreground mb-4 whitespace-pre-wrap">
                      {profile.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Member since {formatDate(profile.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {posts.length} posts
                      </div>
                    </div>

                    {/* Friend Actions - only show if viewing someone else's profile */}
                    {user && userId && user.id !== userId && (
                      <div className="flex justify-center md:justify-start">
                        <FriendButton
                          userId={userId}
                          userName={profile.display_name}
                          userAvatar={profile.avatar_url}
                          size="default"
                          variant="cosmic"
                          showMessageButton={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Friends */}
          <div className="mb-8">
            <FriendsList
              userId={userId}
              showActions={false}
              onMessageClick={(friendId) => navigate(`/messages/${friendId}`)}
            />
          </div>

          {/* User's Posts */}
          <div className="space-y-6">
            <h2 className="font-cosmic text-2xl font-bold text-cosmic-gradient">
              Posts by {profile.display_name}
            </h2>
            
            {posts.length === 0 ? (
              <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-4">
                    No posts yet
                  </h3>
                  <p className="font-mystical text-muted-foreground">
                    This user hasn't shared any cosmic insights yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback className="bg-cosmic-gradient text-white">
                          {profile.display_name?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-mystical font-semibold">{profile.display_name}</h3>
                          <Badge variant="cosmic" className="text-xs">Cosmic Traveler</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatPostDate(post.created_at)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h2 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">
                      {post.title}
                    </h2>
                    <p className="font-mystical text-muted-foreground mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes.length} likes
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length} comments
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
