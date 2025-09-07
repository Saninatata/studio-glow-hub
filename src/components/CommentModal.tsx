import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_full_name: string | null;
  user_avatar_url: string | null;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postContent: string;
  onCommentAdded?: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postId,
  postContent,
  onCommentAdded,
}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get user profiles separately
      const userIds = data?.map(comment => comment.user_id) || [];
      const { data: profiles } = await supabase
        .from('user_public_profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const transformedComments = data?.map(comment => {
        const profile = profiles?.find(p => p.id === comment.user_id);
        return {
          id: comment.id,
          user_id: comment.user_id,
          content: comment.content,
          created_at: comment.created_at,
          user_full_name: profile?.full_name || null,
          user_avatar_url: profile?.avatar_url || null,
        };
      }) || [];

      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('create_post_comment', {
        post_id_param: postId,
        content_param: comment.trim(),
      });

      if (error) throw error;

      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });

      setComment('');
      await fetchComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-card rounded-lg border max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Comments</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user_avatar_url || undefined} />
                      <AvatarFallback>
                        {comment.user_full_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user_full_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {user && (
            <div className="border-t p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={1}
                    className="min-h-[40px] resize-none"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!comment.trim() || isSubmitting}
                    className="glow-hover"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommentModal;