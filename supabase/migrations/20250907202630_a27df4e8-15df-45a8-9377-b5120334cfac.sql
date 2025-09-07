-- Fix notification table RLS policies to allow inserting notifications
CREATE POLICY "Anyone can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create post_likes table for tracking likes
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS on post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for post_likes
CREATE POLICY "Anyone can view likes" 
ON public.post_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.post_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create comments table for posts
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on post_comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for post_comments
CREATE POLICY "Anyone can view comments" 
ON public.post_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.post_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.post_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.post_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating updated_at on post_comments
CREATE TRIGGER update_post_comments_updated_at
BEFORE UPDATE ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to toggle post like
CREATE OR REPLACE FUNCTION public.toggle_post_like(post_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  like_exists BOOLEAN;
  new_like_count INTEGER;
BEGIN
  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM post_likes 
    WHERE post_id = post_id_param AND user_id = auth.uid()
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Remove like
    DELETE FROM post_likes 
    WHERE post_id = post_id_param AND user_id = auth.uid();
    
    -- Update post likes count
    UPDATE posts 
    SET likes_count = likes_count - 1 
    WHERE id = post_id_param;
    
    RETURN FALSE;
  ELSE
    -- Add like
    INSERT INTO post_likes (post_id, user_id) 
    VALUES (post_id_param, auth.uid());
    
    -- Update post likes count
    UPDATE posts 
    SET likes_count = likes_count + 1 
    WHERE id = post_id_param;
    
    RETURN TRUE;
  END IF;
END;
$$;

-- Function to create comment and update count
CREATE OR REPLACE FUNCTION public.create_post_comment(post_id_param UUID, content_param TEXT)
RETURNS UUID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_comment_id UUID;
BEGIN
  -- Insert comment
  INSERT INTO post_comments (post_id, user_id, content)
  VALUES (post_id_param, auth.uid(), content_param)
  RETURNING id INTO new_comment_id;
  
  -- Update post comments count
  UPDATE posts 
  SET comments_count = comments_count + 1 
  WHERE id = post_id_param;
  
  RETURN new_comment_id;
END;
$$;