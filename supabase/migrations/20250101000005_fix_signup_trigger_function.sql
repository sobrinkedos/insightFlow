/*
# [Fix] Correct User Profile Creation Trigger
[This migration fixes a bug where new user sign-ups would fail due to a conflict between Row Level Security (RLS) and the database trigger responsible for creating user profiles. The function is updated to run with `SECURITY DEFINER` privileges, allowing it to bypass the user-specific RLS policy just for the moment of profile creation.]

## Query Description: [This operation temporarily drops the user creation trigger, replaces the underlying function with a more secure version, and then reinstates the trigger. This ensures that new user registrations will succeed without compromising the security of existing data. No data will be lost.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Drops trigger `on_auth_user_created` on `auth.users`.
- Drops function `public.handle_new_user`.
- Creates function `public.handle_new_user` with `SECURITY DEFINER`.
- Creates trigger `on_auth_user_created` on `auth.users`.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [The function `handle_new_user` will now run with definer's rights, which is a standard and secure practice for this specific use case.]

## Performance Impact:
- Indexes: [None]
- Triggers: [Replaced]
- Estimated Impact: [Negligible. This only affects the user creation process.]
*/

-- Step 1: Drop the existing trigger on the auth.users table.
-- This is necessary before we can drop the function it depends on.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the old function that was causing the permission issue.
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Recreate the function with SECURITY DEFINER.
-- This allows the function to run with the permissions of the user who created it,
-- bypassing the RLS policy of the new user who doesn't yet have rights to insert into their own profile.
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

-- Step 4: Recreate the trigger to call the new, corrected function.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
