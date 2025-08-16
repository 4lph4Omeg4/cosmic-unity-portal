import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { logError, getUserFriendlyError } from '@/utils/errorUtils';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  id: string;
  otherUser: Profile;
  lastMessage: Message;
  unreadCount: number;
}

const Messages = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auth check + (voor nu) lege conversations tot RPC klaar is
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Haal alle berichten op waarbij de gebruiker betrokken is
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            receiver_id,
            content,
            created_at,
            read
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        if (!messagesData || messagesData.length === 0) {
          setConversations([]);
          return;
        }

        // Groepeer berichten per gesprek (unieke combinatie van sender/receiver)
        const conversationMap = new Map();

        messagesData.forEach(message => {
          const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
          const conversationKey = otherUserId;

          if (!conversationMap.has(conversationKey) ||
              new Date(message.created_at) > new Date(conversationMap.get(conversationKey).lastMessage.created_at)) {
            conversationMap.set(conversationKey, {
              otherUserId,
              lastMessage: message,
              unreadCount: 0 // TODO: tel ongelezen berichten
            });
          }
        });

        // Haal profielen op van alle gesprekspartners
        const otherUserIds = Array.from(conversationMap.keys());
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', otherUserIds);

        if (profilesError) {
          console.warn('Could not load all profiles:', profilesError);
        }

        // Combineer gesprekken met profieldata
        const conversations = Array.from(conversationMap.entries()).map(([otherUserId, conversation]) => {
          const profile = profilesData?.find(p => p.user_id === otherUserId);
          return {
            id: otherUserId,
            otherUser: profile || {
              user_id: otherUserId,
              display_name: 'Unknown User',
              avatar_url: null
            },
            lastMessage: conversation.lastMessage,
            unreadCount: conversation.unreadCount
          };
        });

        setConversations(conversations);
      } catch (error: any) {
        logError('Error fetching conversations', error);
        toast({
          title: t('messages.fetchConversationsError'),
          description: getUserFriendlyError(error),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();

    // Realtime subscription voor nieuwe berichten die gesprekken kunnen updaten
    const conversationsChannel = supabase
      .channel('conversations-updates')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        () => {
          console.log('Message update detected, refreshing conversations...');
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, toast, navigate, t]);

  // Messages laden + realtime subscriben
  useEffect(() => {
    if (!userId || !user) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileError || !profileData) {
          logError('Error loading user profile for messages', profileError);
          toast({
            title: t('messages.userNotFoundError'),
            description: getUserFriendlyError(profileError),
            variant: 'destructive',
          });
          return;
        }

        setRecipient(profileData);

        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`(sender_id.eq.${user.id},receiver_id.eq.${userId}),(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        setMessages(messagesData || []);

        // Realtime inserts (filter client-side om beide richtingen te pakken)
        channel = supabase
          .channel(`messages:${user.id}:${userId}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
            const m = payload.new as Message;
            const relevant =
              (m.sender_id === user.id && m.receiver_id === userId) ||
              (m.sender_id === userId && m.receiver_id === user.id);
            if (relevant) {
              setMessages((prev) => [...prev, m]);
            }
          })
          .subscribe();
      } catch (error: any) {
        logError('Error fetching messages', error);
        toast({
          title: t('messages.fetchMessageError'),
          description: getUserFriendlyError(error),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId, user, toast, t]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !userId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ sender_id: user.id, receiver_id: userId, content: newMessage }])
        .select();

      if (error) throw error;

      if (data) {
        setMessages((prev) => [...prev, data[0]]);
      }
      setNewMessage('');
    } catch (error: any) {
      logError('Error sending message', error);
      toast({
        title: t('messages.sendMessageError'),
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">{t('messages.loading')}</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => navigate('/community')} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('messages.back')}
            </Button>
            <h1 className="font-cosmic text-3xl md:text-4xl font-bold">
              <span className="text-cosmic-gradient">{t('common.cosmic')}</span>{' '}
              <span className="text-mystical-gradient">{t('messages.title')}</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
            <Card className="col-span-1 lg:col-span-1 cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic flex flex-col">
              <CardHeader>
                <CardTitle className="font-cosmic text-cosmic-gradient">{t('messages.conversations')}</CardTitle>
                <CardDescription className="font-mystical">{t('messages.recentConversations')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pr-2 space-y-2">
                {conversations.length > 0 ? (
                  conversations.map((convo) => (
                    <div
                      key={convo.otherUser.user_id}
                      onClick={() => navigate(`/messages/${convo.otherUser.user_id}`)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        userId === convo.otherUser.user_id ? 'bg-cosmic-gradient' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={convo.otherUser.avatar_url} />
                        <AvatarFallback>
                          {convo.otherUser.display_name?.slice(0, 2)?.toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{convo.otherUser.display_name}</div>
                        <div className="text-sm text-muted-foreground truncate">{convo.lastMessage.content}</div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-3 whitespace-nowrap">
                        {new Date(convo.lastMessage.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <Inbox className="w-10 h-10 mb-2" />
                    <p>{t('messages.noConversations')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
              <CardHeader>
                <CardTitle className="font-cosmic text-cosmic-gradient">
                  {recipient ? recipient.display_name : t('messages.selectConversation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">{t('messages.noMessagesYet')}</div>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender_id === user?.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            mine ? 'bg-cosmic-gradient text-white' : 'bg-muted'
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">{m.content}</div>
                          <div className={`text-[10px] mt-1 opacity-70 ${mine ? 'text-white' : 'text-foreground'}`}>
                            {new Date(m.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('messages.typeMessage')}
                />
                <Button type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  {t('messages.send')}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
