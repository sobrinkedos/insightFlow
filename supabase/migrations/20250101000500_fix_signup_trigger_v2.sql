/*
  # [Fix] User Profile Creation Trigger v2
  This migration fixes a bug where new user sign-ups failed due to a conflict between Row Level Security (RLS) policies and the database trigger responsible for creating user profiles. This version correctly handles object dependencies.

  ## Query Description:
  The operation temporarily removes the user creation trigger, updates the underlying function to run with elevated privileges (`SECURITY DEFINER`), and then reinstates the trigger. This allows the system to create a user profile record automatically upon sign-up without being blocked by RLS policies. This is a standard and safe procedure for this specific Supabase use case. No user data is at risk.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Drops trigger `on_auth_user_created` on `auth.users`.
  - Recreates function `public.handle_new_user()` with `SECURITY DEFINER`.
  - Recreates trigger `on_auth_user_created` on `auth.users`.

  ## Security Implications:
  - RLS Status: Unchanged
  - Policy Changes: No
  - Auth Requirements: The function will now run as the definer, which is necessary for this specific operation to succeed.

  ## Performance Impact:
  - Indexes: None
  - Triggers: Recreated
  - Estimated Impact: Negligible. The trigger execution time is minimal.
*/

-- Step 1: Drop the existing trigger to remove the dependency on the function.
drop trigger if exists on_auth_user_created on auth.users;

-- Step 2: Recreate the function with the necessary `SECURITY DEFINER` clause.
-- This allows the function to bypass RLS policies when creating a new profile.
create or replace function public.handle_new_user()
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

-- Step 3: Re-create the trigger to call the updated function after a new user is created.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
