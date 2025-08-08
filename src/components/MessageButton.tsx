import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MessageDialog from './MessageDialog';

interface MessageButtonProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'cosmic' | 'mystical';
  className?: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  userId,
  userName,
  userAvatar,
  size = 'default',
  variant = 'cosmic',
  className = ''
}) => {
  const { user } = useAuth();

  // Don't show message button for self
  if (!user || user.id === userId) {
    return null;
  }

  return (
    <MessageDialog
      recipientId={userId}
      recipientName={userName}
      recipientAvatar={userAvatar}
      trigger={
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      }
    />
  );
};

export default MessageButton;
