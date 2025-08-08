import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, UserCheck, UserX, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  friend_profile: {
    user_id: string;
    display_name: string;
    avatar_url?: string;
    bio?: string;
  };
}

interface FriendsListProps {
  userId?: string; // If provided, show friends of this user (for viewing others' profiles)
  showActions?: boolean; // Whether to show add/remove friend actions
  onMessageClick?: (friendId: string) => void; // Callback for message button
}

const FriendsList: React.FC<FriendsListProps> = ({ 
  userId, 
  showActions = true, 
  onMessageClick 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Determine whose friends to show
  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadFriends();
      setupRealtimeSubscription();
    }
  }, [targetUserId]);

  const loadFriends = async () => {
    try {
      setLoading(true);

      // Get friends where the target user is either user_id or friend_id and status is accepted
      const { data: friendsData, error } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .or(`user_id.eq.${targetUserId},friend_id.eq.${targetUserId}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!friendsData || friendsData.length === 0) {
        setFriends([]);
        return;
      }

      // Get the friend user IDs (the ones that are not the target user)
      const friendIds = friendsData.map(friendship => 
        friendship.user_id === targetUserId ? friendship.friend_id : friendship.user_id
      );

      // Get profiles for all friends
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, bio')
        .in('user_id', friendIds);

      if (profilesError) throw profilesError;

      // Combine friends data with profiles
      const friendsWithProfiles = friendsData.map(friendship => {
        const friendId = friendship.user_id === targetUserId ? friendship.friend_id : friendship.user_id;
        const profile = profilesData?.find(profile => profile.user_id === friendId);
        
        return {
          ...friendship,
          friend_profile: profile || {
            user_id: friendId,
            display_name: 'Unknown User',
            avatar_url: null,
            bio: null
          }
        };
      });

      setFriends(friendsWithProfiles);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: "Error loading friends",
        description: "Could not load the friends list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('friends-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'friends',
        filter: `user_id=eq.${targetUserId}` 
      }, () => {
        loadFriends();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'friends',
        filter: `friend_id=eq.${targetUserId}` 
      }, () => {
        loadFriends();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const removeFriend = async (friendshipId: string, friendId: string) => {
    if (!user) return;

    try {
      setActionLoading(friendshipId);

      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Friend removed",
        description: "The friend has been removed from your list.",
      });

      loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error removing friend",
        description: "Could not remove the friend.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMessageClick = (friendId: string) => {
    if (onMessageClick) {
      onMessageClick(friendId);
    } else {
      // Default behavior: navigate to a messages page (to be implemented)
      navigate(`/messages/${friendId}`);
    }
  };

  if (loading) {
    return (
      <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cosmic" />
            <CardTitle className="font-cosmic text-cosmic-gradient">
              Friends
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-cosmic-pulse">Loading friends...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cosmic" />
            <CardTitle className="font-cosmic text-cosmic-gradient">
              {isOwnProfile ? 'My Friends' : 'Friends'}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {friends.length}
            </Badge>
          </div>
        </div>
        <CardDescription className="font-mystical">
          {isOwnProfile 
            ? "Your cosmic connections in the community" 
            : "Shared connections in the cosmic community"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-cosmic animate-cosmic-pulse">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-cosmic text-lg font-bold text-cosmic-gradient mb-2">
              No friends yet
            </h3>
            <p className="font-mystical text-muted-foreground text-sm">
              {isOwnProfile 
                ? "Start connecting with other cosmic travelers in the community!" 
                : "This user hasn't connected with anyone yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="w-10 h-10 cursor-pointer" 
                    onClick={() => navigate(`/user/${friend.friend_profile.user_id}`)}
                  >
                    <AvatarImage src={friend.friend_profile.avatar_url} />
                    <AvatarFallback className="bg-cosmic-gradient text-white text-sm">
                      {friend.friend_profile.display_name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <button
                      onClick={() => navigate(`/user/${friend.friend_profile.user_id}`)}
                      className="font-mystical font-semibold hover:text-cosmic transition-colors text-left"
                    >
                      {friend.friend_profile.display_name}
                    </button>
                    {friend.friend_profile.bio && (
                      <p className="text-xs text-muted-foreground truncate max-w-48">
                        {friend.friend_profile.bio}
                      </p>
                    )}
                  </div>
                </div>

                {showActions && isOwnProfile && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessageClick(friend.friend_profile.user_id)}
                      className="gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFriend(friend.id, friend.friend_profile.user_id)}
                      disabled={actionLoading === friend.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;
