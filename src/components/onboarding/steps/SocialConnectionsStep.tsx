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
  RefreshCw
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialConnection {
  id: string;
  platform: string;
  platform_username: string;
  is_active: boolean;
  connected_at: string;
  last_used_at?: string;
}

const SocialConnectionsStep: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { toast } = useToast();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  const selectedPlatforms = watch('socialConnections.platforms') || [];

  // Load existing connections
  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_connections')
        .select('id, platform, platform_username, is_active, connected_at, last_used_at')
        .eq('is_active', true)
        .order('connected_at', { ascending: false });

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
      
      // Redirect to OAuth flow
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

  const togglePlatform = (platform: string) => {
    const currentPlatforms = selectedPlatforms;
    const isSelected = currentPlatforms.includes(platform);
    
    if (isSelected) {
      setValue('socialConnections.platforms', currentPlatforms.filter(p => p !== platform));
    } else {
      setValue('socialConnections.platforms', [...currentPlatforms, platform]);
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Connect je Social Media
        </CardTitle>
        <p className="text-gray-300">
          Koppel je social media accounts om automatisch content te publiceren
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connected Accounts */}
        {connections.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Verbonden Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600"
                >
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectPlatform(connection.id)}
                      className="text-red-400 border-red-600 hover:bg-red-900/20"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Selecteer Platforms voor Automatische Publicatie
          </h3>
          <p className="text-sm text-gray-400">
            Kies welke platforms je wilt gebruiken voor automatische content publicatie
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                }`}
                onClick={() => togglePlatform(platform.id)}
              >
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
                        Ready
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-600">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                    
                    {selectedPlatforms.includes(platform.id) && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                {!platform.connected && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        connectPlatform(platform.id);
                      }}
                      disabled={connecting === platform.id}
                      className="w-full"
                    >
                      {connecting === platform.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Connect {platform.name}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> Je kunt altijd later meer platforms toevoegen of verwijderen via je profiel instellingen.
            Alleen verbonden platforms kunnen worden gebruikt voor automatische publicatie.
          </AlertDescription>
        </Alert>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadConnections}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Connections
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialConnectionsStep;
