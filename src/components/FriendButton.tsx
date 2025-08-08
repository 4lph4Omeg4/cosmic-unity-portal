import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, UserX, Clock, MessageCircle } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { useAuth } from '@/hooks/useAuth';
import MessageDialog from './MessageDialog';

interface FriendButtonProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'cosmic' | 'mystical';
  showMessageButton?: boolean;
}

const FriendButton: React.FC<FriendButtonProps> = ({
  userId,
  userName,
  userAvatar,
  size = 'default',
  variant = 'outline',
  showMessageButton = true
}) => {
  const { user } = useAuth();
  const { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    removeFriend, 
    checkFriendshipStatus, 
    getFriendshipId 
  } = useFriends();
  
  const [status, setStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'blocked'>('none');
  const [friendshipId, setFriendshipId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Don't show buttons for self
  if (!user || user.id === userId) {
    return null;
  }

  useEffect(() => {
    loadFriendshipStatus();
  }, [userId]);

  const loadFriendshipStatus = async () => {
    try {
      setLoading(true);
      const [friendshipStatus, friendshipIdResult] = await Promise.all([
        checkFriendshipStatus(userId),
        getFriendshipId(userId)
      ]);
      
      setStatus(friendshipStatus);
      setFriendshipId(friendshipIdResult);
    } catch (error) {
      console.error('Error loading friendship status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setActionLoading(true);
    const success = await sendFriendRequest(userId);
    if (success) {
      loadFriendshipStatus();
    }
    setActionLoading(false);
  };

  const handleAcceptRequest = async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    const success = await acceptFriendRequest(friendshipId);
    if (success) {
      loadFriendshipStatus();
    }
    setActionLoading(false);
  };

  const handleRejectRequest = async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    const success = await rejectFriendRequest(friendshipId);
    if (success) {
      loadFriendshipStatus();
    }
    setActionLoading(false);
  };

  const handleRemoveFriend = async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    const success = await removeFriend(friendshipId);
    if (success) {
      loadFriendshipStatus();
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <Button variant={variant} size={size} disabled>
        Loading...
      </Button>
    );
  }

  const renderFriendButton = () => {
    switch (status) {
      case 'none':
        return (
          <Button
            variant={variant}
            size={size}
            onClick={handleSendRequest}
            disabled={actionLoading}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {actionLoading ? 'Sending...' : 'Add Friend'}
          </Button>
        );

      case 'pending_sent':
        return (
          <Button
            variant="secondary"
            size={size}
            onClick={handleRejectRequest}
            disabled={actionLoading}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            {actionLoading ? 'Canceling...' : 'Request Sent'}
          </Button>
        );

      case 'pending_received':
        return (
          <div className="flex gap-2">
            <Button
              variant="cosmic"
              size={size}
              onClick={handleAcceptRequest}
              disabled={actionLoading}
              className="gap-2"
            >
              <UserCheck className="w-4 h-4" />
              {actionLoading ? 'Accepting...' : 'Accept'}
            </Button>
            <Button
              variant="outline"
              size={size}
              onClick={handleRejectRequest}
              disabled={actionLoading}
              className="gap-2"
            >
              <UserX className="w-4 h-4" />
              Reject
            </Button>
          </div>
        );

      case 'accepted':
        return (
          <div className="flex gap-2">
            {showMessageButton && (
              <MessageDialog
                recipientId={userId}
                recipientName={userName}
                recipientAvatar={userAvatar}
                trigger={
                  <Button variant="cosmic" size={size} className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                }
              />
            )}
            <Button
              variant="outline"
              size={size}
              onClick={handleRemoveFriend}
              disabled={actionLoading}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <UserX className="w-4 h-4" />
              {actionLoading ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        );

      case 'blocked':
        return (
          <Button variant="secondary" size={size} disabled className="gap-2">
            <UserX className="w-4 h-4" />
            Blocked
          </Button>
        );

      default:
        return null;
    }
  };

  return <>{renderFriendButton()}</>;
};

export default FriendButton;
