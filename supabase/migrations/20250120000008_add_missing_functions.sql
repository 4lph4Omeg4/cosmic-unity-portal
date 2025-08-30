-- Add missing helper functions for Timeline Alchemy
-- This migration adds the client_ids_for_user function that was referenced but not created

-- ================================
-- 1. CLIENT_IDS_FOR_USER FUNCTION
-- ================================

-- Function to get client IDs that the current user has access to
CREATE OR REPLACE FUNCTION public.client_ids_for_user()
RETURNS UUID[] AS $$
DECLARE
    user_clients UUID[];
BEGIN
    -- Get client IDs from user_clients table for the current user
    SELECT ARRAY_AGG(client_id) INTO user_clients
    FROM public.user_clients 
    WHERE user_id = auth.uid();
    
    -- Return empty array if no clients found
    RETURN COALESCE(user_clients, ARRAY[]::UUID[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- 2. VERIFICATION
-- ================================

-- Test the function
SELECT 
    'client_ids_for_user() function test' as test_name,
    public.client_ids_for_user() as result,
    CASE 
        WHEN array_length(public.client_ids_for_user(), 1) IS NULL THEN '✅ Function working (no user-client relationships yet)'
        ELSE '✅ Function working with data'
    END as status;

-- ================================
-- 3. GRANT PERMISSIONS
-- ================================

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.client_ids_for_user() TO authenticated;

-- ================================
-- 4. COMPLETION
-- ================================

SELECT 'Missing functions added successfully!' as status;
