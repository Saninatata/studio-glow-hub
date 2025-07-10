
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  skills: string[]
  is_freelancer: boolean
  hourly_rate?: number
  created_at: string
}

export interface Project {
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
}

export interface ProjectLike {
  id: string
  project_id: string
  user_id: string
  created_at: string
}

export interface Comment {
  id: string
  project_id: string
  user_id: string
  content: string
  created_at: string
}
