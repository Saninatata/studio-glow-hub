-- Fix security issues with user data exposure

-- 1. Drop the existing view and create a proper table for public profiles
DROP VIEW IF EXISTS public.user_public_profiles;

-- Create a proper table for public user profiles
CREATE TABLE public.user_public_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  username text
);

-- Enable RLS on the new table
ALTER TABLE public.user_public_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view public profiles
CREATE POLICY "Anyone can view public profiles"
ON public.user_public_profiles
FOR SELECT
USING (true);

-- Allow users to update their own public profile
CREATE POLICY "Users can update their own public profile"
ON public.user_public_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Allow users to insert their own public profile
CREATE POLICY "Users can insert their own public profile"
ON public.user_public_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 2. Create a function to sync public profile data when users table is updated
CREATE OR REPLACE FUNCTION public.sync_user_public_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update the public profile
  INSERT INTO public.user_public_profiles (id, full_name, avatar_url, username)
  VALUES (NEW.id, NEW.full_name, NEW.avatar_url, NEW.username)
  ON CONFLICT (id) 
  DO UPDATE SET
    full_name = NEW.full_name,
    avatar_url = NEW.avatar_url,
    username = NEW.username;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync public profile data
CREATE TRIGGER sync_user_public_profile_trigger
AFTER INSERT OR UPDATE OF full_name, avatar_url, username ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_public_profile();

-- 3. Populate existing data into the new table
INSERT INTO public.user_public_profiles (id, full_name, avatar_url, username)
SELECT id, full_name, avatar_url, username
FROM public.users
ON CONFLICT (id) DO NOTHING;

-- 4. Fix notifications table - restrict who can create notifications
DROP POLICY IF EXISTS "Anyone can create notifications" ON public.notifications;

-- Only authenticated users can create notifications (not anonymous)
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);