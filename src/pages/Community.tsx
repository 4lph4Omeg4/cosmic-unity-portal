import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Heart, MessageCircle, Plus, Send, Users, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

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
  likes: { id: string }[];
  comments: { id: string; content: string; profiles: Profile; created_at: string }[];
}

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showNewPost, setShowNewPost] = useState(false);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadPosts();
    setupRealtimeSubscription();
  }, [user, navigate]);

  const loadPosts = async () => {
    try {
      console.log('=== LOADING COMMUNITY POSTS ===');
      console.log('Current user:', user?.id);
      
      // First get posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, content, created_at, user_id')
        .order('created_at', { ascending: false });

      console.log('Posts query result:', { postsData, postsError });

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        console.log('No posts found');
        setPosts([]);
        return;
      }

      console.log('Found posts:', postsData.length);

      // Get unique user IDs from posts
      const userIds = [...new Set(postsData.map(post => post.user_id))];

      // Get corresponding profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      console.log('Profiles query result:', { profilesData, profilesError });

      if (profilesError) throw profilesError;

      // Get likes and comments for each post
      const postIds = postsData.map(post => post.id);
      
      const [likesResult, commentsResult] = await Promise.all([
        supabase.from('likes').select('post_id, user_id').in('post_id', postIds),
        supabase.from('comments').select('id, post_id, user_id, content, created_at').in('post_id', postIds).order('created_at', { ascending: true })
      ]);

      if (likesResult.error) throw likesResult.error;
      if (commentsResult.error) throw commentsResult.error;

      // Combine posts with their profile data, likes, and comments
      const postsWithData = postsData.map(post => {
        const profile = profilesData?.find(profile => profile.user_id === post.user_id) || {
          display_name: 'Unknown User',
          avatar_url: null
        };

        const postLikes = likesResult.data?.filter(like => like.post_id === post.id) || [];
        const postComments = commentsResult.data?.filter(comment => comment.post_id === post.id) || [];

        return {
          ...post,
          profiles: profile,
          likes: postLikes,
          comments: postComments.map(comment => {
            const commentProfile = profilesData?.find(profile => profile.user_id === comment.user_id) || {
              display_name: 'Unknown User',
              avatar_url: null
            };
            return {
              ...comment,
              profiles: commentProfile
            };
          })
        };
      });

      console.log('Final posts with data:', postsWithData);
      setPosts(postsWithData as any);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: t('community.errorLoading'),
        description: t('community.errorLoadingMessage'),
        variant: "destructive",
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('community-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        loadPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createPost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      console.log('Creating post:', newPost);
      console.log('User ID:', user?.id);
      
      const { error } = await supabase
        .from('posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          user_id: user.id
        });

      console.log('Create post result:', { error });

      if (error) throw error;

      setNewPost({ title: '', content: '' });
      setShowNewPost(false);
      toast({
        title: t('community.postCreated'),
        description: t('community.postShared'),
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: t('community.errorCreating'),
        description: t('community.errorPostMessage'),
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      const isLiked = post?.likes.some(like => like.id === user.id);

      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!user || !newComment[postId]?.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content: newComment[postId],
          user_id: user.id
        });

      if (error) throw error;

      setNewComment({ ...newComment, [postId]: '' });
      toast({
        title: t('community.commentAdded'),
        description: t('community.commentPlaced'),
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: t('community.errorComment'),
        description: t('community.errorCommentMessage'),
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('community.postDeleted'),
        description: t('community.postDeletedMessage'),
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: t('community.errorDeleting'),
        description: t('community.errorDeleteMessage'),
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
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
              <div className="animate-cosmic-pulse">{t('common.loadingCommunity')}</div>
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
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">{t('community.title.cosmic')}</span>{' '}
              <span className="text-mystical-gradient">{t('community.title.community')}</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('community.subtitle')}
            </p>

            {!showNewPost && (
              <Button 
                onClick={() => setShowNewPost(true)}
                variant="mystical"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('community.newPost')}
              </Button>
            )}
          </div>

          {/* New Post Form */}
          {showNewPost && (
            <Card className="cosmic-hover bg-card/90 backdrop-blur-sm border-border/50 shadow-cosmic mb-8">
              <CardHeader>
                <CardTitle className="font-cosmic text-cosmic-gradient">
                  {t('community.shareInsight')}
                </CardTitle>
                <CardDescription className="font-mystical">
                  {t('community.inspire')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={t('community.postTitle')}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <Textarea
                  placeholder={t('community.postContent')}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button onClick={createPost} variant="mystical">
                    <Send className="w-4 h-4 mr-2" />
                    {t('community.publish')}
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowNewPost(false);
                      setNewPost({ title: '', content: '' });
                    }}
                    variant="outline"
                  >
                    {t('community.cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-4">
                    {t('community.noPosts')}
                  </h3>
                  <p className="font-mystical text-muted-foreground mb-6">
                    {t('community.firstPostMessage')}
                  </p>
                  <Button onClick={() => setShowNewPost(true)} variant="mystical">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('community.createFirstPost')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.profiles.avatar_url} />
                        <AvatarFallback className="bg-cosmic-gradient text-white">
                          {post.profiles.display_name?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-mystical font-semibold">{post.profiles.display_name}</h3>
                          <Badge variant="cosmic" className="text-xs">Chosen One</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                      </div>
                      {post.profiles.user_id === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePost(post.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h2 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">
                      {post.title}
                    </h2>
                    <p className="font-mystical text-muted-foreground mb-6 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    
                    {/* Post Actions */}
                    <div className="flex items-center gap-4 mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className="gap-2"
                      >
                        <Heart className={`w-4 h-4 ${post.likes.length > 0 ? 'fill-cosmic text-cosmic' : ''}`} />
                        {post.likes.length}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length}
                      </Button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 p-3 bg-background/50 rounded-lg">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.profiles.avatar_url} />
                              <AvatarFallback className="bg-cosmic-gradient text-white text-xs">
                                {comment.profiles.display_name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mystical text-sm font-semibold">
                                  {comment.profiles.display_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <p className="font-mystical text-sm text-muted-foreground">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('community.addComment')}
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                      />
                      <Button 
                        onClick={() => addComment(post.id)}
                        variant="mystical"
                        size="icon"
                        disabled={!newComment[post.id]?.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
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

export default Community;