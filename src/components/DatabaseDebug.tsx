import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const DatabaseDebug: React.FC = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const testMessagesTable = async () => {
    if (!user) {
      setResult('No user logged in');
      return;
    }

    setTesting(true);
    try {
      // Test if messages table exists by trying to select from it
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .limit(1);

      if (error) {
        setResult(`Table error: ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`Table exists! Found ${data?.length || 0} messages`);
      }
    } catch (error) {
      setResult(`Connection error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setTesting(false);
    }
  };

  const testInsertMessage = async () => {
    if (!user) {
      setResult('No user logged in');
      return;
    }

    setTesting(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: user.id, // Send to self for testing
          content: 'Test message from debug component'
        })
        .select();

      if (error) {
        setResult(`Insert error: ${JSON.stringify(error, null, 2)}`);
      } else {
        setResult(`Insert successful! Created message: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`Insert failed: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setTesting(false);
    }
  };

  if (!user) {
    return (
      <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
        <CardHeader>
          <CardTitle className="font-cosmic text-cosmic-gradient">Database Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to test database functionality.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
      <CardHeader>
        <CardTitle className="font-cosmic text-cosmic-gradient">Database Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testMessagesTable} 
            disabled={testing}
            variant="outline"
          >
            Test Messages Table
          </Button>
          
          <Button 
            onClick={testInsertMessage} 
            disabled={testing}
            variant="cosmic"
          >
            Test Insert Message
          </Button>
        </div>
        
        {result && (
          <div className="p-4 bg-background/50 rounded-lg">
            <h4 className="font-semibold mb-2">Result:</h4>
            <pre className="text-sm whitespace-pre-wrap overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseDebug;
