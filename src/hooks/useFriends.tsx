import React, { createContext, useContext, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FriendsContextType {
  sendFriendRequest: (friendId: string) => Promise<boolean>;
  acceptFriendRequest: (friendshipId: string) => Promise<boolean>;
  rejectFriendRequest: (friendshipId: string) => Promise<boolean>;
  removeFriend: (friendshipId: string) => Promise<boolean>;
  checkFriendshipStatus: (friendId: string) => Promise<'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'blocked'>;
  getFriendshipId: (friendId: string) => Promise<string | null>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendFriendRequest = useCallback(async (friendId: string): Promise<boolean> => {
    if (!user || user.id === friendId) return false;

    try {
      // Check if friendship already exists
      const { data: existingFriendship } = await supabase
        .from('friends')
        .select('id, status')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
        .single();

      if (existingFriendship) {
        if (existingFriendship.status === 'accepted') {
          toast({
            title: "Already friends",
            description: "You are already friends with this user.",
            variant: "destructive",
          });
          return false;
        } else if (existingFriendship.status === 'pending') {
          toast({
            title: "Request already sent",
            description: "A friend request is already pending.",
            variant: "destructive",
          });
          return false;
        }
      }

      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error sending request",
        description: "Could not send the friend request.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  const acceptFriendRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)
        .eq('friend_id', user.id); // Only the receiver can accept

      if (error) throw error;

      toast({
        title: "Friend request accepted",
        description: "You are now friends!",
      });

      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error accepting request",
        description: "Could not accept the friend request.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  const rejectFriendRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId)
        .eq('friend_id', user.id); // Only the receiver can reject

      if (error) throw error;

      toast({
        title: "Friend request rejected",
        description: "The friend request has been rejected.",
      });

      return true;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Error rejecting request",
        description: "Could not reject the friend request.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  const removeFriend = useCallback(async (friendshipId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Friend removed",
        description: "The friend has been removed from your list.",
      });

      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Error removing friend",
        description: "Could not remove the friend.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  const checkFriendshipStatus = useCallback(async (friendId: string): Promise<'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'blocked'> => {
    if (!user || user.id === friendId) return 'none';

    try {
      const { data: friendship } = await supabase
        .from('friends')
        .select('user_id, friend_id, status')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
        .single();

      if (!friendship) return 'none';

      if (friendship.status === 'accepted') return 'accepted';
      if (friendship.status === 'blocked') return 'blocked';
      
      // Check if current user sent the request or received it
      if (friendship.user_id === user.id) {
        return 'pending_sent';
      } else {
        return 'pending_received';
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
      return 'none';
    }
  }, [user]);

  const getFriendshipId = useCallback(async (friendId: string): Promise<string | null> => {
    if (!user || user.id === friendId) return null;

    try {
      const { data: friendship } = await supabase
        .from('friends')
        .select('id')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
        .single();

      return friendship?.id || null;
    } catch (error) {
      console.error('Error getting friendship ID:', error);
      return null;
    }
  }, [user]);

  const value = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    checkFriendshipStatus,
    getFriendshipId,
  };

  return (
    <FriendsContext.Provider value={value}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
