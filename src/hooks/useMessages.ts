import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface Conversation {
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_conversations') as { data: Conversation[] | null, error: any };
      
      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (recipientId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (recipientId: string, content: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim()
        });
      
      if (error) throw error;
      
      // Refresh messages
      await fetchMessages(recipientId);
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
  };
}