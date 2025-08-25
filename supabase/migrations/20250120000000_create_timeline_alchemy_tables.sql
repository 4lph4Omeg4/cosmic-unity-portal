-- Create Timeline Alchemy tables for preview system
-- Run this AFTER the profiles fix migration
-- Run this in your Supabase SQL editor

-- ================================
-- 1. ORGANIZATIONS TABLE
-- ================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================
-- 2. CLIENTS TABLE
-- ================================

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contact_email TEXT
);

-- ================================
-- 3. USER CLIENTS TABLE (Many-to-many relationship)
-- ================================

CREATE TABLE IF NOT EXISTS public.user_clients (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, client_id)
);

-- ================================
-- 4. IDEAS TABLE (Blog posts/content ideas)
-- ================================

CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ================================
-- 5. PREVIEWS TABLE (Content previews for client approval)
-- ================================

CREATE TABLE IF NOT EXISTS public.previews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('Facebook', 'Instagram', 'X (Twitter)', 'LinkedIn', 'Blog Post', 'Custom Post')),
    template TEXT NOT NULL,
    draft_content JSONB NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    client_feedback TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- ================================
-- 6. PUBLISHES TABLE (Published content tracking)
-- ================================

CREATE TABLE IF NOT EXISTS public.publishes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preview_id UUID NOT NULL REFERENCES public.previews(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'posted' CHECK (status IN ('posted', 'failed')),
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================
-- 7. SOCIAL TOKENS TABLE (Social media connections)
-- ================================

CREATE TABLE IF NOT EXISTS public.social_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin')),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================
-- 8. BLOG POSTS TABLE (Extended content for social media)
-- ================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    excerpt TEXT,
    category TEXT,
    facebook TEXT,
    instagram TEXT,
    x TEXT,
    linkedin TEXT,
    featured_image TEXT,
    image_url TEXT,
    image_public_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ================================
-- 9. VERIFICATION
-- ================================

-- Check if everything was created successfully
SELECT 'Timeline Alchemy tables created successfully!' as status;

-- Verify tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'organizations' THEN '✅ Organizations management'
        WHEN table_name = 'clients' THEN '✅ Client management'
        WHEN table_name = 'user_clients' THEN '✅ User-client relationships'
        WHEN table_name = 'ideas' THEN '✅ Content ideas'
        WHEN table_name = 'previews' THEN '✅ Content previews'
        WHEN table_name = 'publishes' THEN '✅ Publishing tracking'
        WHEN table_name = 'social_tokens' THEN '✅ Social media connections'
        WHEN table_name = 'blog_posts' THEN '✅ Blog content'
        ELSE '✅ Created'
    END as purpose
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'clients', 'user_clients', 'ideas', 'previews', 'publishes', 'social_tokens', 'blog_posts')
ORDER BY table_name;

-- ================================
-- 10. ROW LEVEL SECURITY (RLS) - ENABLE ONLY
-- ================================

-- Enable RLS on all tables (policies will be created separately)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ================================
-- 11. HELPER FUNCTIONS
-- ================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



