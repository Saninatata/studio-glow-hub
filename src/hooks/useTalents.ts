import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

interface Talent {
  id: string
  user_id: string
  title: string
  description: string
  skills: string[]
  hourly_rate: string | null
  availability: string | null
  location: string | null
  experience: string | null
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url?: string | null
  } | null
}

export function useTalents() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchTalents()
  }, [])

  const fetchTalents = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTalents(data || [])
    } catch (error) {
      console.error('Error fetching talents:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch talents')
    } finally {
      setLoading(false)
    }
  }

  const createTalent = async (talentData: {
    title: string
    description: string
    skills?: string[]
    hourly_rate?: string
    availability?: string
    location?: string
    experience?: string
  }) => {
    try {
      // Get current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('talents')
        .insert({
          ...talentData,
          user_id: authUser.id
        })
        .select()
        .single()

      if (error) throw error
      
      // Refresh talents list
      await fetchTalents()
      
      return data
    } catch (error) {
      console.error('Error creating talent:', error)
      throw error
    }
  }

  const deleteTalent = async (talentId: string) => {
    try {
      const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', talentId)

      if (error) throw error
      
      // Refresh talents list
      await fetchTalents()
    } catch (error) {
      console.error('Error deleting talent:', error)
      throw error
    }
  }

  return {
    talents,
    loading,
    error,
    createTalent,
    deleteTalent,
    refetch: fetchTalents,
  }
}