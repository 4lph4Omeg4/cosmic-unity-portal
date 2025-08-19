-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'client', 'user'));

-- Set the specific email as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'sh4m4ni4k@sh4m4ni4k.nl'
);

-- Create index on role for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update RLS policies to allow role-based access
-- Users can view their own profile and admin profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view profiles" ON public.profiles
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can update role field
CREATE POLICY "Admins can update roles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
