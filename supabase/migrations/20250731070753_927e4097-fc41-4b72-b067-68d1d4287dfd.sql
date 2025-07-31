-- Create foreign key constraints that don't already exist
-- Check if constraints exist first and only add missing ones

-- Add foreign key from comments to posts if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'comments_post_id_fkey' 
        AND table_name = 'comments'
    ) THEN
        ALTER TABLE public.comments 
        ADD CONSTRAINT comments_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES public.posts(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key from likes to posts if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'likes_post_id_fkey' 
        AND table_name = 'likes'
    ) THEN
        ALTER TABLE public.likes 
        ADD CONSTRAINT likes_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES public.posts(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance (these are safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);