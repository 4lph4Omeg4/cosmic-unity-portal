-- Add RLS policies for Timeline Alchemy tables
-- Run this AFTER the main tables migration

-- ================================
-- 1. ORGANIZATIONS POLICIES
-- ================================

-- Organizations: Admins can view all, clients can view their own
CREATE POLICY "Organizations are viewable by admins and associated clients" ON public.organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.user_clients uc
            JOIN public.clients c ON uc.client_id = c.id
            WHERE uc.user_id = auth.uid() AND c.org_id = id
        )
    );

-- ================================
-- 2. CLIENTS POLICIES
-- ================================

-- Clients: Admins can view all, clients can view their own
CREATE POLICY "Clients are viewable by admins and associated users" ON public.clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.user_clients 
            WHERE user_id = auth.uid() AND client_id = id
        )
    );

-- ================================
-- 3. USER CLIENTS POLICIES
-- ================================

-- User clients: Users can view their own relationships
CREATE POLICY "Users can view their own client relationships" ON public.user_clients
    FOR SELECT USING (user_id = auth.uid());

-- ================================
-- 4. IDEAS POLICIES
-- ================================

-- Ideas: Admins can view all, users can view their own
CREATE POLICY "Ideas are viewable by admins and creators" ON public.ideas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        ) OR
        created_by = auth.uid()
    );

-- ================================
-- 5. PREVIEWS POLICIES
-- ================================

-- Previews: Admins can view all, clients can view their own
CREATE POLICY "Previews are viewable by admins and associated clients" ON public.previews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.user_clients 
            WHERE user_id = auth.uid() AND client_id = previews.client_id
        )
    );

-- Previews: Admins can create/update, clients can update status
CREATE POLICY "Previews can be created by admins" ON public.previews
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Previews can be updated by admins and clients" ON public.previews
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.user_clients 
            WHERE user_id = auth.uid() AND client_id = previews.client_id
        )
    );

-- ================================
-- 6. PUBLISHES POLICIES
-- ================================

-- Publishes: Admins can view all
CREATE POLICY "Publishes are viewable by admins" ON public.publishes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ================================
-- 7. SOCIAL TOKENS POLICIES
-- ================================

-- Social tokens: Users can manage their own
CREATE POLICY "Users can manage their own social tokens" ON public.social_tokens
    FOR ALL USING (user_id = auth.uid());

-- ================================
-- 8. BLOG POSTS POLICIES
-- ================================

-- Blog posts: Admins can view all (existing blog posts don't have created_by column)
CREATE POLICY "Blog posts are viewable by admins" ON public.blog_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Blog posts: Admins can create/update/delete
CREATE POLICY "Blog posts can be managed by admins" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- ================================
-- 9. VERIFICATION
-- ================================

SELECT 'RLS policies added successfully!' as status;
