create table if not exists public.blog_posts (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid,
  client_id uuid,
  trend text NOT NULL,
  source_title text,
  source_url text,
  ai_blog text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  title text,
  body text,
  status text NOT NULL DEFAULT 'draft'::text,
  facebook text,
  instagram text,
  x text,
  linkedin text,
  image_storage_path text,
  image_public_url text,
  tags text\n);

create table if not exists public.blog_posts_orgs (\n  post_id uuid NOT NULL,
  org_id uuid NOT NULL,
  assigned_by uuid,
  assigned_at timestamp with time zone NOT NULL DEFAULT now()\n);

create table if not exists public.client_users (\n  client_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  org_id uuid\n);

create table if not exists public.clients (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  contact_email text\n);

create table if not exists public.comments (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()\n);

create table if not exists public.ideas (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'draft'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  org_id uuid\n);

create table if not exists public.likes (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()\n);

create table if not exists public.messages (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  read boolean NOT NULL DEFAULT false\n);

create table if not exists public.org_billing (\n  org_id uuid NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  price_id text,
  status subscription_status,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now()\n);

create table if not exists public.org_members (\n  org_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  role app_role NOT NULL\n);

create table if not exists public.organizations (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  app_scope text DEFAULT 'tla'::text,
  is_demo boolean DEFAULT false\n);

create table if not exists public.posts (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  image_url text,
  org_id uuid,
  client_id uuid,
  brief text,
  fts tsvector,
  status post_status NOT NULL DEFAULT 'draft'::post_status,
  published_at timestamp with time zone,
  author_id uuid\n);

create table if not exists public.previews (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  idea_id uuid,
  client_id uuid NOT NULL,
  channel text NOT NULL,
  template text NOT NULL,
  draft_content jsonb NOT NULL,
  scheduled_at timestamp with time zone,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by uuid,
  admin_notes text,
  client_feedback text,
  reviewed_at timestamp with time zone,
  published_at timestamp with time zone,
  org_id uuid\n);

create table if not exists public.profiles (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  social_links jsonb DEFAULT '{}'::jsonb,
  role text DEFAULT 'user'::text,
  client_id uuid\n);

create table if not exists public.publishes (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  preview_id uuid NOT NULL,
  published_at timestamp with time zone NOT NULL,
  status text DEFAULT 'posted'::text,
  result jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  org_id uuid\n);

create table if not exists public.social_accounts (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid,
  provider platform_kind NOT NULL,
  display_name text,
  connector jsonb,
  secrets jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  org_id uuid\n);

create table if not exists public.social_tokens (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  platform text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  org_id uuid\n);

create table if not exists public.user_clients (\n  user_id uuid NOT NULL,
  client_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  org_id uuid\n);

create table if not exists public.user_profiles (\n  id uuid NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'client'::user_role_enum,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  org_id uuid\n);

create table if not exists realtime.messages (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_08_26 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_08_27 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_08_28 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_08_29 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_08_30 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_08_31 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.messages_2025_09_01 (\n  topic text NOT NULL,
  extension text NOT NULL,
  payload jsonb,
  event text,
  private boolean DEFAULT false,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  inserted_at timestamp without time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT gen_random_uuid()\n);

create table if not exists realtime.schema_migrations (\n  version bigint NOT NULL,
  inserted_at timestamp without time zone\n);

create table if not exists realtime.subscription (\n  id bigint NOT NULL,
  subscription_id uuid NOT NULL,
  entity regclass NOT NULL,
  filters user_defined_filter[] NOT NULL DEFAULT '{}'::realtime.user_defined_filter[],
  claims jsonb NOT NULL,
  claims_role regrole NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT timezone('utc'::text, now())\n);

create table if not exists storage.buckets (\n  id text NOT NULL,
  name text NOT NULL,
  owner uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  public boolean DEFAULT false,
  avif_autodetection boolean DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[],
  owner_id text,
  type buckettype NOT NULL DEFAULT 'STANDARD'::storage.buckettype\n);

create table if not exists storage.buckets_analytics (\n  id text NOT NULL,
  type buckettype NOT NULL DEFAULT 'ANALYTICS'::storage.buckettype,
  format text NOT NULL DEFAULT 'ICEBERG'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()\n);

create table if not exists storage.migrations (\n  id integer NOT NULL,
  name character varying(100) NOT NULL,
  hash character varying(40) NOT NULL,
  executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP\n);

create table if not exists storage.objects (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  bucket_id text,
  name text,
  owner uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_accessed_at timestamp with time zone DEFAULT now(),
  metadata jsonb,
  path_tokens text[],
  version text,
  owner_id text,
  user_metadata jsonb,
  level integer\n);

create table if not exists storage.prefixes (\n  bucket_id text NOT NULL,
  name text NOT NULL,
  level integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()\n);

create table if not exists storage.s3_multipart_uploads (\n  id text NOT NULL,
  in_progress_size bigint NOT NULL DEFAULT 0,
  upload_signature text NOT NULL,
  bucket_id text NOT NULL,
  key text NOT NULL,
  version text NOT NULL,
  owner_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_metadata jsonb\n);

create table if not exists storage.s3_multipart_uploads_parts (\n  id uuid NOT NULL DEFAULT gen_random_uuid(),
  upload_id text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  part_number integer NOT NULL,
  bucket_id text NOT NULL,
  key text NOT NULL,
  etag text NOT NULL,
  owner_id text,
  version text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()\n);

alter table public.blog_posts add constraint blog_posts_pkey primary key (id);

alter table public.blog_posts_orgs add constraint blog_posts_orgs_pkey primary key (post_id, org_id);

alter table public.client_users add constraint client_users_pkey primary key (user_id, client_id);

alter table public.clients add constraint clients_pkey primary key (id);

alter table public.comments add constraint comments_pkey primary key (id);

alter table public.ideas add constraint ideas_pkey primary key (id);

alter table public.likes add constraint likes_pkey primary key (id);

alter table public.likes add constraint likes_user_id_post_id_key unique (post_id, user_id);

alter table public.messages add constraint messages_pkey primary key (id);

alter table public.org_billing add constraint org_billing_pkey primary key (org_id);

alter table public.org_billing add constraint org_billing_stripe_customer_id_key unique (stripe_customer_id);

alter table public.org_billing add constraint org_billing_stripe_subscription_id_key unique (stripe_subscription_id);

alter table public.org_members add constraint org_members_pkey primary key (user_id, org_id);

alter table public.organizations add constraint organizations_pkey primary key (id);

alter table public.posts add constraint posts_pkey primary key (id);

alter table public.previews add constraint previews_pkey primary key (id);

alter table public.profiles add constraint profiles_pkey primary key (id);

alter table public.profiles add constraint profiles_user_id_key unique (user_id);

alter table public.profiles add constraint profiles_user_id_unique unique (user_id);

alter table public.publishes add constraint publishes_pkey primary key (id);

alter table public.social_accounts add constraint social_accounts_pkey primary key (id);

alter table public.social_tokens add constraint social_tokens_pkey primary key (id);

alter table public.user_clients add constraint user_clients_pkey primary key (user_id, client_id);

alter table public.user_profiles add constraint user_profiles_pkey primary key (id);

alter table realtime.messages add constraint messages_pkey primary key (inserted_at, id);

alter table realtime.messages_2025_08_26 add constraint messages_2025_08_26_pkey primary key (inserted_at, id);

alter table realtime.messages_2025_08_27 add constraint messages_2025_08_27_pkey primary key (id, inserted_at);

alter table realtime.messages_2025_08_28 add constraint messages_2025_08_28_pkey primary key (id, inserted_at);

alter table realtime.messages_2025_08_29 add constraint messages_2025_08_29_pkey primary key (id, inserted_at);

alter table realtime.messages_2025_08_30 add constraint messages_2025_08_30_pkey primary key (id, inserted_at);

alter table realtime.messages_2025_08_31 add constraint messages_2025_08_31_pkey primary key (id, inserted_at);

alter table realtime.messages_2025_09_01 add constraint messages_2025_09_01_pkey primary key (inserted_at, id);

alter table realtime.schema_migrations add constraint schema_migrations_pkey primary key (version);

alter table realtime.subscription add constraint pk_subscription primary key (id);

alter table storage.buckets add constraint buckets_pkey primary key (id);

alter table storage.buckets_analytics add constraint buckets_analytics_pkey primary key (id);

alter table storage.migrations add constraint migrations_name_key unique (name);

alter table storage.migrations add constraint migrations_pkey primary key (id);

alter table storage.objects add constraint objects_pkey primary key (id);

alter table storage.prefixes add constraint prefixes_pkey primary key (name, level, bucket_id);

alter table storage.s3_multipart_uploads add constraint s3_multipart_uploads_pkey primary key (id);

alter table storage.s3_multipart_uploads_parts add constraint s3_multipart_uploads_parts_pkey primary key (id);

CREATE INDEX idx_previews_published_at ON public.previews (published_at);

CREATE INDEX idx_previews_status ON public.previews (status);

CREATE INDEX blog_posts_orgs_org_id_idx ON public.blog_posts_orgs (org_id);

CREATE INDEX blog_posts_orgs_post_id_idx ON public.blog_posts_orgs (post_id);

CREATE INDEX idx_org_members_user ON public.org_members (user_id);

CREATE INDEX idx_clients_org ON public.clients (org_id);

CREATE INDEX idx_client_users_user ON public.client_users (user_id);

CREATE INDEX idx_messages_sender ON public.messages (sender_id);

CREATE INDEX idx_messages_receiver ON public.messages (receiver_id);

CREATE INDEX idx_messages_pair ON public.messages (sender_id, receiver_id);

CREATE INDEX idx_messages_created_at ON public.messages (created_at);

CREATE INDEX idx_messages_read ON public.messages (read);

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);

