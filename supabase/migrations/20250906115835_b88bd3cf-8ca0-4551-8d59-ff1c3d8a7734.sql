-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  related_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create job applications table
CREATE TABLE public.job_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  proposal text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job applications
CREATE POLICY "Users can view applications for their jobs" 
ON public.job_applications 
FOR SELECT 
USING (
  auth.uid() = applicant_id OR 
  auth.uid() IN (SELECT user_id FROM jobs WHERE id = job_id)
);

CREATE POLICY "Users can create job applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (auth.uid() = applicant_id);

-- Create hire requests table
CREATE TABLE public.hire_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_id uuid NOT NULL,
  requester_id uuid NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(talent_id, requester_id)
);

-- Enable Row Level Security
ALTER TABLE public.hire_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for hire requests
CREATE POLICY "Users can view hire requests for their talents" 
ON public.hire_requests 
FOR SELECT 
USING (
  auth.uid() = requester_id OR 
  auth.uid() IN (SELECT user_id FROM talents WHERE id = talent_id)
);

CREATE POLICY "Users can create hire requests" 
ON public.hire_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hire_requests_updated_at
BEFORE UPDATE ON public.hire_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();