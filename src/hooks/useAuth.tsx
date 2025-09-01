import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    console.log('=== SUPABASE SIGNUP ATTEMPT ===');
    console.log('Redirect URL:', redirectUrl);
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Display name:', displayName);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || email.split('@')[0]
          }
        }
      });

      // Check if email confirmation is required
      if (data?.user && !data.user.email_confirmed_at) {
        console.log('Email confirmation required. User needs to verify email.');
        console.log('User email confirmed at:', data.user.email_confirmed_at);
        console.log('User confirmed at:', data.user.confirmed_at);
      }

      console.log('=== SUPABASE SIGNUP RESPONSE ===');
      console.log('Data:', data);
      console.log('Error:', error);
      console.log('Error serialized:', error ? JSON.stringify(error, null, 2) : 'No error');

      if (data?.user && !error) {
        console.log('User created successfully:', data.user);
        console.log('User ID:', data.user.id);
        console.log('User email:', data.user.email);
        console.log('Email confirmed:', data.user.email_confirmed_at);
        console.log('User confirmed:', data.user.confirmed_at);

        // Try to manually create profile if it doesn't exist (fallback for trigger failure)
        try {
          console.log('=== CHECKING/CREATING PROFILE ===');

          // First check if profile already exists
          const { data: existingProfile, error: profileCheckError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', data.user.id)
            .single();

          if (profileCheckError && profileCheckError.code === 'PGRST116') {
            // Profile doesn't exist, create it manually
            console.log('Profile does not exist, creating manually...');

            const { error: profileCreateError } = await supabase
              .from('profiles')
              .insert({
                user_id: data.user.id,
                display_name: displayName || data.user.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (profileCreateError) {
              console.error('Manual profile creation failed:', profileCreateError);
            } else {
              console.log('✅ Profile created manually');
            }
          } else if (!profileCheckError) {
            console.log('✅ Profile already exists');
          } else {
            console.error('Profile check failed:', profileCheckError);
          }
        } catch (profileError) {
          console.error('Profile creation fallback failed:', profileError);
        }
      }

      // Add additional context to the error
      if (error) {
        console.error('=== DETAILED ERROR ANALYSIS ===');
        console.error('Error type:', typeof error);
        console.error('Error constructor:', error.constructor.name);
        console.error('Error keys:', Object.keys(error));
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error status:', error.status);

        // Check for common Supabase error patterns
        if (error.message?.includes('Database error saving new user') || error.code === 'unexpected_failure') {
          console.error('❌ DATABASE SETUP ERROR: The profiles table or trigger is missing!');
          console.error('🔧 SOLUTION: Run the SQL script from create_tables.sql in your Supabase dashboard');
          console.error('📋 This creates the profiles table and automatic profile creation trigger');
        } else if (error.message?.includes('email_address_not_authorized')) {
          console.error('❌ EMAIL NOT AUTHORIZED: Check Supabase Auth settings - Email domain restrictions might be enabled');
        } else if (error.message?.includes('rate_limit')) {
          console.error('❌ RATE LIMITED: Too many signup attempts, wait before retrying');
        } else if (!error.message && error.code) {
          console.error('❌ UNKNOWN ERROR: Only error code available:', error.code);
        }
      }

      return { error };
    } catch (catchError) {
      console.error('Caught error during signup:', catchError);
      return { error: catchError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
