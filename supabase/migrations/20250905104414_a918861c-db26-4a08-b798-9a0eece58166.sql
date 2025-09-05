-- Create function to get talents with user information
CREATE OR REPLACE FUNCTION public.get_talents_with_users()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  description text,
  skills text[],
  hourly_rate text,
  availability text,
  location text,
  experience text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_full_name text,
  user_avatar_url text
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    t.id,
    t.user_id,
    t.title,
    t.description,
    t.skills,
    t.hourly_rate,
    t.availability,
    t.location,
    t.experience,
    t.created_at,
    t.updated_at,
    u.full_name AS user_full_name,
    u.avatar_url AS user_avatar_url
  FROM public.talents t
  LEFT JOIN public.user_public_profiles u ON t.user_id = u.id
  ORDER BY t.created_at DESC;
$$;

-- Create function to get jobs with user information
CREATE OR REPLACE FUNCTION public.get_jobs_with_users()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  company text,
  location text,
  salary text,
  job_type text,
  description text,
  requirements text,
  tags text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_full_name text,
  user_avatar_url text
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    j.id,
    j.user_id,
    j.title,
    j.company,
    j.location,
    j.salary,
    j.job_type,
    j.description,
    j.requirements,
    j.tags,
    j.created_at,
    j.updated_at,
    u.full_name AS user_full_name,
    u.avatar_url AS user_avatar_url
  FROM public.jobs j
  LEFT JOIN public.user_public_profiles u ON j.user_id = u.id
  ORDER BY j.created_at DESC;
$$;