
import React, { useState, useEffect, createContext, useContext } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { cleanupAuthState } from '@/utils/authCleanup'

interface User {
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

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id)
      setSupabaseUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      setSupabaseUser(session?.user ?? null)
      
      if (session?.user) {
        // Defer profile fetching to prevent deadlocks
        setTimeout(() => {
          fetchUserProfile(session.user.id)
        }, 0)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
        setLoading(false)
        return
      }

      if (!data) {
        // User profile doesn't exist, create a basic one
        console.log('User profile not found, creating basic profile')
        await createUserProfile(userId)
        return
      }

      console.log('User profile loaded:', data)
      setUser(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setLoading(false)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      console.log('Creating user profile for:', userId)
      const { data: authUser } = await supabase.auth.getUser()
      
      const profileData = {
        id: userId,
        email: authUser.user?.email || '',
        full_name: authUser.user?.user_metadata?.full_name || authUser.user?.email?.split('@')[0] || 'User',
        skills: [],
        is_freelancer: false,
      }

      const { data, error } = await supabase
        .from('users')
        .insert(profileData)
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        setLoading(false)
        return
      }

      console.log('User profile created:', data)
      setUser(data)
      setLoading(false)
    } catch (error) {
      console.error('Error creating user profile:', error)
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    // Clean up any existing auth state first
    cleanupAuthState()
    
    const redirectUrl = `${window.location.origin}/feed`
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    })
    if (error) throw error

    // If user is created immediately (no email confirmation required)
    if (data.user && !data.user.email_confirmed_at) {
      console.log('User created, waiting for email confirmation')
    }
  }

  const signInWithGoogle = async () => {
    // Clean up any existing auth state first
    cleanupAuthState()
    
    const redirectUrl = `${window.location.origin}/feed`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    setLoading(true)
    
    // Clean up auth state first
    cleanupAuthState()
    
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) {
      setLoading(false)
      throw error
    }
    setUser(null)
    setSupabaseUser(null)
    setLoading(false)
  }

  const value = {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
