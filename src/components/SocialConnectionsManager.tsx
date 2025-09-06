import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialConnection {
  id: string;
  platform: string;
  platform_username: string;
  is_active: boolean;
  connected_at: string;
  last_used_at?: string;
  token_expires_at?: string;
}

interface SocialConnectionsManagerProps {
  userId?: string; // If provided, shows connections for specific user
  showAll?: boolean; // If true, shows all connections (admin view)
}

const SocialConnectionsManager: React.FC<SocialConnectionsManagerProps> = ({ 
  userId, 
  showAll = false 
}) => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    loadConnections();
  }, [userId, showAll]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('social_connections')
        .select('id, platform, platform_username, is_active, connected_at, last_used_at, token_expires_at')
        .order('connected_at', { ascending: false });

      if (!showAll && userId) {
        query = query.eq('user_id', userId);
      } else if (!showAll) {
        // Get current user's connections
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: "Error",
        description: "Failed to load social media connections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platform: string) => {
    try {
      setConnecting(platform);
      
      const { data, error } = await supabase.functions.invoke('social-oauth', {
        body: { platform }
      });

      if (error) throw error;

      if (data?.authUrl) {
        // Open OAuth in popup window
        const popup = window.open(
          data.authUrl,
          `${platform}_oauth`,
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnecting(null);
            loadConnections(); // Refresh connections
          }
        }, 1000);

      } else {
        throw new Error('No auth URL received');
      }
    } catch (error) {
      console.error('Error connecting platform:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${platform}. Please try again.`,
        variant: "destructive",
      });
      setConnecting(null);
    }
  };

  const disconnectPlatform = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('social_connections')
        .update({ is_active: false })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: "Social media account disconnected successfully",
      });

      loadConnections();
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-700';
      default: return 'bg-gray-600';
    }
  };

  const isTokenExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      description: 'Share visual content and stories',
      connected: connections.some(c => c.platform === 'instagram' && c.is_active)
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      description: 'Reach your audience with posts and stories',
      connected: connections.some(c => c.platform === 'facebook' && c.is_active)
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      description: 'Share quick updates and engage in conversations',
      connected: connections.some(c => c.platform === 'twitter' && c.is_active)
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      description: 'Professional networking and business content',
      connected: connections.some(c => c.platform === 'linkedin' && c.is_active)
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading connections...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Social Media Connections</h3>
          <p className="text-sm text-gray-400">
            Manage your social media accounts for automatic posting
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadConnections}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Connected Accounts */}
      {connections.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Connected Accounts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <Card key={connection.id} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full text-white ${getPlatformColor(connection.platform)}`}>
                        {getPlatformIcon(connection.platform)}
                      </div>
                      <div>
                        <p className="font-medium text-white capitalize">
                          {connection.platform}
                        </p>
                        <p className="text-sm text-gray-400">
                          @{connection.platform_username}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              connection.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {connection.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {isTokenExpired(connection.token_expires_at) && (
                            <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Token Expired
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disconnectPlatform(connection.id)}
                        className="text-red-400 border-red-600 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Connected: {new Date(connection.connected_at).toLocaleDateString()}</p>
                    {connection.last_used_at && (
                      <p>Last used: {new Date(connection.last_used_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-white">Available Platforms</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => (
            <Card 
              key={platform.id} 
              className={`cursor-pointer transition-all ${
                platform.connected 
                  ? 'bg-green-900/20 border-green-600' 
                  : 'bg-gray-800 border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => !platform.connected && connectPlatform(platform.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full text-white ${getPlatformColor(platform.id)}`}>
                      {getPlatformIcon(platform.id)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{platform.name}</p>
                      <p className="text-sm text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          connectPlatform(platform.id);
                        }}
                        disabled={connecting === platform.id}
                      >
                        {connecting === platform.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Connected accounts will be used for automatic posting when you approve content previews. 
          You can manage these connections anytime from your profile settings.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SocialConnectionsManager;
