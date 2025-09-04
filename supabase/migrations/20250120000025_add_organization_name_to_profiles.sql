-- Add organization_name column to profiles table and set up client organizations
-- This migration adds organization_name to profiles and creates the specific client organizations

-- Add organization_name column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS organization_name TEXT;

-- Create the specific client organizations
INSERT INTO public.orgs (id, name, created_at, updated_at, tla_client, needs_onboarding, onboarding_completed) 
VALUES 
  ('galactic-federation', 'Galactic Federation', NOW(), NOW(), true, false, true),
  ('source', 'Source', NOW(), NOW(), true, false, true),
  ('gfl', 'GFL', NOW(), NOW(), true, false, true)
ON CONFLICT (id) DO NOTHING;

-- Update existing profiles with organization names based on display_name patterns
-- This is a best-effort mapping based on common patterns
UPDATE public.profiles 
SET organization_name = 'Galactic Federation'
WHERE display_name ILIKE '%galactic%' 
   OR display_name ILIKE '%federation%'
   OR email ILIKE '%galactic%'
   OR email ILIKE '%federation%';

UPDATE public.profiles 
SET organization_name = 'Source'
WHERE display_name ILIKE '%multidimensional%' 
   OR display_name ILIKE '%datacollector%'
   OR display_name ILIKE '%source%'
   OR email ILIKE '%multidimensional%'
   OR email ILIKE '%datacollector%'
   OR email ILIKE '%source%';

UPDATE public.profiles 
SET organization_name = 'GFL'
WHERE display_name ILIKE '%smith%'
   OR display_name ILIKE '%gfl%'
   OR email ILIKE '%smith%'
   OR email ILIKE '%gfl%';

-- Link profiles to their organizations
UPDATE public.profiles 
SET org_id = 'galactic-federation'
WHERE organization_name = 'Galactic Federation'
AND org_id IS NULL;

UPDATE public.profiles 
SET org_id = 'source'
WHERE organization_name = 'Source'
AND org_id IS NULL;

UPDATE public.profiles 
SET org_id = 'gfl'
WHERE organization_name = 'GFL'
AND org_id IS NULL;

-- Set role to 'client' for these profiles
UPDATE public.profiles 
SET role = 'client'
WHERE organization_name IN ('Galactic Federation', 'Source', 'GFL')
AND role IS NULL;

-- Show the results
SELECT 
    p.user_id,
    p.display_name,
    p.email,
    p.organization_name,
    p.org_id,
    p.role,
    o.name as org_name
FROM public.profiles p
LEFT JOIN public.orgs o ON p.org_id = o.id
WHERE p.organization_name IS NOT NULL
ORDER BY p.organization_name, p.display_name;
