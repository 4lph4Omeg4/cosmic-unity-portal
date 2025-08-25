-- Test Timeline Alchemy tables and add sample data
-- Run this after the main migration to test the system

-- ================================
-- 1. TEST TABLES EXIST
-- ================================

-- Check if all tables were created
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'organizations' THEN '✅ Organizations table exists'
        WHEN table_name = 'clients' THEN '✅ Clients table exists'
        WHEN table_name = 'user_clients' THEN '✅ User clients table exists'
        WHEN table_name = 'ideas' THEN '✅ Ideas table exists'
        WHEN table_name = 'previews' THEN '✅ Previews table exists'
        WHEN table_name = 'publishes' THEN '✅ Publishes table exists'
        WHEN table_name = 'social_tokens' THEN '✅ Social tokens table exists'
        WHEN table_name = 'blog_posts' THEN '✅ Blog posts table exists'
        ELSE '✅ Table exists'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('organizations', 'clients', 'user_clients', 'ideas', 'previews', 'publishes', 'social_tokens', 'blog_posts')
ORDER BY table_name;

-- ================================
-- 2. TEST SAMPLE DATA INSERTION
-- ================================

-- Insert test organization
INSERT INTO public.organizations (name, metadata) VALUES 
('Test Organization', '{"description": "Test organization for development and testing"}')
ON CONFLICT DO NOTHING;

-- Insert test client
INSERT INTO public.clients (org_id, name, contact_email) VALUES 
((SELECT id FROM public.organizations WHERE name = 'Test Organization' LIMIT 1), 'Test Client', 'test@example.com')
ON CONFLICT DO NOTHING;

-- Insert test blog post
INSERT INTO public.blog_posts (title, body, excerpt, facebook, instagram, x, linkedin, status) VALUES 
('Test Blog Post', 'This is a test blog post for testing the preview system.', 'Test excerpt for preview system', 'Test Facebook content', 'Test Instagram content', 'Test X content', 'Test LinkedIn content', 'draft')
ON CONFLICT DO NOTHING;

-- ================================
-- 3. TEST HELPER FUNCTIONS
-- ================================

-- Test is_admin function (should return false for now)
SELECT 
    'is_admin() function test' as test_name,
    public.is_admin() as result,
    CASE 
        WHEN public.is_admin() = false THEN '✅ Expected result (no admin users yet)'
        ELSE '❌ Unexpected result'
    END as status;

-- Test client_ids_for_user function (should return empty array for now)
SELECT 
    'client_ids_for_user() function test' as test_name,
    public.client_ids_for_user() as result,
    CASE 
        WHEN array_length(public.client_ids_for_user(), 1) IS NULL THEN '✅ Expected result (no user-client relationships yet)'
        ELSE '❌ Unexpected result'
    END as status;

-- ================================
-- 4. VERIFY SAMPLE DATA
-- ================================

-- Check organizations
SELECT 'Organizations' as table_name, COUNT(*) as count FROM public.organizations;

-- Check clients
SELECT 'Clients' as table_name, COUNT(*) as count FROM public.clients;

-- Check blog posts
SELECT 'Blog Posts' as table_name, COUNT(*) as count FROM public.blog_posts;

-- ================================
-- 5. TEST RLS POLICIES
-- ================================

-- Check RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS enabled'
        ELSE '❌ RLS disabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('organizations', 'clients', 'user_clients', 'ideas', 'previews', 'publishes', 'social_tokens', 'blog_posts')
ORDER BY tablename;

-- ================================
-- 6. NEXT STEPS FOR TESTING
-- ================================

SELECT 
    'Next steps for testing:' as instruction,
    '1. Create a user account and log in' as step1,
    '2. Add role to profiles table: UPDATE profiles SET role = ''admin'' WHERE user_id = ''YOUR_USER_ID''' as step2,
    '3. Link user to client: INSERT INTO user_clients (user_id, client_id) VALUES (''YOUR_USER_ID'', (SELECT id FROM clients LIMIT 1))' as step3,
    '4. Test the preview system in the app' as step4;

-- ================================
-- 7. CLEANUP (Optional)
-- ================================

-- Uncomment these lines if you want to remove test data
-- DELETE FROM public.blog_posts WHERE title = 'Test Blog Post';
-- DELETE FROM public.clients WHERE name = 'Test Client';
-- DELETE FROM public.organizations WHERE name = 'Test Organization';
