-- Fix the security definer view issue by making it a normal view (non-definer)
DROP VIEW IF EXISTS public.user_public_profiles;

CREATE VIEW public.user_public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  username
FROM public.users;

-- Grant explicit permissions
GRANT SELECT ON public.user_public_profiles TO anon, authenticated;

-- Fix search_path mutable functions by setting secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_post(p_content text, p_image_url text DEFAULT NULL::text, p_video_url text DEFAULT NULL::text, p_tags text[] DEFAULT '{}'::text[])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_post_id UUID;
BEGIN
  INSERT INTO public.posts (
    user_id,
    content,
    image_url,
    video_url,
    tags,
    likes_count,
    comments_count,
    shares_count
  ) VALUES (
    auth.uid(),
    p_content,
    p_image_url,
    p_video_url,
    p_tags,
    0,
    0,
    0
  ) RETURNING id INTO new_post_id;
  
  RETURN new_post_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_posts_with_users()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  content text,
  image_url text,
  video_url text,
  tags text[],
  likes_count integer,
  comments_count integer,
  shares_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  user_full_name text,
  user_avatar_url text
)
LANGUAGE sql
STABLE
SET search_path = public
AS $function$
  SELECT 
    p.id,
    p.user_id,
    p.content,
    p.image_url,
    p.video_url,
    p.tags,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.created_at,
    p.updated_at,
    u.full_name AS user_full_name,
    u.avatar_url AS user_avatar_url
  FROM public.posts p
  LEFT JOIN public.user_public_profiles u ON p.user_id = u.id
  ORDER BY p.created_at DESC;
$function$;

CREATE OR REPLACE FUNCTION public.get_projects_with_users()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  description text,
  image_url text,
  tags text[],
  likes_count integer,
  comments_count integer,
  views_count integer,
  created_at timestamptz,
  updated_at timestamptz,
  user_full_name text,
  user_avatar_url text
)
LANGUAGE sql
STABLE
SET search_path = public
AS $function$
  SELECT 
    pr.id,
    pr.user_id,
    pr.title,
    pr.description,
    pr.image_url,
    pr.tags,
    pr.likes_count,
    pr.comments_count,
    pr.views_count,
    pr.created_at,
    pr.updated_at,
    u.full_name AS user_full_name,
    u.avatar_url AS user_avatar_url
  FROM public.projects pr
  LEFT JOIN public.user_public_profiles u ON pr.user_id = u.id
  ORDER BY pr.created_at DESC;
$function$;