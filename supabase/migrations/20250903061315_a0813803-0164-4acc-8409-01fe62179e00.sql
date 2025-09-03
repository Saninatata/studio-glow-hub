-- Analyze and potentially fix SECURITY DEFINER functions
-- The create_post function needs SECURITY DEFINER to access auth.uid()
-- The update_updated_at_column is a trigger function that needs SECURITY DEFINER
-- However, let's check if we can make create_post work without SECURITY DEFINER

-- First, let's see if the functions are working correctly as SECURITY INVOKER
-- We'll modify create_post to use SECURITY INVOKER and see if it works

DROP FUNCTION IF EXISTS public.create_post(text, text, text, text[]);

CREATE OR REPLACE FUNCTION public.create_post(
  p_content text, 
  p_image_url text DEFAULT NULL, 
  p_video_url text DEFAULT NULL, 
  p_tags text[] DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER  -- Changed from SECURITY DEFINER
SET search_path TO 'public'
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