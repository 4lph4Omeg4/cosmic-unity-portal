-- Reset test organizations for easier testing
-- This script resets test orgs to their initial state

-- Reset all test organizations (those starting with 'tla_')
UPDATE public.orgs 
SET 
  tla_client = true,
  needs_onboarding = true,
  onboarding_completed = false,
  updated_at = NOW()
WHERE 
  id LIKE 'tla_%';

-- Reset the main timeline-alchemy org (admin org)
UPDATE public.orgs 
SET 
  tla_client = false,
  needs_onboarding = false,
  onboarding_completed = true,
  updated_at = NOW()
WHERE 
  id = 'timeline-alchemy';

-- Clean up test profiles (optional - uncomment if needed)
-- DELETE FROM public.profiles WHERE email LIKE '%test%' OR email LIKE '%example%';

-- Show current state
SELECT 
  id, 
  name, 
  tla_client, 
  needs_onboarding, 
  onboarding_completed,
  created_at
FROM public.orgs 
ORDER BY created_at DESC;
