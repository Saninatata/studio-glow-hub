
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import UserProfile from '@/components/UserProfile';
import ExpandableText from '@/components/ExpandableText';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

const Posts = () => {
  const [newPost, setNewPost] = useState('');
  const { user } = useAuth();
  const { posts, loading, createPost, deletePost } = usePosts();
  const { toast } = useToast();
  const [posting, setPosting] = useState(false);

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;
    if (!user) {
      toast({
        title: "Please sign in to post",
        variant: "destructive",
      });
      return;
    }

    setPosting(true);
    try {
      await createPost({
        content: newPost.trim(),
      });
      
      setNewPost('');
      toast({
        title: "Post created successfully!",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      toast({
        title: "Post deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting post",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Community <span className="gradient-text">Posts</span>
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts, tips, and inspiration with the design community
          </p>
        </div>

        {/* Create Post */}
        {user && (
          <Card className="glass border-white/10 mb-8">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar_url || ''} />
                  <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Add to your post</span>
                </div>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || posting}
                  className="glow-hover bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {posting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No posts yet. Be the first to share something!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="glass border-white/10 project-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <UserProfile
                      userId={post.user_id}
                      fullName={post.user_full_name}
                      avatarUrl={post.user_avatar_url}
                      showTime={formatTimeAgo(post.created_at)}
                    />
                    {user && user.id === post.user_id && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeletePost(post.id)}
                        className="hover:text-red-500 text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ExpandableText 
                    text={post.content} 
                    maxLength={200}
                    className="text-foreground leading-relaxed"
                  />
                  
                  {post.image_url && (
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt="Post content" 
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" className="hover:text-red-400">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes_count || 0}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="hover:text-blue-400">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments_count || 0}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="hover:text-green-400">
                        <Share2 className="w-4 h-4 mr-2" />
                        {post.shares_count || 0}
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="hover:text-yellow-400">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="hover:bg-primary/10">
              Load More Posts
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Posts;
