-- Fix overly restrictive RLS policies
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

-- Fix messages table policies if they exist
-- Allow users to view messages they're involved in
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Allow users to send messages
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Allow users to update messages they received
CREATE POLICY "Users can update received messages" ON public.messages
    FOR UPDATE USING (receiver_id = auth.uid());

-- Fix friends table policies if they exist
-- Allow users to view friends
CREATE POLICY "Users can view friends" ON public.friends
    FOR SELECT USING (true);

-- Allow users to manage their own friend relationships
CREATE POLICY "Users can manage their own friends" ON public.friends
    FOR ALL USING (user_id = auth.uid() OR friend_id = auth.uid());
