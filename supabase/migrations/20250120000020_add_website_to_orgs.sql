-- Add website column to orgs table for onboarding
ALTER TABLE public.orgs 
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add useCase column to orgs table for onboarding
ALTER TABLE public.orgs 
ADD COLUMN IF NOT EXISTS use_case TEXT;

-- Add socials data column to orgs table for onboarding
ALTER TABLE public.orgs 
ADD COLUMN IF NOT EXISTS socials_data JSONB DEFAULT '{}'::jsonb;

-- Add preferences data column to orgs table for onboarding
ALTER TABLE public.orgs 
ADD COLUMN IF NOT EXISTS preferences_data JSONB DEFAULT '{}'::jsonb;
