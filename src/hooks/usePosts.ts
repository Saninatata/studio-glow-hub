
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PostFromDB {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  video_url?: string | null;
  tags?: string[] | null;
  likes_count?: number | null;
  comments_count?: number | null;
  shares_count?: number | null;
  created_at: string;
  updated_at: string;
  user_full_name?: string | null;
  user_avatar_url?: string | null;
  
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  video_url?: string | null;
  tags?: string[] | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  user_full_name: string | null;
  user_avatar_url: string | null;
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
        .rpc('get_posts_with_users') as { data: PostFromDB[] | null, error: any };

      if (error) throw error;
      
      // Transform the data to match our Post interface
      const transformedPosts: Post[] = (data || []).map(post => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        video_url: post.video_url,
        tags: post.tags,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        shares_count: post.shares_count || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user_full_name: post.user_full_name,
        user_avatar_url: post.user_avatar_url
      }));
      
      setPosts(transformedPosts);
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
    try {
      // Check if user is actually signed in with Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Authentication required');

      const { data, error } = await supabase.rpc('create_post', {
        p_content: postData.content,
        p_image_url: postData.image_url || null,
        p_video_url: postData.video_url || null,
        p_tags: postData.tags || []
      });

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
      const { error } = await supabase.rpc('toggle_post_like', { 
        post_id_param: postId 
      });
      
      if (error) throw error;
      
      // Refresh posts to get updated counts
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  const sharePost = async (postId: string) => {
    if (!user) return;

    try {
      // Update share count
      const { error } = await supabase
        .from('posts')
        .update({ shares_count: (supabase as any).raw('shares_count + 1') })
        .eq('id', postId);
      
      if (error) throw error;
      
      // Refresh posts to get updated counts
      await fetchPosts();
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      
      // Refresh posts list
      await fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    sharePost,
    deletePost,
    refetch: fetchPosts,
  };
}