CREATE INDEX comments_post_id_idx ON public.comments (post_id);

CREATE INDEX comments_user_id_idx ON public.comments (user_id);

CREATE INDEX idx_profiles_user_id ON public.profiles (user_id);

CREATE INDEX idx_profiles_role ON public.profiles (role);

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription (entity);

CREATE INDEX posts_user_id_idx ON public.posts (user_id);

CREATE INDEX idx_posts_created_at ON public.posts (created_at);

CREATE INDEX idx_posts_client ON public.posts (client_id);

CREATE INDEX idx_posts_org ON public.posts (org_id);

CREATE INDEX idx_posts_fts ON public.posts USING gin (fts);

CREATE INDEX idx_posts_user_id ON public.posts (user_id);

CREATE INDEX likes_post_id_idx ON public.likes (post_id);

CREATE INDEX likes_user_id_idx ON public.likes (user_id);

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads (bucket_id, key, created_at);

CREATE INDEX idx_objects_bucket_id_name ON storage.objects (bucket_id, name COLLATE "C");

CREATE INDEX name_prefix_search ON storage.objects (name text_pattern_ops);

CREATE INDEX idx_objects_lower_name ON storage.objects ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);

alter table public.ideas add constraint ideas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public.ideas add constraint ideas_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.previews add constraint previews_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.previews add constraint previews_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public.previews add constraint previews_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL;

alter table public.previews add constraint previews_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.publishes add constraint publishes_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.publishes add constraint publishes_preview_id_fkey FOREIGN KEY (preview_id) REFERENCES previews(id) ON DELETE CASCADE;

alter table public.social_tokens add constraint social_tokens_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.social_tokens add constraint social_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.user_clients add constraint user_clients_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

alter table public.user_clients add constraint user_clients_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.user_clients add constraint user_clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

alter table public.user_profiles add constraint user_profiles_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.blog_posts_orgs add constraint blog_posts_orgs_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES auth.users(id);

alter table public.blog_posts_orgs add constraint blog_posts_orgs_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table public.blog_posts_orgs add constraint blog_posts_orgs_post_id_fkey FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;

alter table public.org_members add constraint org_members_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table public.clients add constraint clients_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table public.client_users add constraint client_users_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

alter table public.client_users add constraint client_users_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.social_accounts add constraint social_accounts_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

alter table public.social_accounts add constraint social_accounts_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE RESTRICT;

alter table public.messages add constraint messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

alter table public.messages add constraint messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

alter table storage.prefixes add constraint "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);

alter table public.comments add constraint comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

alter table public.comments add constraint comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.blog_posts add constraint blog_posts_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

alter table public.blog_posts add constraint blog_posts_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL;

alter table public.profiles add constraint profiles_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

alter table public.profiles add constraint profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.org_billing add constraint org_billing_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table public.posts add constraint posts_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

alter table public.posts add constraint posts_org_id_fkey FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;

alter table public.posts add constraint posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.likes add constraint likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

alter table public.likes add constraint likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table storage.s3_multipart_uploads_parts add constraint s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);

alter table storage.s3_multipart_uploads_parts add constraint s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;

alter table storage.s3_multipart_uploads add constraint s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);

alter table storage.objects add constraint "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);

alter table public.ideas enable row level security;

alter table public.previews enable row level security;

alter table public.publishes enable row level security;

alter table public.social_tokens enable row level security;

alter table public.user_clients enable row level security;

alter table public.user_profiles enable row level security;

alter table public.blog_posts_orgs enable row level security;

alter table public.organizations enable row level security;

alter table public.org_members enable row level security;

alter table public.clients enable row level security;

alter table public.client_users enable row level security;

alter table public.social_accounts enable row level security;

alter table public.messages enable row level security;

alter table storage.prefixes enable row level security;

alter table storage.buckets_analytics enable row level security;

alter table public.comments enable row level security;

alter table public.blog_posts enable row level security;

alter table public.profiles enable row level security;

alter table storage.migrations enable row level security;

alter table public.org_billing enable row level security;

alter table public.posts enable row level security;

alter table public.likes enable row level security;

alter table storage.s3_multipart_uploads_parts enable row level security;

