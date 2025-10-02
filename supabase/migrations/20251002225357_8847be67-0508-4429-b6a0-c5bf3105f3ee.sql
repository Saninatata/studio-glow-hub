-- Fix job application status manipulation vulnerability

-- Add UPDATE policy that allows only job owners to update application status
CREATE POLICY "Job owners can update application status"
ON public.job_applications
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.jobs 
    WHERE id = job_applications.job_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM public.jobs 
    WHERE id = job_applications.job_id
  )
);

-- Also add a DELETE policy so job owners can delete applications if needed
CREATE POLICY "Job owners can delete applications"
ON public.job_applications
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.jobs 
    WHERE id = job_applications.job_id
  )
);