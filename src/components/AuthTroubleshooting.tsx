import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Settings, Mail, Shield } from 'lucide-react';

const AuthTroubleshooting = () => {
  return (
    <Card className="mt-4 bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Troubleshooting Guide
        </CardTitle>
        <CardDescription>
          Common solutions for signup issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Database Setup Error */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="font-medium">Database Error Saving New User</span>
          </div>
          <div className="text-sm space-y-2 pl-6">
            <p>If you get "Database error saving new user" (most common issue):</p>
            <div className="bg-red-50 p-3 rounded text-xs space-y-2">
              <p><strong>Missing profiles table or trigger:</strong></p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Run the SQL script:</strong> Execute create_tables.sql in your Supabase SQL Editor</li>
                <li><strong>Check profiles table:</strong> Make sure the profiles table exists</li>
                <li><strong>Check trigger:</strong> Ensure automatic profile creation trigger exists</li>
                <li><strong>Check RLS policies:</strong> Users must be able to INSERT their own profile</li>
                <li><strong>Typical solution:</strong> Copy the SQL from create_tables.sql and run it in Supabase</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Email Confirmation Settings</span>
          </div>
          <div className="text-sm space-y-2 pl-6">
            <p>If signup appears to work but users can't login:</p>
            <div className="bg-blue-50 p-3 rounded text-xs space-y-2">
              <p><strong>Supabase Dashboard → Authentication → Settings:</strong></p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Check "Enable email confirmations" setting</li>
                <li>If enabled: Users need to click email confirmation link</li>
                <li>If disabled: Users can login immediately</li>
                <li>For development: Consider disabling email confirmations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="font-medium">Rate Limiting</span>
          </div>
          <div className="text-sm space-y-2 pl-6">
            <p>If you get "rate limit exceeded" errors:</p>
            <div className="bg-orange-50 p-3 rounded text-xs space-y-2">
              <ul className="space-y-1 list-disc list-inside">
                <li>Wait 15-60 seconds between signup attempts</li>
                <li>Don't test with the same email multiple times</li>
                <li>Check Supabase Auth → Settings → Rate Limits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email Provider */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="font-medium">Email Provider Issues</span>
          </div>
          <div className="text-sm space-y-2 pl-6">
            <p>If emails are not being sent:</p>
            <div className="bg-red-50 p-3 rounded text-xs space-y-2">
              <ul className="space-y-1 list-disc list-inside">
                <li>Check spam/junk folder</li>
                <li>Supabase free tier has limited email sending</li>
                <li>Consider setting up custom SMTP in Supabase Auth settings</li>
                <li>For development: Disable email confirmations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RLS Policies */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="font-medium">Row Level Security (RLS)</span>
          </div>
          <div className="text-sm space-y-2 pl-6">
            <p>Ensure profiles table has correct policies:</p>
            <div className="bg-green-50 p-3 rounded text-xs space-y-2">
              <ul className="space-y-1 list-disc list-inside">
                <li>Users should be able to INSERT their own profile</li>
                <li>Users should be able to SELECT their own profile</li>
                <li>Check the create_tables.sql for correct policies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Fixes */}
        <div className="bg-gradient-to-r from-red/10 to-orange/10 p-4 rounded-lg border border-red/20">
          <h4 className="font-medium mb-2 text-red-700">🚨 Most Common Fix for "Database error saving new user":</h4>
          <div className="text-sm space-y-2 mb-4">
            <div className="bg-white p-3 rounded border-l-4 border-red-500">
              <p className="font-bold">1. Run the database setup SQL script</p>
              <p className="text-xs text-gray-600 mt-1">
                Go to Supabase → SQL Editor → New Query → Paste the contents of create_tables.sql → Run
              </p>
            </div>
          </div>

          <h4 className="font-medium mb-2">Other Quick Development Fixes:</h4>
          <div className="text-sm space-y-1">
            <p>2. <strong>Disable email confirmations</strong> in Supabase Auth settings</p>
            <p>3. <strong>Use real email addresses</strong> for testing (not fake ones)</p>
            <p>4. <strong>Check browser console</strong> for detailed error messages</p>
            <p>5. <strong>Try incognito mode</strong> to rule out browser cache issues</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTroubleshooting;
