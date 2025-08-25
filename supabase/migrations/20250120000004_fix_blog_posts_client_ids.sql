-- Fix blog_posts client_id references to match new client IDs from profiles table
-- This connects existing blog posts to the actual client accounts

-- ================================
-- 1. SHOW CURRENT SITUATION
-- ================================

-- Show current blog posts and their client_id
SELECT 
    id,
    title,
    client_id,
    'Current blog post' as status
FROM public.blog_posts
ORDER BY created_at;

-- Show available client IDs from profiles
SELECT 
    user_id,
    display_name,
    role,
    'Available client' as status
FROM public.profiles 
WHERE role = 'client'
ORDER BY created_at;

-- ================================
-- 2. UPDATE BLOG POSTS CLIENT_ID
-- ================================

-- Update blog posts to use the first client's user_id
UPDATE public.blog_posts 
SET client_id = (
    SELECT user_id 
    FROM public.profiles 
    WHERE role = 'client' 
    ORDER BY created_at 
    LIMIT 1
)
WHERE client_id = '1c75c839-87a9-46ad-8fe7-5c4cfb68a1db';

-- ================================
-- 3. VERIFICATION
-- ================================

-- Show updated blog posts
SELECT 
    id,
    title,
    client_id,
    'Updated blog post' as status
FROM public.blog_posts
ORDER BY created_at;

-- Show the client that blog posts now reference
SELECT 
    p.user_id,
    p.display_name,
    p.role,
    'Client for blog posts' as status
FROM public.profiles p
WHERE p.user_id = (
    SELECT client_id 
    FROM public.blog_posts 
    LIMIT 1
);
