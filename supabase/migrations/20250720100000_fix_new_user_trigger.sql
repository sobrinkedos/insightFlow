/*
# [Fix] Update New User Trigger
This migration fixes an error that occurs during user signup. The previous trigger (`handle_new_user`) conflicted with the Row Level Security (RLS) policy on the `profiles` table, causing the database to reject the creation of a new user profile.

## Query Description:
This operation modifies the `handle_new_user` function to run with `SECURITY DEFINER` privileges. This allows the function to bypass the RLS policy temporarily and securely insert a new row into the `public.profiles` table when a new user signs up. This is a standard and safe pattern for this type of trigger. It also explicitly sets the `search_path` within the function for added security.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Function `public.handle_new_user()` will be dropped and recreated.

## Security Implications:
- RLS Status: Unchanged.
- Policy Changes: No.
- Auth Requirements: This change allows the authentication trigger to function correctly. The function is now more secure by running with defined privileges and a set search path.
*/

-- Drop the existing function to redefine it
drop function if exists public.handle_new_user();

-- Recreate the function with SECURITY DEFINER
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- The trigger that calls this function remains unchanged.
