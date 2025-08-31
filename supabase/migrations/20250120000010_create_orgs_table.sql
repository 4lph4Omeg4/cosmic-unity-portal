-- Create the orgs table that the code expects
CREATE TABLE IF NOT EXISTS public.orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  needs_onboarding BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  tla_client BOOLEAN DEFAULT FALSE,
  parent_org_id TEXT
);

-- Add org_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS org_id TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS orgs_name_idx ON public.orgs (name);
CREATE INDEX IF NOT EXISTS orgs_needs_onboarding_idx ON public.orgs (needs_onboarding);
CREATE INDEX IF NOT EXISTS orgs_onboarding_completed_idx ON public.orgs (onboarding_completed);
CREATE INDEX IF NOT EXISTS profiles_org_id_idx ON public.profiles (org_id);

-- Add foreign key constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_org_id_fkey 
FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON DELETE SET NULL;

-- Insert the main timeline-alchemy org
INSERT INTO public.orgs (id, name, created_at, updated_at) 
VALUES ('timeline-alchemy', 'Timeline Alchemy', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
