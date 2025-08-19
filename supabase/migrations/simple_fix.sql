-- Simple fix for overly restrictive RLS policies
-- Only fix the profiles table that we know exists

-- Restore original profile viewing policy
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

-- Allow users to view other profiles (needed for friends, messages, etc.)
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

-- Restore original profile update policy
DROP POLICY IF EXISTS "Admins can update roles" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

-- Allow profile insertion (needed for new users)
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Fix messages table policies (only if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
        DROP POLICY IF EXISTS "Users can send messages to anyone" ON public.messages;
        DROP POLICY IF EXISTS "Users can update messages they received" ON public.messages;
        
        -- Create working policies
        CREATE POLICY "Users can view their own messages" ON public.messages
            FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

        CREATE POLICY "Users can send messages to anyone" ON public.messages
            FOR INSERT WITH CHECK (sender_id = auth.uid());

        CREATE POLICY "Users can update messages they received" ON public.messages
            FOR UPDATE USING (receiver_id = auth.uid());
    END IF;
END $$;
