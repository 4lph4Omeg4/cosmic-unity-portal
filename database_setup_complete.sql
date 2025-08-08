-- Complete database setup for SH4M4NI4K app
-- Run this in your Supabase SQL editor to fix "Database error saving new user"

-- ================================
-- 1. PROFILES TABLE (REQUIRED FOR USER SIGNUP)
-- ================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Enable Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

-- ================================
-- 2. AUTOMATIC PROFILE CREATION TRIGGER
-- ================================

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, do nothing
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error and continue (don't block user creation)
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ================================
-- 3. MESSAGES TABLE
-- ================================

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(read);

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages table
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to anyone" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages they received" ON public.messages;

CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages to anyone" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they received" ON public.messages
    FOR UPDATE USING (receiver_id = auth.uid());

-- ================================
-- 4. COMMUNITY POSTS TABLE
-- ================================

-- Create posts table (if needed for community)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for posts table
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for posts table
DROP POLICY IF EXISTS "Users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Users can view all posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON public.posts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (user_id = auth.uid());

-- ================================
-- 5. HELPER FUNCTIONS
-- ================================

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ================================
-- 6. VERIFICATION QUERIES
-- ================================

-- Check if everything was created successfully
SELECT 'Tables created successfully!' as status;

-- Verify tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'profiles' THEN '✅ Required for user signup'
        WHEN table_name = 'messages' THEN '✅ Required for messaging'
        WHEN table_name = 'posts' THEN '✅ Required for community'
        ELSE '✅ Created'
    END as purpose
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'messages', 'posts')
ORDER BY table_name;

-- Verify trigger exists
SELECT 
    trigger_name,
    event_object_table,
    '✅ Automatic profile creation enabled' as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
