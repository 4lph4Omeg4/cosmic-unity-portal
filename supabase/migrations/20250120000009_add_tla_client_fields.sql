-- Add TLA client fields to orgs table
ALTER TABLE public.orgs 
ADD COLUMN IF NOT EXISTS tla_client BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS parent_org_id TEXT;

-- Create index for TLA clients
CREATE INDEX IF NOT EXISTS orgs_tla_client_idx ON public.orgs (tla_client) WHERE tla_client = TRUE;

-- Create index for parent org relationships
CREATE INDEX IF NOT EXISTS orgs_parent_org_id_idx ON public.orgs (parent_org_id) WHERE parent_org_id IS NOT NULL;
