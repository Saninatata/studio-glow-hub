import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { useToast } from '@/components/ui/use-toast';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientAvatar
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { messages, sendMessage, fetchMessages, loading } = useMessages();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen && recipientId) {
      fetchMessages(recipientId);
    }
  }, [isOpen, recipientId, fetchMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(recipientId, newMessage);
      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recipientAvatar} />
              <AvatarFallback>{recipientName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            Message {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Messages */}
          <div className="max-h-64 overflow-y-auto space-y-3 border rounded-lg p-3 bg-muted/50">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Start a conversation with {recipientName}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === recipientId ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender_id === recipientId
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-0 resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
              className="h-auto"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;