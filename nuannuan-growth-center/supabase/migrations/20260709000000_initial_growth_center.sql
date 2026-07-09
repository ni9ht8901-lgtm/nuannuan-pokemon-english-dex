create extension if not exists pgcrypto;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  auth_user_id uuid,
  display_name text not null,
  role text not null check (role in ('father', 'mother', 'child', 'guardian')),
  child_pin_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  device_key text not null,
  label text not null,
  platform text,
  trusted boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  unique (family_id, device_key)
);

create table if not exists public.projects (
  id text primary key,
  family_id uuid references public.families(id) on delete cascade,
  name text not null,
  type text not null check (type in ('pwa', 'picture_book', 'web_app', 'unknown')),
  description text not null default '',
  status text not null default 'discovered',
  cover text not null default '',
  url text not null default '',
  repository text not null default '',
  local_path text not null default '',
  age_range text not null default '',
  goals jsonb not null default '[]'::jsonb,
  progress_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  version text not null,
  released_at timestamptz not null default now(),
  changelog text not null,
  git_commit text not null default '',
  pull_request text not null default '',
  deployment_url text not null default '',
  deployment_status text not null default 'unknown',
  database_migration_status text not null default 'not_applicable',
  affects_legacy_data boolean not null default false,
  unique (project_id, version)
);

create table if not exists public.usage_sessions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  device_id uuid references public.devices(id) on delete set null,
  session_key text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, session_key)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  type text not null,
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  device_id text not null,
  session_id text not null,
  project_version text not null default '',
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now()
);

create table if not exists public.user_project_progress (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  source_event_id text references public.events(event_id),
  updated_at timestamptz not null default now(),
  unique (profile_id, project_id)
);

create table if not exists public.achievements (
  id text primary key,
  project_id text not null references public.projects(id) on delete cascade,
  name text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  source_event_id text references public.events(event_id),
  unique (profile_id, achievement_id)
);

create table if not exists public.picture_books (
  id text primary key,
  family_id uuid references public.families(id) on delete cascade,
  project_id text references public.projects(id) on delete cascade,
  name text not null,
  description text not null default '',
  file_type text not null,
  page_count integer,
  cover text not null default '',
  file_url text not null default '',
  local_path text not null default '',
  theme text not null default '',
  age_range text not null default '',
  status text not null default 'discovered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_records (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  picture_book_id text not null references public.picture_books(id) on delete cascade,
  status text not null check (status in ('not_started', 'reading', 'finished')),
  current_page integer not null default 0,
  read_count integer not null default 0,
  last_read_at timestamptz,
  child_feedback text not null default '',
  parent_notes text not null default '',
  updated_at timestamptz not null default now(),
  unique (profile_id, picture_book_id)
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  project_id text references public.projects(id) on delete cascade,
  title text not null,
  schedule jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.integration_tokens (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  token_hash text not null,
  scope text not null default 'project:write',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.migration_logs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  status text not null,
  source text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sync_conflicts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id text not null references public.projects(id) on delete cascade,
  conflict_type text not null,
  local_value jsonb not null default '{}'::jsonb,
  remote_value jsonb not null default '{}'::jsonb,
  resolution text not null default 'pending',
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_family_profile_project on public.events(family_id, profile_id, project_id);
create index if not exists idx_events_occurred_at on public.events(occurred_at desc);
create index if not exists idx_usage_sessions_project on public.usage_sessions(project_id, started_at desc);
create index if not exists idx_progress_family_project on public.user_project_progress(family_id, project_id);
create index if not exists idx_migration_logs_project on public.migration_logs(project_id, created_at desc);

alter table public.families enable row level security;
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.projects enable row level security;
alter table public.project_versions enable row level security;
alter table public.usage_sessions enable row level security;
alter table public.events enable row level security;
alter table public.user_project_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.picture_books enable row level security;
alter table public.reading_records enable row level security;
alter table public.reminders enable row level security;
alter table public.integration_tokens enable row level security;
alter table public.migration_logs enable row level security;
alter table public.sync_conflicts enable row level security;

create or replace function public.profile_family_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select family_id
  from public.profiles
  where auth_user_id = auth.uid()
$$;

create policy "family members can read families"
on public.families for select
using (id in (select public.profile_family_ids()));

create policy "family members can read profiles"
on public.profiles for select
using (family_id in (select public.profile_family_ids()));

create policy "family members can manage devices"
on public.devices for all
using (family_id in (select public.profile_family_ids()))
with check (family_id in (select public.profile_family_ids()));

create policy "family members can read projects"
on public.projects for select
using (family_id is null or family_id in (select public.profile_family_ids()));

create policy "family members can read project versions"
on public.project_versions for select
using (exists (
  select 1 from public.projects
  where projects.id = project_versions.project_id
    and (projects.family_id is null or projects.family_id in (select public.profile_family_ids()))
));

create policy "family members can insert append-only events"
on public.events for insert
with check (family_id in (select public.profile_family_ids()));

create policy "family members can read own events"
on public.events for select
using (family_id in (select public.profile_family_ids()));

create policy "family members can manage progress"
on public.user_project_progress for all
using (family_id in (select public.profile_family_ids()))
with check (family_id in (select public.profile_family_ids()));

create policy "family members can read achievements"
on public.achievements for select
using (true);

create policy "family members can manage unlocked achievements"
on public.user_achievements for all
using (family_id in (select public.profile_family_ids()))
with check (family_id in (select public.profile_family_ids()));

create policy "family members can read picture books"
on public.picture_books for select
using (family_id is null or family_id in (select public.profile_family_ids()));

create policy "family members can manage reading records"
on public.reading_records for all
using (family_id in (select public.profile_family_ids()))
with check (family_id in (select public.profile_family_ids()));

create policy "family members can read usage sessions"
on public.usage_sessions for select
using (family_id in (select public.profile_family_ids()));

create policy "family members can read migration logs"
on public.migration_logs for select
using (family_id is null or family_id in (select public.profile_family_ids()));

create policy "family members can manage sync conflicts"
on public.sync_conflicts for all
using (family_id in (select public.profile_family_ids()))
with check (family_id in (select public.profile_family_ids()));
