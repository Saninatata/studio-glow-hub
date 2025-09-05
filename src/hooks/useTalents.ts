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
  user_full_name: string | null
  user_avatar_url: string | null
}

export function useTalents() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchTalents();
    const handleUpdated = () => fetchTalents();
    window.addEventListener('talents:updated', handleUpdated);
    return () => {
      window.removeEventListener('talents:updated', handleUpdated);
    };
  }, [])

  const fetchTalents = async () => {
    try {
      console.log('Fetching talents...');
      setError(null)
      const { data, error } = await supabase
        .rpc('get_talents_with_users')

      console.log('Fetch talents result:', { data, error });

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
      console.log('Creating talent with data:', talentData);
      
      // Get current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('Auth user:', authUser);
      
      if (!authUser) throw new Error('Authentication required');

      const insertData = {
        ...talentData,
        user_id: authUser.id
      };
      
      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('talents')
        .insert(insertData)
        .select()
        .single()

      console.log('Insert result:', { data, error });

      if (error) throw error
      
      // Refresh talents list
      await fetchTalents()
      // Notify other parts of the app
      window.dispatchEvent(new Event('talents:updated'))
      
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
      // Notify other parts of the app
      window.dispatchEvent(new Event('talents:updated'))
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