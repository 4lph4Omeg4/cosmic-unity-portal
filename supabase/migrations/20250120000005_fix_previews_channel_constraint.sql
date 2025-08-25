-- Fix previews table channel constraint to allow multiple platforms
-- This migration removes the restrictive check constraint and allows any text value

-- Drop the existing check constraint
ALTER TABLE public.previews DROP CONSTRAINT IF EXISTS previews_channel_check;

-- The channel column can now accept any text value, including comma-separated platform lists
-- This allows storing multiple platforms like 'Facebook, Instagram, LinkedIn' in a single field

-- Note: In a production environment, you might want to consider:
-- 1. Creating a separate preview_platforms junction table for many-to-many relationship
-- 2. Using JSONB arrays for the channel field
-- 3. Or keeping the current approach with comma-separated values

-- For now, this fix allows the current implementation to work
