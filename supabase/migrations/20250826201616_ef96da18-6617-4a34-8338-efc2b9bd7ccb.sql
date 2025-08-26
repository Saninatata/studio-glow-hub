-- 1) Restrict users table SELECT policy (remove public access)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;

-- 2) Create a safe public view exposing non-sensitive profile fields
CREATE OR REPLACE VIEW public.user_public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  username
FROM public.users;

-- Ensure everyone can read the public view (no emails exposed)
GRANT SELECT ON public.user_public_profiles TO anon, authenticated;

-- 3) Update posts helper to stop exposing emails and use the public view
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

-- 4) Add a projects helper that also uses the public view
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