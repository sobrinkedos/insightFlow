/*
# [Fix & Setup Initial Schema]
This migration corrects a syntax error from the previous script and sets up the initial database schema for InsightShare.

## Query Description:
This script fixes the `timestamptz with time zone` syntax error and correctly defines the database structure.
1.  **Enables pgvector:** Adds the `vector` extension required for semantic search.
2.  **Creates `profiles` table:** Stores user-specific data, linked to `auth.users`.
3.  **Creates `videos` table:** Stores information about shared videos.
4.  **Creates `themes` table:** Stores consolidated themes generated from videos.
5.  **Sets up Row Level Security (RLS):** Policies are added to ensure users can only access their own data.
6.  **Creates a trigger:** Automatically creates a user profile upon new user signup.
This is a foundational script and is safe to run on a new project.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: false

## Structure Details:
- Extensions: `vector`
- Tables: `profiles`, `videos`, `themes`, `theme_videos`
- Policies: RLS policies for all new tables.
- Triggers: `on_auth_user_created`

## Security Implications:
- RLS Status: Enabled for all new tables.
- Policy Changes: Yes, new policies are created.
- Auth Requirements: Policies reference `auth.uid()`.

## Performance Impact:
- Indexes: Primary keys and foreign keys are indexed by default.
- Triggers: One trigger on `auth.users` table.
- Estimated Impact: Low on a new system.
*/

-- 1. Enable vector extension
create extension if not exists vector with schema extensions;

-- 2. Create Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- 3. Create Videos table
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  url text not null,
  title text,
  channel text,
  tags text[],
  transcription text,
  summary_short text,
  summary_expanded text,
  topics text[],
  keywords text[],
  category text,
  subcategory text,
  embedding vector(1536), -- Assuming OpenAI's text-embedding-ada-002 model
  status text default 'pending' not null, -- pending, processing, completed, failed
  created_at timestamptz default timezone('utc'::text, now()) not null,
  processed_at timestamptz
);

-- Set up Row Level Security (RLS)
alter table public.videos enable row level security;
create policy "Users can view their own videos." on public.videos for select using (auth.uid() = user_id);
create policy "Users can insert their own videos." on public.videos for insert with check (auth.uid() = user_id);
create policy "Users can update their own videos." on public.videos for update using (auth.uid() = user_id);
create policy "Users can delete their own videos." on public.videos for delete using (auth.uid() = user_id);

-- 4. Create Themes table
create table public.themes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  description text,
  consolidated_summary text,
  keywords text[],
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz
);

-- Junction table for themes and videos (many-to-many)
create table public.theme_videos (
  theme_id uuid references public.themes on delete cascade not null,
  video_id uuid references public.videos on delete cascade not null,
  primary key (theme_id, video_id)
);

-- Set up Row Level Security (RLS) for themes
alter table public.themes enable row level security;
create policy "Users can view their own themes." on public.themes for select using (auth.uid() = user_id);
create policy "Users can insert their own themes." on public.themes for insert with check (auth.uid() = user_id);
create policy "Users can update their own themes." on public.themes for update using (auth.uid() = user_id);
create policy "Users can delete their own themes." on public.themes for delete using (auth.uid() = user_id);

-- Set up RLS for theme_videos junction table
alter table public.theme_videos enable row level security;
create policy "Users can manage video links for their own themes." on public.theme_videos
  for all using (
    auth.uid() = (select user_id from public.themes where id = theme_id)
  );

-- 5. Create a trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