alter table storage.s3_multipart_uploads enable row level security;

alter table storage.objects enable row level security;

alter table storage.buckets enable row level security;

create policy ideas_delete_owner on public.ideas for delete to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = ideas.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy ideas_read_own_org on public.ideas for select to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = ideas.org_id) AND (m.user_id = auth.uid())))));

create policy ideas_update_owner on public.ideas for update to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = ideas.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text))))) with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = ideas.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy ideas_write_owner on public.ideas for insert to authenticated with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = ideas.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy previews_delete_owner on public.previews for delete to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = previews.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy previews_read_own_org on public.previews for select to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = previews.org_id) AND (m.user_id = auth.uid())))));

create policy previews_update_owner on public.previews for update to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = previews.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text))))) with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = previews.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy previews_write_owner on public.previews for insert to authenticated with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = previews.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy publishes_delete_owner on public.publishes for delete to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = publishes.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy publishes_read_own_org on public.publishes for select to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = publishes.org_id) AND (m.user_id = auth.uid())))));

create policy publishes_update_owner on public.publishes for update to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = publishes.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text))))) with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = publishes.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy publishes_write_owner on public.publishes for insert to authenticated with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = publishes.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy social_tokens_deny_all on public.social_tokens to authenticated using (false) with check (false);

create policy user_clients_deny_all on public.user_clients to authenticated using (false) with check (false);

create policy user_profiles_deny_all on public.user_profiles to authenticated using (false) with check (false);

create policy blog_posts_orgs_admin_write on public.blog_posts_orgs to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.user_id = auth.uid()) AND (m.org_id = 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8'::uuid) AND ((m.role)::text = 'owner'::text))))) with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.user_id = auth.uid()) AND (m.org_id = 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8'::uuid) AND ((m.role)::text = 'owner'::text)))));

create policy blog_posts_orgs_read_own_org on public.blog_posts_orgs for select to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = blog_posts_orgs.org_id) AND (m.user_id = auth.uid())))));

create policy organizations_deny_all on public.organizations to authenticated using (false) with check (false);

create policy org_members_read_self on public.org_members for select to public using ((user_id = auth.uid()));

create policy org_members_write_owner on public.org_members to public using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = org_members.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text))))) with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.org_id = org_members.org_id) AND (m.user_id = auth.uid()) AND ((m.role)::text = 'owner'::text)))));

create policy clients_deny_all on public.clients to authenticated using (false) with check (false);

create policy client_users_deny_all on public.client_users to authenticated using (false) with check (false);

create policy social_accounts_deny_all on public.social_accounts to authenticated using (false) with check (false);

create policy messages_select_authenticated on public.messages for select to authenticated using (((sender_id = auth.uid()) OR (receiver_id = auth.uid())));

create policy messages_update_authenticated on public.messages for update to authenticated using ((receiver_id = auth.uid())) with check ((receiver_id = auth.uid()));

create policy comments_select_authenticated on public.comments for select to authenticated using (true);

create policy blog_posts_admin_write on public.blog_posts to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.user_id = auth.uid()) AND (m.org_id = 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8'::uuid) AND ((m.role)::text = 'owner'::text))))) with check ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.user_id = auth.uid()) AND (m.org_id = 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8'::uuid) AND ((m.role)::text = 'owner'::text)))));

