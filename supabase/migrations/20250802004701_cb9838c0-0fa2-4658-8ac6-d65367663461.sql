-- Fix auth RLS initialization plan issue for profiles table
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING ((select auth.uid()) = user_id);

-- Remove duplicate SELECT policy on posts table to fix multiple permissive policies warning
DROP POLICY IF EXISTS "dashboard_user_can_select_posts" ON public.posts;