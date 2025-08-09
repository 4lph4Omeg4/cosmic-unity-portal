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
}

interface Conversation {
  profile: Profile;
  last_message: string;
  last_message_time: string;
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
  const [databaseError, setDatabaseError] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      try {
        // For now, we'll just set empty conversations until the RPC function is properly set up
        setConversations([]);
      } catch (error: any) {
        console.error('Error fetching conversations:', error);
        toast({
          title: t('messages.fetchConversationsError'),
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, toast, navigate, t]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !user) return;

      try {
        setLoading(true);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileError || !profileData) {
          toast({
            title: t('messages.userNotFoundError'),
            description: profileError?.message,
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
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          title: t('messages.fetchMessageError'),
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const channel = supabase.channel(`messages:${user?.id}:${userId}`)
    .on<Message>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user?.id}` }, payload => {
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
    })
    .subscribe();

    return () => {
        supabase.removeChannel(channel);
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
      
      if(data) {
        setMessages(prev => [...prev, data[0]]);
      }
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: t('messages.sendMessageError'),
        description: error.message,
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
             <Button 
              onClick={() => navigate('/community')} 
              variant="outline"
              className="gap-2"
            >
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
                {conversations.length > 0 ? conversations.map(convo => (
                  <div key={convo.profile.user_id} onClick={() => navigate(`/messages/${convo.profile.user_id}`)} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${userId === convo.profile.user_id ? 'bg-cosmic-gradient' : 'hover:bg-muted/50'}`}>
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={convo.profile.avatar_url} />
                      <AvatarFallback>{convo.profile.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                       <p className={`font-bold truncate ${userId === convo.profile.user_id ? 'text-white' : ''}`}>{convo.profile.display_name}</p>
                       <p className={`text-xs truncate ${userId === convo.profile.user_id ? 'text-gray-200' : 'text-muted-foreground'}`}>{convo.last_message}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center font-mystical text-muted-foreground pt-4">{t('messages.noConversations')}</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic flex flex-col h-full">
              {userId && recipient ? (
                <>
                  <CardHeader className="flex flex-row items-center space-x-4 border-b">
                     <Avatar>
                       <AvatarImage src={recipient.avatar_url} />
                       <AvatarFallback>{recipient.display_name.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <CardTitle className="font-cosmic text-mystical-gradient">{recipient.display_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex items-end gap-2 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender_id !== user?.id && <Avatar className="w-8 h-8"><AvatarImage src={recipient.avatar_url} /></Avatar>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender_id === user?.id ? 'bg-cosmic-gradient text-white rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </CardContent>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('messages.typeMessage')}
                        className="flex-1"
                      />
                      <Button type="submit" variant="cosmic" size="icon"><Send className="w-4 h-4" /></Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                   <Inbox className="w-16 h-16 text-muted-foreground/50 mb-4" />
                   <h3 className="text-xl font-bold font-cosmic text-cosmic-gradient">{t('messages.selectConversation')}</h3>
                   <p className="text-muted-foreground font-mystical">{t('messages.startMessaging')}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
