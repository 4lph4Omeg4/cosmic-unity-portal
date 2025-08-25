-- Fix client references in previews table
-- The issue is that we're loading clients from profiles table but previews references clients table
-- This migration updates the previews table to reference profiles directly

-- Step 1: Drop ALL existing RLS policies on previews table
-- We need to remove all policies first before we can alter the column
DROP POLICY IF EXISTS "Previews are viewable by admins and associated clients" ON public.previews;
DROP POLICY IF EXISTS "Users can view previews they created" ON public.previews;
DROP POLICY IF EXISTS "Users can insert previews" ON public.previews;
DROP POLICY IF EXISTS "Users can update previews they created" ON public.previews;
DROP POLICY IF EXISTS "Users can delete previews they created" ON public.previews;
DROP POLICY IF EXISTS "Previews can be updated by admins and clients" ON public.previews;
DROP POLICY IF EXISTS "Admins can view all previews" ON public.previews;
DROP POLICY IF EXISTS "Clients can view previews assigned to them" ON public.previews;

-- Step 2: Update the foreign key constraint
ALTER TABLE public.previews DROP CONSTRAINT IF EXISTS previews_client_id_fkey;

-- Step 3: Alter the column type (now safe since policies are dropped)
ALTER TABLE public.previews ALTER COLUMN client_id TYPE UUID USING client_id::UUID;

-- Step 4: Add new foreign key constraint to auth.users
ALTER TABLE public.previews ADD CONSTRAINT previews_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 5: Recreate RLS policies for the new structure
-- Policy: Admins can view all previews
CREATE POLICY "Admins can view all previews" ON public.previews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy: Users can view previews they created
CREATE POLICY "Users can view previews they created" ON public.previews
  FOR SELECT USING (created_by = auth.uid());

-- Policy: Users can insert previews
CREATE POLICY "Users can insert previews" ON public.previews
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Policy: Users can update previews they created
CREATE POLICY "Users can update previews they created" ON public.previews
  FOR UPDATE USING (created_by = auth.uid());

-- Policy: Users can delete previews they created
CREATE POLICY "Users can delete previews they created" ON public.previews
  FOR DELETE USING (created_by = auth.uid());

-- Policy: Clients can view previews assigned to them
CREATE POLICY "Clients can view previews assigned to them" ON public.previews
  FOR SELECT USING (client_id = auth.uid());
