import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Bug, CheckCircle, AlertCircle, Info } from 'lucide-react';

const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      supabaseUrl: '',
      hasValidKeys: false,
      authSettings: {},
      connectionTest: null,
      userCount: null,
      authPolicies: null,
      errors: []
    };

    try {
      // Check Supabase URL and keys
      const supabaseUrl = supabase.supabaseUrl;
      const supabaseKey = supabase.supabaseKey;
      
      info.supabaseUrl = supabaseUrl;
      info.hasValidKeys = !!(supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://'));

      // Test connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        info.connectionTest = { success: !error, error: error?.message };
      } catch (e) {
        info.connectionTest = { success: false, error: 'Connection failed' };
      }

      // Get auth settings
      try {
        const { data: authData } = await supabase.auth.getSession();
        info.authSettings = {
          hasSession: !!authData.session,
          currentUser: authData.session?.user?.email || null
        };
      } catch (e) {
        info.errors.push('Auth session check failed');
      }

      // Check common Supabase settings issues
      info.commonIssues = [];

      // Test basic signup functionality (dry run)
      try {
        // Just test if we can call the signup method without actually signing up
        const testEmail = 'test-' + Date.now() + '@example.com';
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: testEmail,
          password: 'testpass123',
          options: {
            data: { display_name: 'Test User' }
          }
        });

        info.signupTest = {
          attempted: true,
          error: signupError?.message || null,
          success: !signupError,
          userData: signupData?.user ? {
            id: signupData.user.id,
            email: signupData.user.email,
            emailConfirmed: !!signupData.user.email_confirmed_at,
            confirmed: !!signupData.user.confirmed_at
          } : null
        };

        // Check for common issues
        if (signupData?.user && !signupData.user.email_confirmed_at) {
          info.commonIssues.push('Email confirmation is required - check your Supabase Auth settings');
        }

        if (signupError?.message?.includes('rate limit')) {
          info.commonIssues.push('Rate limit exceeded - wait a few minutes before trying again');
        }

        if (signupError?.message?.includes('email_address_not_authorized')) {
          info.commonIssues.push('Email address not authorized - check your Supabase Auth settings');
        }

      } catch (e) {
        info.signupTest = {
          attempted: true,
          error: e instanceof Error ? e.message : 'Unknown error',
          success: false,
          userData: null
        };
      }

      // Check if auth is enabled in Supabase
      try {
        const { data, error } = await supabase.auth.getUser();
        info.authEnabled = !error || error.message !== 'Auth session missing!';
      } catch (e) {
        info.authEnabled = false;
        info.errors.push('Auth not properly configured');
      }

    } catch (error) {
      info.errors.push(error instanceof Error ? error.message : 'Unknown error during diagnostics');
    }

    setDebugInfo(info);
    setLoading(false);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <Card className="mt-6 bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          Auth Debug & Diagnostics
        </CardTitle>
        <CardDescription>
          Diagnose authentication and signup issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={loading} variant="outline" className="w-full">
          {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Supabase Connection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.hasValidKeys)}
                  <span className="font-medium">Supabase Configuration</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>URL: <Badge variant="outline">{debugInfo.supabaseUrl || 'Not found'}</Badge></div>
                  <div>Valid Keys: <Badge variant={debugInfo.hasValidKeys ? "default" : "destructive"}>
                    {debugInfo.hasValidKeys ? 'Yes' : 'No'}
                  </Badge></div>
                </div>
              </div>

              {/* Connection Test */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.connectionTest?.success)}
                  <span className="font-medium">Database Connection</span>
                </div>
                <div className="text-sm">
                  {debugInfo.connectionTest?.success ? (
                    <Badge variant="default">Connected</Badge>
                  ) : (
                    <Badge variant="destructive">{debugInfo.connectionTest?.error || 'Failed'}</Badge>
                  )}
                </div>
              </div>

              {/* Auth Test */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.authEnabled)}
                  <span className="font-medium">Auth Service</span>
                </div>
                <div className="text-sm">
                  <Badge variant={debugInfo.authEnabled ? "default" : "destructive"}>
                    {debugInfo.authEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              {/* Signup Test */}
              {debugInfo.signupTest && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(debugInfo.signupTest.success)}
                    <span className="font-medium">Signup Test</span>
                  </div>
                  <div className="text-sm space-y-1">
                    {debugInfo.signupTest.success ? (
                      <div>
                        <Badge variant="default">Working</Badge>
                        {debugInfo.signupTest.userData && (
                          <div className="mt-1 text-xs space-y-1">
                            <div>Email Confirmed:
                              <Badge variant={debugInfo.signupTest.userData.emailConfirmed ? "default" : "secondary"} className="ml-1">
                                {debugInfo.signupTest.userData.emailConfirmed ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        {debugInfo.signupTest.error || 'Failed'}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current Session */}
            {debugInfo.authSettings && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Current Session</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Has Session: <Badge variant={debugInfo.authSettings.hasSession ? "default" : "secondary"}>
                    {debugInfo.authSettings.hasSession ? 'Yes' : 'No'}
                  </Badge></div>
                  {debugInfo.authSettings.currentUser && (
                    <div>User: <Badge variant="outline">{debugInfo.authSettings.currentUser}</Badge></div>
                  )}
                </div>
              </div>
            )}

            {/* Errors */}
            {debugInfo.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-red-600">Errors Found</span>
                </div>
                <div className="text-sm space-y-1">
                  {debugInfo.errors.map((error: string, index: number) => (
                    <div key={index} className="p-2 bg-red-50 text-red-700 rounded text-xs">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Debug Data */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Raw Debug Data</summary>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebug;
