-- Create profile for existing user (if there are any existing users without profiles)
INSERT INTO public.profiles (user_id, display_name, avatar_url)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)),
  NULL
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL;

-- Update the profiles RLS policy to fix the issue
-- The current policy checks against 'id' but should check against 'user_id'
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);