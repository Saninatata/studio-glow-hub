
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  user_id: string
  tags: string[]
  likes_count: number
  comments_count: number
  views_count: number
  created_at: string
  updated_at: string
  user_full_name?: string
  user_avatar_url?: string
  user?: {
    full_name: string
    avatar_url?: string | null
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .rpc('get_projects_with_users')

      if (error) throw error
      
      // Transform data to include user object
      const transformedProjects = (data || []).map(project => ({
        ...project,
        user: project.user_full_name ? {
          full_name: project.user_full_name,
          avatar_url: project.user_avatar_url
        } : undefined
      }))
      
      setProjects(transformedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: {
    title: string
    description: string
    image_url: string
    tags: string[]
  }) => {
    try {
      // Get current authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: authUser.id
        })
        .select()
        .single()

      if (error) throw error
      
      // Refresh projects list
      await fetchProjects()
      
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const likeProject = async (projectId: string) => {
    if (!user) return

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id)
      } else {
        // Like
        await supabase
          .from('project_likes')
          .insert({ project_id: projectId, user_id: user.id })
      }

      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const addComment = async (projectId: string, content: string) => {
    if (!user) return

    try {
      await supabase
        .from('comments')
        .insert({
          project_id: projectId,
          user_id: user.id,
          content,
        })

      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return {
    projects,
    loading,
    error,
    createProject,
    likeProject,
    addComment,
    refetch: fetchProjects,
  }
}
