-- Add social media integration support
-- This migration adds tables and columns for social media connections and scheduling

-- Create social_connections table
CREATE TABLE IF NOT EXISTS public.social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'
  platform_user_id VARCHAR(255), -- The user's ID on the social platform
  platform_username VARCHAR(255), -- The user's username on the social platform
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT, -- OAuth scopes granted
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one connection per platform per user
  UNIQUE(user_id, platform)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_connections_user_id ON public.social_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_platform ON public.social_connections(platform);
CREATE INDEX IF NOT EXISTS idx_social_connections_active ON public.social_connections(is_active) WHERE is_active = true;

-- Add RLS policies for social_connections
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

-- Users can only see their own connections
CREATE POLICY "Users can view own social connections" ON public.social_connections
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own connections
CREATE POLICY "Users can insert own social connections" ON public.social_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own connections
CREATE POLICY "Users can update own social connections" ON public.social_connections
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete own social connections" ON public.social_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Add columns to user_previews table for scheduling and social platforms
ALTER TABLE public.user_previews 
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS social_platforms JSONB DEFAULT '[]'::jsonb, -- Array of platforms to publish to
ADD COLUMN IF NOT EXISTS social_posts JSONB DEFAULT '{}'::jsonb, -- Platform-specific post data
ADD COLUMN IF NOT EXISTS publish_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS publish_error TEXT;

-- Add indexes for scheduling queries
CREATE INDEX IF NOT EXISTS idx_user_previews_scheduled_publish ON public.user_previews(scheduled_publish_at) 
  WHERE scheduled_publish_at IS NOT NULL AND publish_status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_user_previews_publish_status ON public.user_previews(publish_status);

-- Create social_posts table for tracking individual platform posts
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  preview_id UUID NOT NULL REFERENCES public.user_previews(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_post_id VARCHAR(255), -- ID of the post on the social platform
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'published', 'failed'
  published_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for social_posts
CREATE INDEX IF NOT EXISTS idx_social_posts_preview_id ON public.social_posts(preview_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON public.social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON public.social_posts(status);

-- Add RLS policies for social_posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Users can view social posts for their previews
CREATE POLICY "Users can view social posts for own previews" ON public.social_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_previews 
      WHERE user_previews.id = social_posts.preview_id 
      AND user_previews.user_id = auth.uid()
    )
  );

-- Users can insert social posts for their previews
CREATE POLICY "Users can insert social posts for own previews" ON public.social_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_previews 
      WHERE user_previews.id = social_posts.preview_id 
      AND user_previews.user_id = auth.uid()
    )
  );

-- Users can update social posts for their previews
CREATE POLICY "Users can update social posts for own previews" ON public.social_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_previews 
      WHERE user_previews.id = social_posts.preview_id 
      AND user_previews.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_social_connections_updated_at 
  BEFORE UPDATE ON public.social_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at 
  BEFORE UPDATE ON public.social_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- This will be removed in production
INSERT INTO public.social_connections (user_id, platform, platform_username, access_token, scope, is_active)
SELECT 
  user_id,
  'instagram' as platform,
  'timeline_alchemy_test' as platform_username,
  'test_token_' || gen_random_uuid() as access_token,
  'user_profile,user_media' as scope,
  true as is_active
FROM public.profiles 
WHERE role = 'client' 
LIMIT 1
ON CONFLICT (user_id, platform) DO NOTHING;
