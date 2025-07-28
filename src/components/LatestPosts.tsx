import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Plus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

const LatestPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLatestPosts();
    setupRealtimeSubscription();
  }, []);

  const loadLatestPosts = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          created_at,
          user_id,
          profiles!posts_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPosts(data as any || []);
    } catch (error) {
      console.error('Error loading latest posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('latest-posts-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadLatestPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="py-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-cosmic text-3xl md:text-4xl font-bold mb-4">
              <span className="text-cosmic-gradient">Laatste</span>{' '}
              <span className="text-mystical-gradient">Posts</span>
            </h2>
            <p className="font-mystical text-lg text-muted-foreground">
              Ontdek de nieuwste inzichten van onze community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
            <Users className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="font-cosmic text-3xl md:text-4xl font-bold mb-4">
            <span className="text-cosmic-gradient">Laatste</span>{' '}
            <span className="text-mystical-gradient">Posts</span>
          </h2>
          
          <p className="font-mystical text-lg text-muted-foreground mb-8">
            Ontdek de nieuwste inzichten van onze community
          </p>

          <div className="flex justify-center gap-4">
            <Link to="/community">
              <Button variant="mystical" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Bekijk Community
              </Button>
            </Link>
            {user && (
              <Link to="/community">
                <Button variant="outline" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Nieuwe Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {error ? (
          <div className="text-center">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic max-w-md mx-auto">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-cosmic text-xl font-bold text-destructive mb-4">
                  Error loading posts
                </h3>
                <p className="font-mystical text-muted-foreground mb-6">
                  {error}
                </p>
                <Button onClick={() => {
                  setError(null);
                  setLoading(true);
                  loadLatestPosts();
                }} variant="mystical">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic max-w-md mx-auto">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-4">
                  Nog geen posts
                </h3>
                <p className="font-mystical text-muted-foreground mb-6">
                  Wees de eerste om een post te plaatsen!
                </p>
                {user ? (
                  <Link to="/community">
                    <Button variant="mystical">
                      <Plus className="w-4 h-4 mr-2" />
                      Eerste Post Maken
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button variant="mystical">
                      Inloggen om te Posten
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.profiles.avatar_url} />
                      <AvatarFallback className="bg-cosmic-gradient text-white text-xs">
                        {post.profiles.display_name?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-mystical text-sm font-semibold">
                        {post.profiles.display_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                    <Badge variant="cosmic" className="text-xs ml-auto">
                      Cosmic
                    </Badge>
                  </div>
                  
                  <CardTitle className="font-cosmic text-lg font-bold text-cosmic-gradient group-hover:text-mystical-gradient transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="font-mystical text-muted-foreground mb-4 text-sm leading-relaxed">
                    {truncateContent(post.content)}
                  </p>
                  
                  <Link to={`/community#post-${post.id}`}>
                    <Button variant="ghost" size="sm" className="text-cosmic hover:text-mystical p-0 h-auto font-mystical">
                      Lees meer →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/community">
              <Button variant="outline" size="lg">
                Bekijk Alle Posts
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestPosts;
