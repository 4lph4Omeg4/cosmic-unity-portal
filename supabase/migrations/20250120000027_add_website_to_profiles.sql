-- Add website column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add comment to the column
COMMENT ON COLUMN public.profiles.website IS 'User website URL';
