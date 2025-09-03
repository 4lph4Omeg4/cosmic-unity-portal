-- Add TikTok and YouTube columns to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS tiktok TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_tiktok_idx ON public.blog_posts (tiktok);
CREATE INDEX IF NOT EXISTS blog_posts_youtube_idx ON public.blog_posts (youtube);

-- Update existing posts with sample content for TikTok and YouTube
UPDATE public.blog_posts 
SET 
  tiktok = COALESCE(tiktok, 'Sample TikTok content for ' || COALESCE(title, 'this post')),
  youtube = COALESCE(youtube, 'Sample YouTube content for ' || COALESCE(title, 'this post'))
WHERE tiktok IS NULL OR youtube IS NULL;
