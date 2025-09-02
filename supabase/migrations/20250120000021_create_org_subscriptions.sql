-- Create org_subscriptions table for Stripe webhook
CREATE TABLE IF NOT EXISTS public.org_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS org_subscriptions_org_id_idx ON public.org_subscriptions (org_id);
CREATE INDEX IF NOT EXISTS org_subscriptions_stripe_customer_id_idx ON public.org_subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS org_subscriptions_stripe_subscription_id_idx ON public.org_subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS org_subscriptions_status_idx ON public.org_subscriptions (status);

-- Add unique constraint on stripe_subscription_id
ALTER TABLE public.org_subscriptions 
ADD CONSTRAINT org_subscriptions_stripe_subscription_id_unique 
UNIQUE (stripe_subscription_id);

-- Enable RLS
ALTER TABLE public.org_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their organization's subscriptions" ON public.org_subscriptions
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all subscriptions" ON public.org_subscriptions
  FOR ALL USING (true);
