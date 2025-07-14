-- Create a function to create posts
CREATE OR REPLACE FUNCTION public.create_post(
  p_content TEXT,
  p_image_url TEXT DEFAULT NULL,
  p_video_url TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;