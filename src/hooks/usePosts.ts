
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
    email: string;
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(full_name, avatar_url, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    content: string;
    image_url?: string;
    video_url?: string;
    tags?: string[];
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: postData.content,
          image_url: postData.image_url || null,
          video_url: postData.video_url || null,
          tags: postData.tags || [],
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh posts list
      await fetchPosts();
      
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      // Toggle like logic would go here
      // For now, just refresh posts
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    refetch: fetchPosts,
  };
}
