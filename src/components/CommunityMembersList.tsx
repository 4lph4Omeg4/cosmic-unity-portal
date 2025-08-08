import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MessageDialog from './MessageDialog';

interface CommunityMember {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

interface CommunityMembersListProps {
  title?: string;
  maxMembers?: number; // Limit number of members shown
  showActions?: boolean; // Whether to show message actions
  onMessageClick?: (memberId: string) => void; // Callback for message button
}

const CommunityMembersList: React.FC<CommunityMembersListProps> = ({ 
  title = "Community Members",
  maxMembers,
  showActions = true, 
  onMessageClick 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityMembers();
    setupRealtimeSubscription();
  }, []);

  const loadCommunityMembers = async () => {
    try {
      setLoading(true);

      // Get all profiles except the current user
      let query = supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, bio, created_at')
        .order('created_at', { ascending: false });

      // Exclude current user if logged in
      if (user) {
        query = query.neq('user_id', user.id);
      }

      // Limit results if specified
      if (maxMembers) {
        query = query.limit(maxMembers);
      }

      const { data: membersData, error } = await query;

      if (error) throw error;

      setMembers(membersData || []);
    } catch (error) {
      console.error('Error loading community members:', error);
      toast({
        title: "Error loading members",
        description: "Could not load the community members list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles'
      }, () => {
        loadCommunityMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleMessageClick = (memberId: string) => {
    if (onMessageClick) {
      onMessageClick(memberId);
    } else {
      // Default behavior: navigate to messages page
      navigate(`/messages/${memberId}`);
    }
  };

  if (loading) {
    return (
      <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cosmic" />
            <CardTitle className="font-cosmic text-cosmic-gradient">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-cosmic-pulse">Loading community members...</div>
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
              {title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {members.length}
            </Badge>
          </div>
        </div>
        <CardDescription className="font-mystical">
          Connect with cosmic travelers in our open community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-cosmic animate-cosmic-pulse">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-cosmic text-lg font-bold text-cosmic-gradient mb-2">
              No other members yet
            </h3>
            <p className="font-mystical text-muted-foreground text-sm">
              Be the first to connect with fellow cosmic travelers!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div 
                key={member.user_id} 
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="w-10 h-10 cursor-pointer" 
                    onClick={() => navigate(`/user/${member.user_id}`)}
                  >
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="bg-cosmic-gradient text-white text-sm">
                      {member.display_name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <button
                      onClick={() => navigate(`/user/${member.user_id}`)}
                      className="font-mystical font-semibold hover:text-cosmic transition-colors text-left"
                    >
                      {member.display_name}
                    </button>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground truncate max-w-48">
                        {member.bio}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {showActions && user && (
                  <div className="flex items-center gap-2">
                    <MessageDialog
                      recipientId={member.user_id}
                      recipientName={member.display_name}
                      recipientAvatar={member.avatar_url}
                      trigger={
                        <Button variant="cosmic" size="sm" className="gap-1">
                          <MessageCircle className="w-3 h-3" />
                          Message
                        </Button>
                      }
                    />
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

export default CommunityMembersList;
