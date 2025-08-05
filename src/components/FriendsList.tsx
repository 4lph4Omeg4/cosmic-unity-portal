import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

const FriendsList = () => {
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFriends(profiles || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedFriends = showAll ? friends : friends.slice(0, 8);

  if (loading) {
    return (
      <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
        <CardHeader>
          <CardTitle className="font-cosmic text-cosmic-gradient flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('friends.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-cosmic-pulse">{t('common.loading')}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
      <CardHeader>
        <CardTitle className="font-cosmic text-cosmic-gradient flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t('friends.title')}
        </CardTitle>
        <p className="font-mystical text-sm text-muted-foreground">
          {t('friends.subtitle')} ({friends.length})
        </p>
      </CardHeader>
      <CardContent>
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-cosmic animate-cosmic-pulse">
              <User className="w-6 h-6 text-white" />
            </div>
            <p className="font-mystical text-muted-foreground">
              {t('friends.noMembers')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {displayedFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex flex-col items-center p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors cursor-pointer"
                  onClick={() => navigate(`/user/${friend.user_id}`)}
                >
                  <Avatar className="w-12 h-12 mb-2">
                    <AvatarImage src={friend.avatar_url} />
                    <AvatarFallback className="bg-cosmic-gradient text-white">
                      {friend.display_name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-mystical text-sm font-medium truncate w-full">
                      {friend.display_name || t('friends.noName')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {friends.length > 8 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs"
                >
                  {showAll ? t('friends.showLess') : `${t('friends.showMore')} (${friends.length - 8})`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;