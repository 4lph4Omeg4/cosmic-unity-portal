import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MessageDialogProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  trigger,
  open,
  onOpenChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : dialogOpen;
  const setIsOpen = onOpenChange || setDialogOpen;

  const sendMessage = async () => {
    if (!user || !message.trim() || user.id === recipientId) return;

    try {
      setSending(true);

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          content: message.trim()
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${recipientName}.`,
      });

      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message :
                          typeof error === 'object' && error !== null ? JSON.stringify(error) :
                          'Unknown error occurred';
      toast({
        title: "Error sending message",
        description: `Could not send the message: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <MessageCircle className="w-4 h-4" />
      Message
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md cosmic-hover bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="font-cosmic text-cosmic-gradient flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            Send Message
          </DialogTitle>
          <DialogDescription className="font-mystical">
            Send a private message to {recipientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={recipientAvatar} />
              <AvatarFallback className="bg-cosmic-gradient text-white">
                {recipientName?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-mystical font-semibold">{recipientName}</h4>
              <p className="text-sm text-muted-foreground">Cosmic traveler</p>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-mystical font-medium">
              Your Message
            </label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={4}
              className="font-mystical"
              disabled={sending}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button 
              onClick={sendMessage}
              disabled={!message.trim() || sending}
              variant="cosmic"
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