create policy blog_posts_read_admin on public.blog_posts for select to authenticated using ((EXISTS ( SELECT 1
   FROM org_members m
  WHERE ((m.user_id = auth.uid()) AND (m.org_id = 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8'::uuid) AND ((m.role)::text = 'owner'::text)))));

create policy blog_posts_read_own_org on public.blog_posts for select to authenticated using ((EXISTS ( SELECT 1
   FROM (blog_posts_orgs bpo
     JOIN org_members m ON ((m.org_id = bpo.org_id)))
  WHERE ((bpo.post_id = blog_posts.id) AND (m.user_id = auth.uid())))));

create policy profiles_select_all on public.profiles for select to authenticated using (true);

create policy profiles_update_own on public.profiles for update to authenticated using ((id = auth.uid())) with check ((id = auth.uid()));

create policy org_billing_deny_all on public.org_billing to authenticated using (false) with check (false);

create policy posts_delete_own on public.posts for delete to authenticated using ((user_id = auth.uid()));

create policy posts_select_authenticated on public.posts for select to authenticated using (true);

create policy posts_update_own on public.posts for update to authenticated using ((user_id = auth.uid())) with check ((user_id = auth.uid()));

create policy likes_delete_own on public.likes for delete to authenticated using ((user_id = auth.uid()));

create policy likes_select_authenticated on public.likes for select to authenticated using (true);

create policy "Anyone can view avatars" on storage.objects for select to public using ((bucket_id = 'user-avatars'::text));

create policy "Authenticated users can upload" on storage.objects for insert to authenticated with check (((bucket_id = 'post-images'::text) AND (( SELECT auth.uid() AS uid) IS NOT NULL)));

create policy "Avatar images are publicly accessible" on storage.objects for select to public using ((bucket_id = 'user-avatars'::text));

create policy "Public Access" on storage.objects for select to public using ((bucket_id = 'blog-images'::text));

create policy "Public read access" on storage.objects for select to public using ((bucket_id = 'post-images'::text));

create policy "User can delete own avatar" on storage.objects for delete to authenticated using (((bucket_id = 'user-avatars'::text) AND ((metadata ->> 'user_id'::text) = (( SELECT ( SELECT auth.uid() AS uid) AS uid))::text)));

create policy "User can delete own uploads" on storage.objects for delete to authenticated using (((bucket_id = 'post-images'::text) AND ((metadata ->> 'user_id'::text) = (( SELECT ( SELECT auth.uid() AS uid) AS uid))::text)));

create policy "Users can delete own uploads" on storage.objects for delete to public using (((bucket_id = 'blog-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

create policy "Users can delete their attachments" on storage.objects for delete to authenticated using (((bucket_id = 'attachments'::text) AND ((metadata ->> 'user_id'::text) = (( SELECT ( SELECT auth.uid() AS uid) AS uid))::text)));

create policy "Users can delete their own avatar" on storage.objects for delete to public using (((bucket_id = 'user-avatars'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));

create policy "Users can read their attachments" on storage.objects for select to authenticated using (((bucket_id = 'attachments'::text) AND ((metadata ->> 'user_id'::text) = (( SELECT ( SELECT auth.uid() AS uid) AS uid))::text)));

create policy "Users can update own uploads" on storage.objects for update to public using (((bucket_id = 'blog-images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

create policy "Users can update their own avatar" on storage.objects for update to public using (((bucket_id = 'user-avatars'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1]))) with check (true);

create policy "Users can upload attachments" on storage.objects for insert to authenticated with check (((bucket_id = 'attachments'::text) AND (( SELECT auth.uid() AS uid) IS NOT NULL)));

create policy "Users can upload their avatar" on storage.objects for insert to authenticated with check (((bucket_id = 'user-avatars'::text) AND (( SELECT auth.uid() AS uid) IS NOT NULL)));

create policy "Users can upload their own avatar" on storage.objects for insert to public with check (((bucket_id = 'user-avatars'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));

create or replace view public.has_tla_org_access as  SELECT m.user_id,
    m.org_id
   FROM org_members m
     JOIN organizations o ON o.id = m.org_id
     LEFT JOIN org_billing b ON b.org_id = o.id
  WHERE (o.app_scope = ANY (ARRAY['tla'::text, 'both'::text])) AND (b.status = ANY (ARRAY['active'::subscription_status, 'trialing'::subscription_status])) AND COALESCE(b.current_period_end, now() + '00:00:01'::interval) > now();;

create or replace view public.has_tla_access as  SELECT DISTINCT user_id
   FROM has_tla_org_access;;

create or replace view public.tla_posts_visible as  SELECT id,
    org_id,
    client_id,
    trend,
    source_title,
    source_url,
    ai_blog,
    created_at,
    updated_at,
    title,
    body,
    status,
    facebook,
    instagram,
    x,
    linkedin,
    image_storage_path,
    image_public_url,
    tags
   FROM blog_posts p
  WHERE (EXISTS ( SELECT 1
           FROM blog_posts_orgs bpo
             JOIN org_members m ON m.org_id = bpo.org_id
          WHERE bpo.post_id = p.id AND m.user_id = auth.uid()));;

create or replace view public._policy_audit as  SELECT schemaname,
    tablename,
    policyname,
    COALESCE(array_to_string(roles, ','::text), '(implicit)'::text) AS roles,
        CASE
            WHEN roles IS NULL OR array_length(roles, 1) = 0 THEN true
            ELSE false
        END AS is_implicit_roles
   FROM pg_policies
  WHERE schemaname = ANY (ARRAY['public'::name, 'realtime'::name, 'storage'::name]);;

create or replace view public._org_membership_txt as  SELECT org_id::text AS org_id_txt,
    user_id::text AS user_id_txt
   FROM org_members;;

CREATE OR REPLACE FUNCTION storage.get_level(name text)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
SELECT array_length(string_to_array("name", '/'), 1);
$function$
;

CREATE OR REPLACE FUNCTION storage.get_prefix(name text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$function$
;

CREATE OR REPLACE FUNCTION storage.get_prefixes(name text)
 RETURNS text[]
 LANGUAGE plpgsql
 IMMUTABLE STRICT
AS $function$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.add_prefixes(_bucket_id text, _name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.delete_prefix(_bucket_id text, _name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.prefixes_insert_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.objects_insert_prefix_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.delete_prefix_hierarchy_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$function$
;

CREATE OR REPLACE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text)
 RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN query EXECUTE
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name || '/' AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
                ORDER BY prefixes.name COLLATE "C" LIMIT $3
            )
            UNION ALL
            (SELECT split_part(name, '/', $4) AS key,
                name,
                id,
                updated_at,
                created_at,
                metadata
            FROM storage.objects
            WHERE name COLLATE "C" LIKE $1 || '%'
                AND bucket_id = $2
                AND level = $4
                AND name COLLATE "C" > $5
            ORDER BY name COLLATE "C" LIMIT $3)
        ) obj
        ORDER BY name COLLATE "C" LIMIT $3;
        $sql$
        USING prefix, bucket_name, limits, levels, start_after;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)
 RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$function$
;

CREATE OR REPLACE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)
 RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$function$
;

CREATE OR REPLACE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)
 RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
 LANGUAGE plpgsql
AS $function$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.ingest_staging_content(p_payload jsonb)
 RETURNS TABLE(inserted_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  arr jsonb;
  it  jsonb;
begin
  -- zowel {items:[...]} als [...] toelaten
  if jsonb_typeof(p_payload) = 'object' and p_payload ? 'items' then
    arr := p_payload->'items';
  else
    arr := p_payload;
  end if;

  if jsonb_typeof(arr) <> 'array' then
    raise exception 'Payload must be a JSON array or object with "items" array';
  end if;

  for it in select jsonb_array_elements(arr)
  loop
    insert into public.staging_content (
      trend, source_title, source_url, summary,
      keywords, angle_suggestions, recommended_formats, tags,
      audience, tone, cta_ideas, raw
    )
    values (
      (it->>'trend'),
      (it->>'source_title'),
      (it->>'source_url'),
      (it->>'summary'),
      coalesce((select array_agg(value::text) from jsonb_array_elements_text(it->'keywords')), '{}'::text[]),
      coalesce((select array_agg(value::text) from jsonb_array_elements_text(it->'angle_suggestions')), '{}'::text[]),
      coalesce((select array_agg(value::text) from jsonb_array_elements_text(it->'recommended_formats')), '{}'::text[]),
      coalesce((select array_agg(value::text) from jsonb_array_elements_text(it->'tags')), '{}'::text[]),
      (it->>'audience'),
      (it->>'tone'),
      coalesce((select array_agg(value::text) from jsonb_array_elements_text(it->'cta_ideas')), '{}'::text[]),
      it
    )
    on conflict (trend, source_url) do update set
      source_title        = excluded.source_title,
      summary             = excluded.summary,
      keywords            = excluded.keywords,
      angle_suggestions   = excluded.angle_suggestions,
      recommended_formats = excluded.recommended_formats,
      tags                = excluded.tags,
      audience            = excluded.audience,
      tone                = excluded.tone,
      cta_ideas           = excluded.cta_ideas,
      raw                 = excluded.raw,
      updated_at          = now()
    returning id into inserted_id;

    return next;
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$function$
;

CREATE OR REPLACE FUNCTION storage.get_size_by_bucket()
 RETURNS TABLE(size bigint, bucket_id text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$function$
;

CREATE OR REPLACE FUNCTION storage.objects_update_prefix_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.enforce_bucket_name_length()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public._staging_content_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  new.updated_at := now();
  return new;
end; $function$
;

CREATE OR REPLACE FUNCTION public.client_ids_for_user()
 RETURNS TABLE(client_id uuid)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select uc.client_id
  from public.user_clients uc
  where uc.user_id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.bind_current_user_to_demo_client()
 RETURNS TABLE(my_client uuid, in_org boolean, client_users_links integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_client uuid;
  v_org uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No auth.uid() (run this from the app as the client user)';
  END IF;

  SELECT id INTO v_client FROM public.clients WHERE name='Demo Client' LIMIT 1;
  IF v_client IS NULL THEN
    RAISE EXCEPTION 'Demo Client not found in public.clients';
  END IF;

  -- Kies eerste org (of maak Timeline Alchemy als die er niet is)
  SELECT id INTO v_org FROM public.organizations ORDER BY id LIMIT 1;
  IF v_org IS NULL THEN
    INSERT INTO public.organizations (id, name) VALUES (gen_random_uuid(), 'Timeline Alchemy');
    SELECT id INTO v_org FROM public.organizations WHERE name='Timeline Alchemy' LIMIT 1;
  END IF;

  -- Zorg dat profiles.client_id bestaat
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='profiles' AND column_name='client_id'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;
  END IF;

  -- Zorg dat er een profiles row bestaat voor deze user
  INSERT INTO public.profiles (user_id)
  VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  -- Koppel profiel aan Demo Client
  UPDATE public.profiles SET client_id = v_client
  WHERE user_id = v_uid;

  -- Koppel client_users (veel policies kijken hiernaar)
  INSERT INTO public.client_users (client_id, user_id)
  VALUES (v_client, v_uid)
  ON CONFLICT (client_id, user_id) DO NOTHING;

  -- Zet org_members → rol 'client'
  INSERT INTO public.org_members (user_id, org_id, role)
  VALUES (v_uid, v_org, 'client'::role_kind)
  ON CONFLICT (user_id, org_id) DO UPDATE SET role = EXCLUDED.role;

  -- Resultaat teruggeven voor sanity
  RETURN QUERY
  SELECT
    (SELECT client_id FROM public.profiles WHERE user_id=v_uid) AS my_client,
    EXISTS(SELECT 1 FROM public.org_members WHERE user_id=v_uid) AS in_org,
    (SELECT count(*) FROM public.client_users WHERE user_id=v_uid) AS client_users_links;
END$function$
;

CREATE OR REPLACE FUNCTION public.bind_user_to_demo_client(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_client uuid;
  v_org uuid;
BEGIN
  SELECT id INTO v_client FROM public.clients WHERE name='Demo Client' LIMIT 1;
  IF v_client IS NULL THEN RAISE EXCEPTION 'Demo Client not found'; END IF;

  SELECT id INTO v_org FROM public.organizations ORDER BY id LIMIT 1;
  IF v_org IS NULL THEN
    INSERT INTO public.organizations (id, name) VALUES (gen_random_uuid(), 'Timeline Alchemy');
    SELECT id INTO v_org FROM public.organizations WHERE name='Timeline Alchemy' LIMIT 1;
  END IF;

  INSERT INTO public.profiles (user_id) VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.profiles SET client_id = v_client WHERE user_id = p_user_id;

  INSERT INTO public.client_users (client_id, user_id)
  VALUES (v_client, p_user_id)
  ON CONFLICT (client_id, user_id) DO NOTHING;

  INSERT INTO public.org_members (user_id, org_id, role)
  VALUES (p_user_id, v_org, 'client'::role_kind)
  ON CONFLICT (user_id, org_id) DO UPDATE SET role = EXCLUDED.role;
END$function$
;

CREATE OR REPLACE FUNCTION public.bind_user_to_demo_client_by_email(p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = p_email;
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No auth.users row for %', p_email;
  END IF;
  PERFORM public.bind_user_to_demo_client(v_uid);
END$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION public.tg_messages_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$function$
;

CREATE OR REPLACE FUNCTION public.posts_fts_refresh()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  new.fts := to_tsvector('simple', coalesce(new.title,'') || ' ' || coalesce(new.brief,''));
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text)
 RETURNS TABLE(key text, id text, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text)
 RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$function$
;

CREATE OR REPLACE FUNCTION storage.operation()
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.promote_staging_to_post(p_staging_id uuid, p_user uuid, p_post_status post_status DEFAULT 'draft'::post_status, p_platform_text text DEFAULT NULL::text, p_mark_status staging_status DEFAULT 'selected'::staging_status)
 RETURNS TABLE(post_id uuid, variant_id uuid)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  cs record;
  v_platform platform_kind := _to_platform(p_platform_text);
  v_post uuid;
  v_variant uuid;
  v_title text;
  v_brief text;
begin
  select * into cs
  from content_staging
  where id = p_staging_id;

  if not found then
    raise exception 'staging % not found', p_staging_id;
  end if;

  -- Titel/brief bepalen (geen automatische status-mapping)
  v_title := coalesce(nullif(cs.trend,''), nullif(cs.source_title,''), '(untitled)');
  v_brief := left(coalesce(cs.body,''), 500);

  insert into posts (org_id, client_id, title, brief, status, created_by, metadata)
  values (
    cs.org_id, cs.client_id, v_title, v_brief, p_post_status, p_user,
    jsonb_build_object('staging_id', cs.id, 'source_agent', cs.source_agent::text)
    || coalesce(cs.metadata, '{}'::jsonb)
  )
  returning id into v_post;

  if v_platform is not null then
    insert into post_variants (post_id, platform, body, metadata)
    values (
      v_post, v_platform, coalesce(cs.body,''),
      coalesce(cs.metadata,'{}'::jsonb) || jsonb_build_object('from_staging', cs.id)
    )
    returning id into v_variant;
  end if;

  update content_staging
  set status = p_mark_status
  where id = cs.id;

  post_id := v_post;
  variant_id := v_variant;
  return next;
end $function$
;

CREATE OR REPLACE FUNCTION public.user_primary_org(p_user uuid DEFAULT auth.uid())
 RETURNS uuid
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select org_id from public.org_members
  where user_id = p_user
  order by (role::text='owner') desc, created_at asc
  limit 1
$function$
;

CREATE OR REPLACE FUNCTION storage.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_post_status(p_post uuid, p_status post_status)
 RETURNS void
 LANGUAGE sql
 SET search_path TO 'public', 'pg_temp'
AS $function$
  update posts
  set status = p_status, updated_at = now()
  where id = p_post;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, do nothing
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error and continue (don't block user creation)
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.on_approval_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_is_client bool;
  v_client_id uuid;
  v_org_id uuid;
begin
  -- Only react to 'approved'
  if new.state::text <> 'approved' then
    return new;
  end if;

  -- Check if NEW.requested_by is a client user of the post's client
  select exists (
           select 1
           from posts p
           join client_users cu on cu.client_id = p.client_id
           where p.id = new.post_id
             and cu.user_id = new.requested_by
         ),
         p.client_id,
         p.org_id
  into v_is_client, v_client_id, v_org_id
  from posts p
  where p.id = new.post_id
  limit 1;

  if not coalesce(v_is_client,false) then
    -- If approval came from org side, we don't auto-submit here.
    return new;
  end if;

  -- Flip post -> 'submitted'
  perform set_post_status(new.post_id, 'submitted');

  -- Enqueue outbox message for Zapier
  insert into integration_outbox(kind, payload)
  values (
    'approval_client',
    jsonb_build_object(
      'org_id', v_org_id,
      'client_id', v_client_id,
      'post_id', new.post_id,
      'approval_id', new.id,
      'requested_by', new.requested_by,
      'state', new.state::text,
      'note', coalesce(new.note,''),
      'created_at', new.created_at
    )
  );

  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.ingest_grok_staging(p_org uuid, p_user uuid, p_payload jsonb, p_client uuid DEFAULT NULL::uuid, p_status staging_status DEFAULT 'pending'::staging_status)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  itm jsonb;
  v_tags text[];
  v_body text;
  v_inserted int := 0;
  v_rc int;
begin
  if p_org is null then
    raise exception 'ingest_grok_staging: p_org is null';
  end if;

  for itm in
    select * from jsonb_array_elements(coalesce(p_payload->'items','[]'::jsonb))
  loop
    v_tags  := (select coalesce(array_agg(x), '{}') from (select jsonb_array_elements_text(coalesce(itm->'tags','[]'::jsonb)) x) s);
    v_body  := coalesce(itm->>'summary','');

    insert into content_staging (
      org_id, client_id, source_agent,
      trend, source_title, source_url,
      format, body, tags, media_refs, metadata, status, created_by
    ) values (
      p_org, p_client, 'grok',
      nullif(itm->>'trend',''),
      nullif(itm->>'source_title',''),
      nullif(itm->>'source_url',''),
      'idea',
      v_body,
      v_tags,
      '[]'::jsonb,
      jsonb_strip_nulls(
        jsonb_build_object(
          'keywords',           coalesce(itm->'keywords','[]'::jsonb),
          'angle_suggestions',  coalesce(itm->'angle_suggestions','[]'::jsonb),
          'recommended_formats',coalesce(itm->'recommended_formats','[]'::jsonb),
          'audience',           nullif(itm->>'audience',''),
          'tone',               nullif(itm->>'tone',''),
          'cta_ideas',          coalesce(itm->'cta_ideas','[]'::jsonb),
          'raw',                itm
        )
      ),
      p_status,
      p_user
    )
    on conflict do nothing;

    get diagnostics v_rc = row_count;
    if v_rc > 0 then v_inserted := v_inserted + 1; end if;
  end loop;

  return v_inserted;
end $function$
;

CREATE OR REPLACE FUNCTION public.dedupe_indexes_and_constraints(run boolean DEFAULT false)
 RETURNS TABLE(step text, object_type text, schema_name text, table_name text, name text, action text)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  r record;
  keep_name text;
  drop_name text;
  sql text;
begin
  -- =========================
  -- 1) DUPLICATE UNIQUE CONSTRAINTS (same table + same column set)
  -- =========================
  for r in
    with uniq as (
      select
        n.nspname                             as schema_name,
        c.relname                             as table_name,
        con.conname                           as constraint_name,
        con.oid                               as con_oid,
        array_agg(a.attname order by u.i)     as cols,
        array_to_string(array_agg(a.attname order by u.i), ',') as cols_key
      from pg_constraint con
      join pg_class c on c.oid = con.conrelid
      join pg_namespace n on n.oid = c.relnamespace
      join unnest(con.conkey) with ordinality u(attnum, i) on true
      join pg_attribute a on a.attnum = u.attnum and a.attrelid = c.oid
      where con.contype = 'u'            -- UNIQUE constraints
        and n.nspname not in ('pg_catalog','information_schema')
      group by n.nspname, c.relname, con.conname, con.oid
    ),
    groups as (
      select schema_name, table_name, cols_key, array_agg(constraint_name order by constraint_name) as members
      from uniq
      group by schema_name, table_name, cols_key
      having count(*) > 1
    )
    select g.schema_name, g.table_name, g.cols_key, m as drop_candidate
    from groups g
    cross join lateral unnest( (select members from groups gg where gg.schema_name=g.schema_name and gg.table_name=g.table_name and gg.cols_key=g.cols_key) ) as m
  loop
    -- Keep the lexicographically first name; drop the rest
    select min(m) into keep_name
    from (
      select conname m
      from pg_constraint con
      join pg_class c on c.oid = con.conrelid
      join pg_namespace n on n.oid = c.relnamespace
      where con.contype='u'
        and n.nspname = r.schema_name
        and c.relname = r.table_name
        and array_to_string((select array_agg(a.attname order by u.i)
                             from unnest(con.conkey) with ordinality u(attnum,i)
                             join pg_attribute a on a.attnum=u.attnum and a.attrelid=c.oid), ',') = r.cols_key
    ) s;

    if r.drop_candidate <> keep_name then
      drop_name := r.drop_candidate;
      if run then
        execute format('alter table %I.%I drop constraint %I;', r.schema_name, r.table_name, drop_name);
      end if;
      step := 'constraints';
      object_type := 'unique_constraint';
      schema_name := r.schema_name;
      table_name := r.table_name;
      name := drop_name;
      action := case when run then 'dropped' else format('would drop (duplicate on [%s])', r.cols_key) end;
      return next;
    end if;
  end loop;

  -- =========================
  -- 2) DUPLICATE NON-CONSTRAINT INDEXES (same table + same indkey + same qualities)
  --    Exclude indexes that back constraints (PK/UNIQUE/EXCLUDE)
  -- =========================
  for r in
    with idx as (
      select
        n.nspname                           as schema_name,
        c.relname                           as table_name,
        i.relname                           as index_name,
        i.oid                               as index_oid,
        ix.indisunique,
        ix.indisprimary,
        ix.indisexclusion,
        ix.indkey,
        array_agg(a.attname order by ordinality) as cols,
        array_to_string(array_agg(a.attname order by ordinality), ',') as cols_key
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      join pg_index ix on ix.indrelid = c.oid
      join pg_class i on i.oid = ix.indexrelid
      left join pg_constraint con on con.conindid = i.oid
      left join unnest(ix.indkey) with ordinality k(attnum, ordinality) on true
      left join pg_attribute a on a.attrelid = c.oid and a.attnum = k.attnum
      where n.nspname not in ('pg_catalog','information_schema')
        and c.relkind = 'r'    -- ordinary tables
        and con.oid is null    -- exclude indexes that back constraints
      group by n.nspname, c.relname, i.relname, i.oid, ix.indisunique, ix.indisprimary, ix.indisexclusion, ix.indkey
    ),
    groups as (
      select
        schema_name, table_name, cols_key, indisunique, indisexclusion,
        array_agg(index_name order by index_name) as members
      from idx
      group by schema_name, table_name, cols_key, indisunique, indisexclusion
      having count(*) > 1
    )
    select g.schema_name, g.table_name, g.cols_key, g.indisunique, g.indisexclusion, m as drop_candidate
    from groups g
    cross join lateral unnest(g.members) as m
  loop
    -- keep first; drop the rest
    select min(m) into keep_name
    from (
      select i.relname m
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      join pg_index ix on ix.indrelid = c.oid
      join pg_class i on i.oid = ix.indexrelid
      left join pg_constraint con on con.conindid = i.oid
      left join unnest(ix.indkey) with ordinality k(attnum, ordinality) on true
      left join pg_attribute a on a.attrelid = c.oid and a.attnum = k.attnum
      where con.oid is null
        and n.nspname = r.schema_name
        and c.relname = r.table_name
      group by i.relname
      having array_to_string(array_agg(a.attname order by ordinality), ',') = r.cols_key
    ) s;

    if r.drop_candidate <> keep_name then
      drop_name := r.drop_candidate;
      if run then
        execute format('drop index if exists %I.%I;', r.schema_name, drop_name);
      end if;
      step := 'indexes';
      object_type := 'index';
      schema_name := r.schema_name;
      table_name := r.table_name;
      name := drop_name;
      action := case when run then 'dropped' else format('would drop (duplicate on [%s])', r.cols_key) end;
      return next;
    end if;
  end loop;

  -- =========================
  -- 3) Post-cleanup hint
  -- =========================
  if run then
    perform pg_sleep(0.1);
    perform set_config('auto_explain.log_analyze','off', false);
  end if;

  return;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.ingest_manus_staging(p_org uuid, p_user uuid, p_payload jsonb, p_client uuid DEFAULT NULL::uuid, p_status staging_status DEFAULT 'pending'::staging_status)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v jsonb;
  v_fmt content_format;
  v_tags text[];
  v_body text;
  v_media jsonb;
  v_meta jsonb;
  v_inserted int := 0;
  v_rc int;
  v_trend text := coalesce(p_payload->>'trend','');
begin
  if p_org is null then
    raise exception 'ingest_manus_staging: p_org is null';
  end if;

  for v in
    select * from jsonb_array_elements(coalesce(p_payload->'variants','[]'::jsonb))
  loop
    -- mapping helper inline, verwacht dat content_format enum de waarde heeft
    v_fmt := case lower(coalesce(v->>'format',''))
      when 'idea' then 'idea'
      when 'outline' then 'outline'
      when 'caption' then 'caption'
      when 'thread' then 'thread'
      when 'blog_draft' then 'blog_draft'
      when 'blog' then 'blog_draft'
      when 'article' then 'blog_draft'
      when 'hook' then 'hook'
      when 'hooks' then 'hook'
      when 'script' then 'script'
      when 'short' then 'script'
      when 'image_prompt' then 'image_prompt'
      when 'newsletter' then 'newsletter'
      when 'email' then 'newsletter'
      when 'short_form' then 'short_form'
      when 'reel' then 'short_form'
      when 'tiktok' then 'short_form'
      else null
    end;

    if v_fmt is null then continue; end if;

    v_body := coalesce(v->>'body','');
    if length(v_body) = 0 then continue; end if;

    v_tags  := (
      select coalesce(array_agg(x), '{}')
      from (select jsonb_array_elements_text(coalesce(v->'tags', coalesce(p_payload->'tags','[]'::jsonb))) x) s
    );
    v_media := coalesce(v->'media_refs','[]'::jsonb);
    v_meta  := coalesce(v->'metadata','{}'::jsonb) || jsonb_build_object('trend', v_trend);

    insert into content_staging (
      org_id, client_id, source_agent,
      trend, source_title, source_url,
      format, body, tags, media_refs, metadata, status, created_by
    ) values (
      p_org, p_client, 'manus',
      nullif(v_trend,''),
      null, null,
      v_fmt,
      v_body,
      v_tags,
      v_media,
      jsonb_strip_nulls(v_meta),
      p_status,
      p_user
    )
    on conflict do nothing;

    get diagnostics v_rc = row_count;
    if v_rc > 0 then v_inserted := v_inserted + 1; end if;
  end loop;

  return v_inserted;
end $function$
;

CREATE OR REPLACE FUNCTION public.ingest_unified_staging(p_org uuid, p_user uuid, p_payload jsonb, p_client uuid DEFAULT NULL::uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  has_items boolean := jsonb_typeof(p_payload->'items') = 'array';
  has_variants boolean := jsonb_typeof(p_payload->'variants') = 'array';
  total int := 0;
begin
  if has_items then
    total := total + ingest_grok_staging(p_org, p_user, p_payload, p_client);
  end if;

  if has_variants then
    total := total + ingest_manus_staging(p_org, p_user, p_payload, p_client);
  end if;

  if not has_items and not has_variants then
    raise exception 'Payload must contain "items" (GROK) or "variants" (MANUS)';
  end if;

  return total;
end $function$
;

CREATE OR REPLACE FUNCTION public._to_platform(p text)
 RETURNS platform_kind
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  if p is null or length(trim(p))=0 then return null; end if;
  case lower(p)
    when 'facebook'   then return 'facebook';
    when 'instagram'  then return 'instagram';
    when 'linkedin'   then return 'linkedin';
    when 'tiktok'     then return 'tiktok';
    when 'x','twitter' then return 'x';
    else return null;
  end case;
end $function$
;

CREATE OR REPLACE FUNCTION public.set_published_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.status IS NOT NULL
     AND NEW.status::text = 'published'
     AND (OLD IS NULL OR OLD.status IS DISTINCT FROM NEW.status)
  THEN
    IF NEW.published_at IS NULL THEN
      NEW.published_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_org_member_txt(p_user uuid, p_roles text[])
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select exists (
    select 1
    from public.org_members m
    where m.user_id = p_user
      and (p_roles is null or m.role::text = any(p_roles))
  );
$function$
;

CREATE OR REPLACE FUNCTION public.ingest_content_batch(p_items jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  _count int := 0;
  _skipped int := 0;
  _it jsonb;
  _tags text[];
  _org uuid := 'b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8';  -- <- jouw vaste ORG
  _org_id uuid;
  _fmt content_format;
  _title text;
  _url text;
  _body text;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'p_items must be JSON array';
  end if;

  for _it in select value from jsonb_array_elements(p_items)
  loop
    -- ORG: neem p_items.org_id als die er is, anders fallback naar vaste _org
    _org_id := coalesce(nullif(_it->>'org_id','')::uuid, _org);

    -- Verplichte velden ophalen
    _title := nullif(_it->>'source_title','');
    _url   := nullif(_it->>'source_url','');
    _body  := nullif(_it->>'body','');

    -- Format mappen (defaullt = short_form)
    _fmt := case lower(coalesce(_it->>'format','short_form'))
              when 'idea'         then 'idea'::content_format
              when 'outline'      then 'outline'::content_format
              when 'caption'      then 'caption'::content_format
              when 'thread'       then 'thread'::content_format
              when 'blog_draft'   then 'blog_draft'::content_format
              when 'hook'         then 'hook'::content_format
              when 'script'       then 'script'::content_format
              when 'image_prompt' then 'image_prompt'::content_format
              when 'newsletter'   then 'newsletter'::content_format
              when 'short_form'   then 'short_form'::content_format
              when 'text'         then 'short_form'::content_format  -- legacy
              else 'short_form'::content_format
            end;

    -- Tags JSONB -> text[]
    _tags := coalesce(
      (select array_agg(lower(elem))
       from jsonb_array_elements_text(coalesce(_it->'tags','[]'::jsonb)) as elem),
      ARRAY[]::text[]
    );

    -- Hard-stop validatie: als kritieke velden missen, skip + log
    if _org_id is null or _title is null or _url is null or _body is null then
      insert into public.grok_ingest_logs(status, org_id, payload, error_text)
      values ('error', coalesce(_org_id::text, '<null>'),
              _it, 'missing required field (org_id/title/url/body)');
      _skipped := _skipped + 1;
      continue;
    end if;

    insert into public.content_staging (
      org_id, client_id, source_agent, trend, source_title, source_url,
      format, body, tags, media_refs, metadata, status, created_by,
      created_at, updated_at
    )
    values (
      _org_id,
      nullif(_it->>'client_id','')::uuid,
      coalesce(nullif(_it->>'source_agent',''),'grok')::agent_kind,
      nullif(_it->>'trend',''),
      _title,
      _url,
      _fmt,
      _body,
      _tags,
      coalesce(_it->'media_refs','{}'::jsonb),
      coalesce(_it->'metadata','{}'::jsonb),
      'draft'::staging_status,
      nullif(_it->>'created_by','')::uuid,
      coalesce((_it->>'created_at')::timestamptz, now()),
      coalesce((_it->>'updated_at')::timestamptz, now())
    )
    on conflict (org_id, source_title, source_url) do update
      set body       = excluded.body,
          tags       = excluded.tags,
          media_refs = excluded.media_refs,
          metadata   = excluded.metadata,
          status     = excluded.status,
          updated_at = now();

    _count := _count + 1;
  end loop;

  return jsonb_build_object('status','ok','processed',_count,'skipped',_skipped);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.can_access_client(p_client uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select exists (
    select 1 from client_users cu
    where cu.client_id = p_client and cu.user_id = auth.uid()
  ) or exists (
    select 1
    from clients c
    join org_members m on m.org_id = c.org_id
    where c.id = p_client and m.user_id = auth.uid()
  );
$function$
;

CREATE OR REPLACE FUNCTION public.client_org(p_client uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select org_id from clients where id = p_client
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  new.updated_at = now();
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024))
 RETURNS SETOF realtime.wal_rls
 LANGUAGE plpgsql
AS $function$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$function$
;

CREATE OR REPLACE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$function$
;

CREATE OR REPLACE FUNCTION public.safe_current_setting(name text, missing_ok boolean DEFAULT false)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT current_setting(name, missing_ok)
$function$
;

CREATE OR REPLACE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[])
 RETURNS text
 LANGUAGE sql
AS $function$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $function$
;

CREATE OR REPLACE FUNCTION realtime."cast"(val text, type_ regtype)
 RETURNS jsonb
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $function$
;

CREATE OR REPLACE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at_staging()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  new.updated_at = now();
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.tg_posts_set_author()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.author_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.author_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[])
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
AS $function$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $function$
;

CREATE OR REPLACE FUNCTION public.tg_messages_sync_read()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Bij insert: als één van de twee ontbreekt, vul met de ander
    IF NEW.is_read IS NULL THEN NEW.is_read := COALESCE(NEW."read", FALSE); END IF;
    IF NEW."read" IS NULL THEN NEW."read" := COALESCE(NEW.is_read, FALSE); END IF;
  ELSE
    -- Bij update: als 'read' verandert, volg laten leiden;
    -- anders, als is_read verandert, spiegel naar 'read'
    IF NEW."read" IS DISTINCT FROM OLD."read" THEN
      NEW.is_read := NEW."read";
    ELSIF NEW.is_read IS DISTINCT FROM OLD.is_read THEN
      NEW."read" := NEW.is_read;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer)
 RETURNS SETOF realtime.wal_rls
 LANGUAGE sql
 SET log_min_messages TO 'fatal'
AS $function$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $function$
;

CREATE OR REPLACE FUNCTION public.set_org_id_on_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_org uuid;
begin
  if new.org_id is null then
    select public.user_primary_org() into v_org;
    if v_org is not null then
      new.org_id := v_org;
    end if;
  end if;
  return new;
end$function$
;

CREATE OR REPLACE FUNCTION realtime.quote_wal2json(entity regclass)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $function$
;

CREATE OR REPLACE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.safe_auth_uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT auth.uid()
$function$
;

CREATE OR REPLACE FUNCTION public.get_staging_count(p_search text DEFAULT NULL::text, p_tags text[] DEFAULT NULL::text[], p_trend text DEFAULT NULL::text)
 RETURNS bigint
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select count(*)
  from public.staging_content sc
  where
    (p_trend is null or sc.trend = p_trend)
    and (p_tags is null or sc.tags && p_tags)
    and (
      p_search is null
      or sc.search_tsv @@ plainto_tsquery('simple', p_search)
      or sc.trend        ilike ('%' || p_search || '%')
      or sc.source_title ilike ('%' || p_search || '%')
      or sc.summary      ilike ('%' || p_search || '%')
    );
$function$
;

CREATE OR REPLACE FUNCTION public.safe_auth_role()
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT auth.role()
$function$
;

CREATE OR REPLACE FUNCTION realtime.subscription_check_filters()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $function$
;

CREATE OR REPLACE FUNCTION realtime.to_regrole(role_name text)
 RETURNS regrole
 LANGUAGE sql
 IMMUTABLE
AS $function$ select role_name::regrole $function$
;

CREATE OR REPLACE FUNCTION realtime.topic()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
select nullif(current_setting('realtime.topic', true), '')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.dataset_org(p_dataset uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select org_id from ai_datasets where id = p_dataset
$function$
;

CREATE OR REPLACE FUNCTION public.example_org(p_example uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select d.org_id
  from ai_examples e
  join ai_datasets d on d.id = e.dataset_id
  where e.id = p_example
$function$
;

CREATE OR REPLACE FUNCTION public.get_latest_grok_output(p_org_id uuid, p_client_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 5)
 RETURNS TABLE(id uuid, org_id uuid, client_id uuid, source_agent text, trend text, source_title text, source_url text, format text, body text, tags text[], media_refs jsonb, metadata jsonb, status text, created_by uuid, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- RLS uitschakelen voor deze transactie
  perform set_config('row_security', 'off', true);

  return query
    select cs.id,
           cs.org_id,
           cs.client_id,
           cs.source_agent::text,
           cs.trend,
           cs.source_title,
           cs.source_url,
           cs.format::text,
           cs.body,
           cs.tags,
           cs.media_refs,
           cs.metadata,
           cs.status::text,
           cs.created_by,
           cs.created_at,
           cs.updated_at
    from public.content_staging as cs
    where cs.org_id = p_org_id
      and (p_client_id is null or cs.client_id = p_client_id)
    order by cs.created_at desc
    limit p_limit;
end;
$function$
;

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_posts_set_author BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION tg_posts_set_author();

CREATE TRIGGER trg_posts_set_published_at BEFORE INSERT OR UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION set_published_at();

CREATE TRIGGER trg_posts_fts AFTER INSERT OR DELETE OR UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION posts_fts_refresh();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();

CREATE TRIGGER ideas_set_org_id BEFORE INSERT ON public.ideas FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER previews_set_org_id BEFORE INSERT ON public.previews FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER blog_posts_set_org_id BEFORE INSERT ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER publishes_set_org_id BEFORE INSERT ON public.publishes FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER blog_posts_orgs_set_org_id BEFORE INSERT ON public.blog_posts_orgs FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_messages_set_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION tg_messages_set_updated_at();

CREATE TRIGGER trg_messages_sync_read AFTER UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION tg_messages_sync_read();
