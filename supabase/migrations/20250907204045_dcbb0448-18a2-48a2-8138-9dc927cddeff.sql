-- Create messages table for conversations
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view their own messages" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to send notifications for post interactions
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_id
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_related_id
  ) RETURNING id INTO new_notification_id;
  
  RETURN new_notification_id;
END;
$$;

-- Update toggle_post_like function to include notifications
CREATE OR REPLACE FUNCTION public.toggle_post_like(post_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  like_exists BOOLEAN;
  post_author_id UUID;
  liker_name TEXT;
BEGIN
  -- Get post author and liker info
  SELECT p.user_id, COALESCE(u.full_name, 'Someone')
  FROM posts p
  LEFT JOIN user_public_profiles u ON auth.uid() = u.id
  WHERE p.id = post_id_param
  INTO post_author_id, liker_name;
  
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
    
    -- Send notification to post author (if not liking own post)
    IF post_author_id != auth.uid() THEN
      PERFORM create_notification(
        post_author_id,
        'like',
        'New Like',
        liker_name || ' liked your post',
        post_id_param
      );
    END IF;
    
    RETURN TRUE;
  END IF;
END;
$$;

-- Update create_post_comment function to include notifications
CREATE OR REPLACE FUNCTION public.create_post_comment(post_id_param uuid, content_param text)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  new_comment_id UUID;
  post_author_id UUID;
  commenter_name TEXT;
BEGIN
  -- Get post author and commenter info
  SELECT p.user_id, COALESCE(u.full_name, 'Someone')
  FROM posts p
  LEFT JOIN user_public_profiles u ON auth.uid() = u.id
  WHERE p.id = post_id_param
  INTO post_author_id, commenter_name;

  -- Insert comment
  INSERT INTO post_comments (post_id, user_id, content)
  VALUES (post_id_param, auth.uid(), content_param)
  RETURNING id INTO new_comment_id;
  
  -- Update post comments count
  UPDATE posts 
  SET comments_count = comments_count + 1 
  WHERE id = post_id_param;
  
  -- Send notification to post author (if not commenting on own post)
  IF post_author_id != auth.uid() THEN
    PERFORM create_notification(
      post_author_id,
      'comment',
      'New Comment',
      commenter_name || ' commented on your post',
      post_id_param
    );
  END IF;
  
  RETURN new_comment_id;
END;
$$;

-- Create function to handle share notifications
CREATE OR REPLACE FUNCTION public.share_post(post_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  post_author_id UUID;
  sharer_name TEXT;
BEGIN
  -- Get post author and sharer info
  SELECT p.user_id, COALESCE(u.full_name, 'Someone')
  FROM posts p
  LEFT JOIN user_public_profiles u ON auth.uid() = u.id
  WHERE p.id = post_id_param
  INTO post_author_id, sharer_name;
  
  -- Update share count
  UPDATE posts 
  SET shares_count = shares_count + 1 
  WHERE id = post_id_param;
  
  -- Send notification to post author (if not sharing own post)
  IF post_author_id != auth.uid() THEN
    PERFORM create_notification(
      post_author_id,
      'share',
      'Post Shared',
      sharer_name || ' shared your post',
      post_id_param
    );
  END IF;
  
  RETURN TRUE;
END;
$$;