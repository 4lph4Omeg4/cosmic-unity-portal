-- Make specific user admin (replace with your actual user_id)
-- You can find your user_id in the auth.users table or profiles table

-- Option 1: If you know your user_id, replace 'YOUR_USER_ID_HERE' with it
-- UPDATE public.profiles 
-- SET is_admin = TRUE 
-- WHERE user_id = 'YOUR_USER_ID_HERE';

-- Option 2: Make all users with role = 'admin' admin (if you have that)
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE role = 'admin';

-- Option 3: Make all users admin for testing (temporary)
-- UPDATE public.profiles 
-- SET is_admin = TRUE;
