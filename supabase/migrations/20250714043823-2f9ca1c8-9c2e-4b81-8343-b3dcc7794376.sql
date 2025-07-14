-- Create a function to get posts with user details
CREATE OR REPLACE FUNCTION public.get_posts_with_users()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  likes_count INTEGER,
  comments_count INTEGER,
  shares_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  user_full_name TEXT,
  user_avatar_url TEXT,
  user_email TEXT
)
LANGUAGE SQL
STABLE
AS $$
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
    u.full_name as user_full_name,
    u.avatar_url as user_avatar_url,
    u.email as user_email
  FROM public.posts p
  LEFT JOIN public.users u ON p.user_id = u.id
  ORDER BY p.created_at DESC;
$$;