-- Fix security definer view issue
-- Drop the existing view and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.user_public_profiles;

-- Recreate the view without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE VIEW public.user_public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  username
FROM public.users;