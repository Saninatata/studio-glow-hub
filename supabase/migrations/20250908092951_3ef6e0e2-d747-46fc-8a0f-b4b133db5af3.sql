-- Fix SECURITY DEFINER function to use STABLE and proper search path
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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