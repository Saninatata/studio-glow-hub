import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

interface Job {
  id: string
  user_id: string
  title: string
  company: string
  location: string | null
  salary: string | null
  job_type: string | null
  description: string
  requirements: string | null
  tags: string[]
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url?: string | null
  } | null
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const createJob = async (jobData: {
    title: string
    company: string
    location?: string
    salary?: string
    job_type?: string
    description: string
    requirements?: string
    tags?: string[]
  }) => {
    try {
      // Get current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          user_id: authUser.id
        })
        .select()
        .single()

      if (error) throw error
      
      // Refresh jobs list
      await fetchJobs()
      
      return data
    } catch (error) {
      console.error('Error creating job:', error)
      throw error
    }
  }

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (error) throw error
      
      // Refresh jobs list
      await fetchJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  }

  return {
    jobs,
    loading,
    error,
    createJob,
    deleteJob,
    refetch: fetchJobs,
  }
}