-- Fix profiles table and add role column
-- Run this BEFORE the main Timeline Alchemy migration

-- ================================
-- 1. CHECK IF PROFILES TABLE EXISTS
-- ================================

-- First, check if profiles table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Create profiles table if it doesn't exist
        CREATE TABLE public.profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
            display_name TEXT,
            avatar_url TEXT,
            bio TEXT,
            role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client', 'reviewer')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        
        -- Create indexes
        CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
        
        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Users can view their own profile" ON public.profiles
            FOR SELECT USING (user_id = auth.uid());
        
        CREATE POLICY "Users can insert their own profile" ON public.profiles
            FOR INSERT WITH CHECK (user_id = auth.uid());
        
        CREATE POLICY "Users can update their own profile" ON public.profiles
            FOR UPDATE USING (user_id = auth.uid());
        
        RAISE NOTICE 'Profiles table created successfully';
    ELSE
        RAISE NOTICE 'Profiles table already exists';
    END IF;
END $$;

-- ================================
-- 2. ADD ROLE COLUMN IF IT DOESN'T EXIST
-- ================================

-- Add role column to existing profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client', 'reviewer'));
        RAISE NOTICE 'Role column added to profiles table';
    ELSE
        RAISE NOTICE 'Role column already exists in profiles table';
    END IF;
END $$;

-- ================================
-- 3. VERIFY PROFILES TABLE STRUCTURE
-- ================================

-- Show current profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'role' THEN '✅ Role column exists'
        ELSE '✅ Column exists'
    END as status
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================
-- 4. CREATE TRIGGER FOR AUTO PROFILE CREATION
-- ================================

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'client',
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
-- 5. VERIFICATION
-- ================================

SELECT 'Profiles table setup completed successfully!' as status;

-- Check if trigger exists
SELECT 
    trigger_name,
    event_object_table,
    '✅ Auto profile creation enabled' as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
