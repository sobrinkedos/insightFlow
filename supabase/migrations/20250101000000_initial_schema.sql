/*
# Initial Schema Setup for InsightShare

This migration script sets up the foundational database structure for the InsightShare application. It includes creating tables for user profiles, videos, and themes, enabling the pgvector extension for semantic search capabilities, and establishing row-level security policies to ensure data privacy.

## Query Description:
This script is foundational and designed to be run on a new or empty database. It will:
1. Enable the `vector` extension required for AI embeddings.
2. Create the `profiles` table to store user data, linked to Supabase's authentication.
3. Create `videos`, `themes`, and `theme_videos` tables to store application content.
4. Implement Row-Level Security (RLS) to ensure users can only access their own data.
5. Create a trigger to automatically populate the `profiles` table upon new user sign-up.

This operation is safe to run on a new project. If you have existing tables with the same names, this script will fail. No data will be lost as it only creates new structures.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the created tables and functions)

## Structure Details:
- **Extensions:** `vector`
- **Tables Created:** `profiles`, `videos`, `themes`, `theme_videos`
- **Functions Created:** `handle_new_user`
- **Triggers Created:** `on_auth_user_created`

## Security Implications:
- RLS Status: Enabled on all new tables.
- Policy Changes: Yes, policies are created to restrict data access to the data owner.
- Auth Requirements: Policies rely on `auth.uid()` to identify the current user.

## Performance Impact:
- Indexes: Primary keys and foreign keys are indexed by default.
- Triggers: A trigger is added to `auth.users` which runs once on user creation. Impact is minimal.
- Estimated Impact: Low performance impact.
*/

-- 1. Enable pgvector extension
create extension if not exists vector with schema extensions;

-- 2. Create Profiles Table
create table public.profiles (
  id uuid not null primary key references auth.users on delete cascade,
  updated_at timestamptz,
  username text unique,
  full_name text,
  avatar_url text
);

comment on table public.profiles is 'Profile data for each user.';
comment on column public.profiles.id is 'References the internal Supabase auth user.';

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- 3. Create Videos Table
create table public.videos (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  source text,
  title text,
  channel text,
  transcription text,
  summary_short text,
  summary_expanded text,
  topics text[],
  keywords text[],
  category text,
  subcategory text,
  embedding vector(1536),
  status text default 'pending' not null
);

comment on table public.videos is 'Stores all video content and AI-generated metadata.';
comment on column public.videos.embedding is 'Vector embedding for semantic search.';

-- RLS for videos
alter table public.videos enable row level security;

create policy "Users can manage their own videos."
  on public.videos for all using (auth.uid() = user_id);

-- 4. Create Themes Table
create table public.themes (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  consolidated_summary text,
  keywords text[]
);

comment on table public.themes is 'Consolidated themes grouping similar videos.';

-- RLS for themes
alter table public.themes enable row level security;

create policy "Users can manage their own themes."
  on public.themes for all using (auth.uid() = user_id);

-- 5. Create Theme-Videos Join Table
create table public.theme_videos (
  theme_id uuid not null references public.themes on delete cascade,
  video_id uuid not null references public.videos on delete cascade,
  primary key (theme_id, video_id)
);

comment on table public.theme_videos is 'Join table for many-to-many relationship between themes and videos.';

-- RLS for theme_videos
alter table public.theme_videos enable row level security;

create policy "Users can manage video-theme links if they own the theme."
  on public.theme_videos for all
  using (exists (
    select 1 from public.themes where themes.id = theme_videos.theme_id and themes.user_id = auth.uid()
  ));

-- 6. Function and Trigger to create a profile for new users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
