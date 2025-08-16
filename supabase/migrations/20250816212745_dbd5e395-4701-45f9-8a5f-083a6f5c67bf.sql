-- Add social_links column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN social_links jsonb DEFAULT '{}'::jsonb;

-- Update existing profiles to have empty social_links object
UPDATE public.profiles 
SET social_links = '{}'::jsonb 
WHERE social_links IS NULL;