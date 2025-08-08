import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, ArrowLeft, Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_profile: {
    user_id: string;
    display_name: string;
    avatar_url?: string;
  };
  receiver_profile: {
    user_id: string;
    display_name: string;
    avatar_url?: string;
  };
}

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const Messages = () => {
  const { userId } = useParams(); // Optional: specific conversation
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(userId || null);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadConversations();
    setupRealtimeSubscription();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setDatabaseError(null);

      // Get all messages for the current user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          read,
          created_at
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        return;
      }

      // Group messages by conversation (other user)
      const conversationMap = new Map<string, {
        messages: typeof messagesData,
        otherUserId: string;
      }>();

      messagesData.forEach(message => {
        const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            messages: [],
            otherUserId
          });
        }
        
        conversationMap.get(otherUserId)!.messages.push(message);
      });

      // Get profiles for all other users
      const otherUserIds = Array.from(conversationMap.keys());
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', otherUserIds);

      if (profilesError) throw profilesError;

      // Create conversations array
      const conversationsArray: Conversation[] = Array.from(conversationMap.entries()).map(([otherUserId, data]) => {
        const profile = profilesData?.find(p => p.user_id === otherUserId);
        const lastMessage = data.messages[0]; // Already sorted by created_at desc
        const unreadCount = data.messages.filter(msg => 
          msg.receiver_id === user?.id && !msg.read
        ).length;

        return {
          otherUserId,
          otherUserName: profile?.display_name || 'Unknown User',
          otherUserAvatar: profile?.avatar_url,
          lastMessage: lastMessage.content,
          lastMessageTime: lastMessage.created_at,
          unreadCount
        };
      });

      // Sort by last message time
      conversationsArray.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      setConversations(conversationsArray);
    } catch (error) {
      console.error('Error loading conversations:', error);
      const errorMessage = error instanceof Error ? error.message :
                          typeof error === 'object' && error !== null ? JSON.stringify(error) :
                          'Unknown error occurred';

      // Check if it's a table doesn't exist error
      const isTableError = errorMessage.includes('relation "public.messages" does not exist') ||
                          errorMessage.includes('table "messages" does not exist');

      if (isTableError) {
        setDatabaseError("The messages table hasn't been created yet. Please run the SQL script from create_tables.sql in your Supabase dashboard.");
      }

      toast({
        title: "Error loading conversations",
        description: isTableError
          ? "The messages table hasn't been created yet. Please run the SQL script from create_tables.sql in your Supabase dashboard."
          : `Could not load your conversations: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      // Get messages between current user and selected user
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          read,
          created_at
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        return;
      }

      // Get profiles for sender and receiver
      const userIds = [user?.id, otherUserId].filter(Boolean) as string[];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Add profile data to messages
      const messagesWithProfiles = messagesData.map(message => {
        const senderProfile = profilesData?.find(p => p.user_id === message.sender_id);
        const receiverProfile = profilesData?.find(p => p.user_id === message.receiver_id);

        return {
          ...message,
          sender_profile: senderProfile || {
            user_id: message.sender_id,
            display_name: 'Unknown User',
            avatar_url: null
          },
          receiver_profile: receiverProfile || {
            user_id: message.receiver_id,
            display_name: 'Unknown User',
            avatar_url: null
          }
        };
      });

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error loading messages:', error);
      const errorMessage = error instanceof Error ? error.message :
                          typeof error === 'object' && error !== null ? JSON.stringify(error) :
                          'Unknown error occurred';
      toast({
        title: "Error loading messages",
        description: `Could not load the conversation: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const markMessagesAsRead = async (otherUserId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', user?.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    try {
      setSendingMessage(true);

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedConversation);
      loadConversations(); // Refresh to update last message
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
      setSendingMessage(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user?.id}` 
      }, () => {
        loadConversations();
        if (selectedConversation) {
          loadMessages(selectedConversation);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">Loading messages...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (databaseError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
              <CardHeader>
                <CardTitle className="font-cosmic text-cosmic-gradient flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Database Setup Required
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-4">
                  Messages Table Not Found
                </h3>
                <p className="font-mystical text-muted-foreground mb-6 max-w-md mx-auto">
                  {databaseError}
                </p>
                <div className="space-y-4">
                  <Button onClick={() => navigate('/profile')} variant="cosmic">
                    Go to Profile (with Database Debug)
                  </Button>
                  <Button onClick={() => navigate('/community')} variant="outline">
                    Back to Community
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/community')} 
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
                <Inbox className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-cosmic text-3xl font-bold">
                <span className="text-cosmic-gradient">Cosmic</span>{' '}
                <span className="text-mystical-gradient">Messages</span>
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
              <CardHeader>
                <CardTitle className="font-cosmic text-cosmic-gradient flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Conversations
                </CardTitle>
                <CardDescription className="font-mystical">
                  Your recent conversations
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-mystical text-muted-foreground">
                        No conversations yet
                      </p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <button
                        key={conversation.otherUserId}
                        onClick={() => setSelectedConversation(conversation.otherUserId)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-background/50 transition-colors border-b border-border/50 text-left ${
                          selectedConversation === conversation.otherUserId ? 'bg-background/30' : ''
                        }`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.otherUserAvatar} />
                          <AvatarFallback className="bg-cosmic-gradient text-white">
                            {conversation.otherUserName?.charAt(0).toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-mystical font-semibold truncate">
                              {conversation.otherUserName}
                            </h4>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="cosmic" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Messages Area */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic h-full flex flex-col">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="font-cosmic text-cosmic-gradient flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={conversations.find(c => c.otherUserId === selectedConversation)?.otherUserAvatar} />
                        <AvatarFallback className="bg-cosmic-gradient text-white text-sm">
                          {conversations.find(c => c.otherUserId === selectedConversation)?.otherUserName?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      {conversations.find(c => c.otherUserId === selectedConversation)?.otherUserName}
                    </CardTitle>
                  </CardHeader>
                  
                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender_id !== user?.id && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.sender_profile.avatar_url} />
                            <AvatarFallback className="bg-cosmic-gradient text-white text-xs">
                              {message.sender_profile.display_name?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-cosmic text-white'
                            : 'bg-background/50'
                        }`}>
                          <p className="font-mystical text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id
                              ? 'text-white/70'
                              : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                        
                        {message.sender_id === user?.id && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.sender_profile.avatar_url} />
                            <AvatarFallback className="bg-cosmic-gradient text-white text-xs">
                              {message.sender_profile.display_name?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </CardContent>
                  
                  {/* Message Input */}
                  <div className="p-4 border-t border-border/50">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={sendingMessage}
                        className="font-mystical"
                      />
                      <Button 
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        variant="cosmic"
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-2">
                      Select a conversation
                    </h3>
                    <p className="font-mystical text-muted-foreground">
                      Choose a conversation from the left to start messaging
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
