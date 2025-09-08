-- Create follows table for user following functionality
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create policies for follows
CREATE POLICY "Users can view follows" 
ON public.follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own follows" 
ON public.follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" 
ON public.follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Create function to toggle project likes (similar to post likes)
CREATE OR REPLACE FUNCTION public.toggle_project_like(project_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  like_exists BOOLEAN;
  project_author_id UUID;
  liker_name TEXT;
BEGIN
  -- Get project author and liker info
  SELECT p.user_id, COALESCE(u.full_name, 'Someone')
  FROM projects p
  LEFT JOIN user_public_profiles u ON auth.uid() = u.id
  WHERE p.id = project_id_param
  INTO project_author_id, liker_name;
  
  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM project_likes 
    WHERE project_id = project_id_param AND user_id = auth.uid()
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Remove like
    DELETE FROM project_likes 
    WHERE project_id = project_id_param AND user_id = auth.uid();
    
    -- Update project likes count
    UPDATE projects 
    SET likes_count = likes_count - 1 
    WHERE id = project_id_param;
    
    RETURN FALSE;
  ELSE
    -- Add like
    INSERT INTO project_likes (project_id, user_id) 
    VALUES (project_id_param, auth.uid());
    
    -- Update project likes count
    UPDATE projects 
    SET likes_count = likes_count + 1 
    WHERE id = project_id_param;
    
    -- Send notification to project author (if not liking own project)
    IF project_author_id != auth.uid() THEN
      PERFORM create_notification(
        project_author_id,
        'like',
        'New Like',
        liker_name || ' liked your project',
        project_id_param
      );
    END IF;
    
    RETURN TRUE;
  END IF;
END;
$$;

-- Create function to toggle user follows
CREATE OR REPLACE FUNCTION public.toggle_follow(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  follow_exists BOOLEAN;
  follower_name TEXT;
BEGIN
  -- Get follower name
  SELECT COALESCE(u.full_name, 'Someone')
  FROM user_public_profiles u 
  WHERE u.id = auth.uid()
  INTO follower_name;
  
  -- Check if follow already exists
  SELECT EXISTS(
    SELECT 1 FROM follows 
    WHERE follower_id = auth.uid() AND following_id = target_user_id
  ) INTO follow_exists;
  
  IF follow_exists THEN
    -- Unfollow
    DELETE FROM follows 
    WHERE follower_id = auth.uid() AND following_id = target_user_id;
    
    RETURN FALSE;
  ELSE
    -- Follow
    INSERT INTO follows (follower_id, following_id) 
    VALUES (auth.uid(), target_user_id);
    
    -- Send notification to target user
    PERFORM create_notification(
      target_user_id,
      'follow',
      'New Follower',
      follower_name || ' started following you',
      null
    );
    
    RETURN TRUE;
  END IF;
END;
$$;