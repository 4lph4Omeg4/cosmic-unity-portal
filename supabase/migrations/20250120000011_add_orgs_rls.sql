-- Enable RLS on orgs table
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own org
CREATE POLICY "Users can read their own org" ON public.orgs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.org_id = orgs.id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Policy for authenticated users to insert orgs (for TLA signup)
CREATE POLICY "Authenticated users can insert orgs" ON public.orgs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for users to update their own org
CREATE POLICY "Users can update their own org" ON public.orgs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.org_id = orgs.id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Policy for service role to manage all orgs (for Edge Functions)
CREATE POLICY "Service role can manage all orgs" ON public.orgs
  FOR ALL USING (auth.role() = 'service_role');
