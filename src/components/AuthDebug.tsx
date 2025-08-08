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

      // Test basic signup functionality with a known invalid email to avoid creating actual users
      try {
        // Use an obviously invalid email to test auth without creating real users
        const testEmail = 'definitely-invalid-email-for-testing@nonexistentdomain-123456789.com';
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: testEmail,
          password: 'testpass123456',
          options: {
            data: { display_name: 'Test User' }
          }
        });

        console.log('=== DEBUG TEST SIGNUP RESULT ===');
        console.log('Test data:', signupData);
        console.log('Test error:', signupError);
        console.log('Test error serialized:', signupError ? JSON.stringify(signupError, null, 2) : 'No error');

        info.signupTest = {
          attempted: true,
          error: signupError?.message || null,
          errorCode: signupError?.code || null,
          success: !signupError || signupError.message?.includes('email_address_invalid'), // Invalid email is expected
          userData: signupData?.user ? {
            id: signupData.user.id,
            email: signupData.user.email,
            emailConfirmed: !!signupData.user.email_confirmed_at,
            confirmed: !!signupData.user.confirmed_at
          } : null
        };

        // Check for common issues based on error patterns
        if (signupError) {
          const errorMsg = signupError.message?.toLowerCase() || '';

          if (errorMsg.includes('rate limit') || errorMsg.includes('rate_limit')) {
            info.commonIssues.push('⚠️ Rate limit exceeded - wait a few minutes before trying again');
          }

          if (errorMsg.includes('email_address_not_authorized') || errorMsg.includes('not_authorized')) {
            info.commonIssues.push('🚫 Email address not authorized - check Supabase Auth → Settings → Email domains');
          }

          if (errorMsg.includes('invalid_credentials') || errorMsg.includes('authentication')) {
            info.commonIssues.push('🔑 Authentication configuration issue - check Supabase API keys');
          }

          if (errorMsg.includes('signup_disabled') || errorMsg.includes('disabled')) {
            info.commonIssues.push('📝 Signup is disabled - check Supabase Auth → Settings → Enable signup');
          }

          // If we get an email_address_invalid error, that's actually good - it means auth is working
          if (errorMsg.includes('email_address_invalid')) {
            info.signupTest.success = true;
            info.signupTest.error = 'Working (invalid email test passed)';
          }
        } else if (signupData?.user) {
          // If signup succeeded, check email confirmation requirements
          if (!signupData.user.email_confirmed_at && !signupData.user.confirmed_at) {
            info.commonIssues.push('📧 Email confirmation is required - users must confirm their email before logging in');
          }
        }

      } catch (e) {
        console.error('Debug signup test failed with exception:', e);
        info.signupTest = {
          attempted: true,
          error: e instanceof Error ? e.message : 'Network or configuration error',
          errorCode: 'exception',
          success: false,
          userData: null
        };

        info.commonIssues.push('⚠️ Network or configuration error - check Supabase connection');
      }

      // Check if auth is enabled in Supabase
      try {
        const { data, error } = await supabase.auth.getUser();
        info.authEnabled = !error || error.message !== 'Auth session missing!';
      } catch (e) {
        info.authEnabled = false;
        info.errors.push('Auth not properly configured');
      }

      // Check profiles table and setup
      try {
        console.log('=== CHECKING PROFILES TABLE ===');

        // Test if profiles table exists and is accessible
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .limit(1);

        info.profilesTable = {
          exists: !profilesError,
          accessible: !profilesError,
          error: profilesError?.message || null,
          sampleData: profilesData?.length || 0
        };

        if (profilesError) {
          console.error('Profiles table error:', profilesError);
          if (profilesError.message?.includes('relation "public.profiles" does not exist')) {
            info.commonIssues.push('🗄️ Profiles table does not exist - run the SQL script from create_tables.sql');
          } else if (profilesError.message?.includes('permission denied')) {
            info.commonIssues.push('🔒 Profiles table permission denied - check RLS policies');
          }
        }

        // Test profile creation trigger by checking if we can insert a test profile
        // (This will fail gracefully if trigger doesn't exist)
        try {
          const testUserId = 'test-user-id-' + Date.now();
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: testUserId,
              display_name: 'Test User Delete Me',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (!insertError) {
            // Clean up test data
            await supabase.from('profiles').delete().eq('user_id', testUserId);
            info.profilesTable.canInsert = true;
          } else {
            info.profilesTable.canInsert = false;
            info.profilesTable.insertError = insertError.message;

            if (insertError.message?.includes('permission denied') || insertError.message?.includes('RLS')) {
              info.commonIssues.push('🔐 RLS policies prevent profile creation - check profiles table policies');
            }
          }
        } catch (insertTestError) {
          info.profilesTable.canInsert = false;
          info.profilesTable.insertError = 'Cannot test insert';
        }

      } catch (profileCheckError) {
        info.profilesTable = {
          exists: false,
          accessible: false,
          error: 'Connection failed',
          canInsert: false
        };
        info.errors.push('Cannot check profiles table: ' + (profileCheckError instanceof Error ? profileCheckError.message : 'Unknown error'));
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
                        {debugInfo.signupTest.error && (
                          <div className="mt-1 text-xs text-green-600">
                            {debugInfo.signupTest.error}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Badge variant="destructive" className="text-xs">
                          Failed
                        </Badge>
                        <div className="text-xs space-y-1">
                          <div className="font-mono text-red-600">
                            {debugInfo.signupTest.error || 'Unknown error'}
                          </div>
                          {debugInfo.signupTest.errorCode && (
                            <div>Code: <Badge variant="outline" className="text-xs">{debugInfo.signupTest.errorCode}</Badge></div>
                          )}
                        </div>
                      </div>
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

            {/* Common Issues */}
            {debugInfo.commonIssues && debugInfo.commonIssues.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-yellow-600">Common Issues Found</span>
                </div>
                <div className="text-sm space-y-1">
                  {debugInfo.commonIssues.map((issue: string, index: number) => (
                    <div key={index} className="p-2 bg-yellow-50 text-yellow-700 rounded text-xs">
                      💡 {issue}
                    </div>
                  ))}
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
