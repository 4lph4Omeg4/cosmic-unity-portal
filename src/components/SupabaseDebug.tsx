import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SupabaseDebug: React.FC = () => {
  const [status, setStatus] = useState<{
    connection: 'checking' | 'connected' | 'error';
    auth: 'checking' | 'working' | 'error';
    database: 'checking' | 'working' | 'error';
    edgeFunctions: 'checking' | 'working' | 'error';
  }>({
    connection: 'checking',
    auth: 'checking',
    database: 'checking',
    edgeFunctions: 'checking',
  });

  const [details, setDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    setStatus({
      connection: 'checking',
      auth: 'checking',
      database: 'checking',
      edgeFunctions: 'checking',
    });

    try {
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      
      setStatus(prev => ({ ...prev, connection: 'connected' }));
      setDetails(prev => ({ ...prev, connection: '✅ Connected to Supabase' }));

      // Test auth
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      
      setStatus(prev => ({ ...prev, auth: 'working' }));
      setDetails(prev => ({ ...prev, auth: '✅ Auth working', session: authData.session }));

      // Test database tables
      const tables = ['profiles', 'orgs'];
      for (const table of tables) {
        try {
          const { error: tableError } = await supabase.from(table).select('*').limit(1);
          if (tableError) {
            setDetails(prev => ({ ...prev, [`table_${table}`]: `❌ ${tableError.message}` }));
          } else {
            setDetails(prev => ({ ...prev, [`table_${table}`]: `✅ Table ${table} accessible` }));
          }
        } catch (e) {
          setDetails(prev => ({ ...prev, [`table_${table}`]: `❌ Table ${table} error: ${e}` }));
        }
      }

      setStatus(prev => ({ ...prev, database: 'working' }));

      // Test Edge Functions
      try {
        const response = await fetch(`${supabase.supabaseUrl}/functions/v1/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`,
          },
          body: JSON.stringify({ price_id: 'test', org_id: 'test' }),
        });
        
        if (response.status === 400) {
          // Expected error for test data
          setStatus(prev => ({ ...prev, edgeFunctions: 'working' }));
          setDetails(prev => ({ ...prev, edgeFunctions: '✅ Edge Functions accessible' }));
        } else {
          setStatus(prev => ({ ...prev, edgeFunctions: 'error' }));
          setDetails(prev => ({ ...prev, edgeFunctions: `❌ Edge Functions error: ${response.status}` }));
        }
      } catch (e) {
        setStatus(prev => ({ ...prev, edgeFunctions: 'error' }));
        setDetails(prev => ({ ...prev, edgeFunctions: `❌ Edge Functions error: ${e}` }));
      }

    } catch (error) {
      console.error('Supabase debug error:', error);
      setStatus(prev => ({ ...prev, connection: 'error' }));
      setDetails(prev => ({ ...prev, error: `❌ ${error}` }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'working':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Supabase Debug Panel
          <Button 
            size="sm" 
            onClick={checkConnection} 
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Refresh'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.connection)}`} />
            <span>Connection</span>
            <Badge variant={status.connection === 'connected' ? 'default' : 'destructive'}>
              {status.connection}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.auth)}`} />
            <span>Authentication</span>
            <Badge variant={status.auth === 'working' ? 'default' : 'destructive'}>
              {status.auth}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.database)}`} />
            <span>Database</span>
            <Badge variant={status.database === 'working' ? 'default' : 'destructive'}>
              {status.database}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.edgeFunctions)}`} />
            <span>Edge Functions</span>
            <Badge variant={status.edgeFunctions === 'working' ? 'default' : 'destructive'}>
              {status.edgeFunctions}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Details:</h4>
          <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono">{key}:</span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>💡 Als er problemen zijn, volg de stappen in deploy-supabase.md</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseDebug;
