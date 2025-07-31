-- Check current RLS policies for posts table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'posts';

-- Enable select policy for posts (users can view all posts)
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts 
FOR SELECT 
USING (true);