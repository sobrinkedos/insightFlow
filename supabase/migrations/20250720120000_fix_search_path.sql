/*
          # [Fix] Set search_path for handle_new_user function
          This migration updates the `handle_new_user` function to explicitly set the `search_path`. This is a security best practice to prevent potential function hijacking by malicious users who might create objects in other schemas.

          ## Query Description: 
          This operation modifies a database function. It is a safe, non-destructive change that improves security. No data will be affected.

          ## Metadata:
          - Schema-Category: "Safe"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Function `public.handle_new_user` will be replaced with a more secure version.
          
          ## Security Implications:
          - RLS Status: Not changed
          - Policy Changes: No
          - Auth Requirements: None
          - Mitigates the "Function Search Path Mutable" security advisory by isolating the function's execution scope.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact.
          */
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;
