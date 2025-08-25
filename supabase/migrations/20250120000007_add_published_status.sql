-- Add support for 'published' status in previews table
-- This allows tracking when content has been successfully published

-- Update the status check constraint to include 'published'
ALTER TABLE public.previews DROP CONSTRAINT IF EXISTS previews_status_check;

ALTER TABLE public.previews ADD CONSTRAINT previews_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected', 'published'));

-- Add a published_at timestamp column to track when content was published
ALTER TABLE public.previews ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Add an index on published_at for better query performance
CREATE INDEX IF NOT EXISTS idx_previews_published_at ON public.previews(published_at);

-- Add an index on status for better filtering performance
CREATE INDEX IF NOT EXISTS idx_previews_status ON public.previews(status);
