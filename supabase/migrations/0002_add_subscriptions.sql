-- 0002_add_subscriptions.sql
-- Tabel voor Stripe subscriptions koppelen aan organisaties en users

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),

  -- Koppeling naar de organisatie die betaalt
  org_id uuid references public.organizations(id) on delete cascade,

  -- Optioneel: directe koppeling naar een gebruiker
  user_id uuid references auth.users(id) on delete set null,

  -- Stripe info
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,

  status text not null default 'active', -- bv. active, canceled, past_due
  current_period_end timestamptz,        -- einde huidige facturatieperiode

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- automatische update van updated_at
create trigger update_subscriptions_updated_at
before update on public.subscriptions
for each row
execute function handle_updated_at();

-- ✅ RLS aanzetten
alter table public.subscriptions enable row level security;

-- ✅ Policies
create policy "Users can view their own org subscriptions"
on public.subscriptions
for select
using (
  exists (
    select 1 from public.org_members m
    where m.org_id = subscriptions.org_id
      and m.user_id = auth.uid()
  )
);

create policy "Admins can manage subscriptions"
on public.subscriptions
for all
using (
  exists (
    select 1 from public.org_members m
    where m.org_id = subscriptions.org_id
      and m.user_id = auth.uid()
      and m.role = 'owner'
  )
);
