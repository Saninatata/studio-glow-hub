
import { useState, useEffect } from 'react'
import { supabase, Project } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
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

        // Decrement likes count
        await supabase.rpc('decrement_likes', { project_id: projectId })
      } else {
        // Like
        await supabase
          .from('project_likes')
          .insert({ project_id: projectId, user_id: user.id })

        // Increment likes count
        await supabase.rpc('increment_likes', { project_id: projectId })
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

      // Increment comments count
      await supabase.rpc('increment_comments', { project_id: projectId })

      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  return {
    projects,
    loading,
    likeProject,
    addComment,
    refetch: fetchProjects,
  }
}
