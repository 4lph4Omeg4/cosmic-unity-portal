-- Add admin flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Make existing admin users admin
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE role = 'admin';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON public.profiles (is_admin);
