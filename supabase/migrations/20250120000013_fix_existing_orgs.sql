-- Fix existing organizations that don't have the correct column values
-- This migration updates existing orgs to have the correct tla_client, needs_onboarding, and onboarding_completed values

-- Update all existing organizations to be TLA clients
UPDATE public.orgs 
SET 
  tla_client = true,
  needs_onboarding = true,
  onboarding_completed = false,
  updated_at = NOW()
WHERE 
  tla_client IS NULL 
  OR tla_client = false;

-- Update organizations that start with 'tla_' to have correct values
UPDATE public.orgs 
SET 
  tla_client = true,
  needs_onboarding = true,
  onboarding_completed = false,
  updated_at = NOW()
WHERE 
  id LIKE 'tla_%'
  AND (tla_client IS NULL OR tla_client = false);

-- Update the main timeline-alchemy org to not be a TLA client (it's the admin org)
UPDATE public.orgs 
SET 
  tla_client = false,
  needs_onboarding = false,
  onboarding_completed = true,
  updated_at = NOW()
WHERE 
  id = 'timeline-alchemy';

-- Add any missing columns if they don't exist
DO $$
BEGIN
    -- Add tla_client column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orgs' AND column_name = 'tla_client'
    ) THEN
        ALTER TABLE public.orgs ADD COLUMN tla_client BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add needs_onboarding column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orgs' AND column_name = 'needs_onboarding'
    ) THEN
        ALTER TABLE public.orgs ADD COLUMN needs_onboarding BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add onboarding_completed column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orgs' AND column_name = 'onboarding_completed'
    ) THEN
        ALTER TABLE public.orgs ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS orgs_tla_client_idx ON public.orgs (tla_client);
CREATE INDEX IF NOT EXISTS orgs_needs_onboarding_idx ON public.orgs (needs_onboarding);
CREATE INDEX IF NOT EXISTS orgs_onboarding_completed_idx ON public.orgs (onboarding_completed);
