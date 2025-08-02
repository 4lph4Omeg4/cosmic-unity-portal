-- Add image_url column to posts table
ALTER TABLE public.posts 
ADD COLUMN image_url TEXT;