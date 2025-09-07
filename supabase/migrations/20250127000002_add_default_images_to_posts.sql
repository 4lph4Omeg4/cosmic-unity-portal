-- Add additional_images field to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS additional_images JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS posts_additional_images_idx ON public.posts USING gin (additional_images) WHERE additional_images != '[]'::jsonb;

-- Update existing posts to have the default images
UPDATE public.posts 
SET 
  image_url = 'cosmic-utopia.png',
  additional_images = '["cyberpunk-dystopia.png"]'::jsonb
WHERE image_url IS NULL OR image_url = '';

-- Create a function to set default images for new posts
CREATE OR REPLACE FUNCTION set_default_post_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default images if none are provided
  IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
    NEW.image_url := 'cosmic-utopia.png';
  END IF;
  
  IF NEW.additional_images IS NULL OR NEW.additional_images = '[]'::jsonb THEN
    NEW.additional_images := '["cyberpunk-dystopia.png"]'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set default images
DROP TRIGGER IF EXISTS set_default_post_images_trigger ON public.posts;
CREATE TRIGGER set_default_post_images_trigger
  BEFORE INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION set_default_post_images();

-- Update the posts table to ensure all existing posts have the default images
UPDATE public.posts 
SET 
  image_url = COALESCE(image_url, 'cosmic-utopia.png'),
  additional_images = CASE 
    WHEN additional_images IS NULL OR additional_images = '[]'::jsonb 
    THEN '["cyberpunk-dystopia.png"]'::jsonb 
    ELSE additional_images 
  END
WHERE image_url IS NULL OR image_url = '' OR additional_images IS NULL OR additional_images = '[]'::jsonb;
