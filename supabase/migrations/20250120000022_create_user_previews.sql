-- Create new simple user_previews table
CREATE TABLE IF NOT EXISTS public.user_previews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preview_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  client_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_previews_user_id_idx ON public.user_previews (user_id);
CREATE INDEX IF NOT EXISTS user_previews_status_idx ON public.user_previews (status);
CREATE INDEX IF NOT EXISTS user_previews_created_at_idx ON public.user_previews (created_at);

-- Enable RLS
ALTER TABLE public.user_previews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own previews" ON public.user_previews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own previews" ON public.user_previews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all previews" ON public.user_previews
  FOR ALL USING (true);
