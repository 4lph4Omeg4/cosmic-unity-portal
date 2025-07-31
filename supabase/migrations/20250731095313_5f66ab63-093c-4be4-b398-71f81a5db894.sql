-- Add SELECT policy for posts so users can view all posts
CREATE POLICY "Users can view all posts" 
ON public.posts 
FOR SELECT 
USING (true);