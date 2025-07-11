
import { useState, useEffect } from 'react'
import { supabase, Project } from '@/lib/supabase'
import { useAuth } from './useAuth'

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
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
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
    user_id: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
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
