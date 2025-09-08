import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useToast } from '@/hooks/use-toast';

interface StartConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
  recipientName?: string;
}

const StartConversationModal: React.FC<StartConversationModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName
}) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { sendMessage } = useMessages();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!recipientId && !searchUsername) {
      toast({
        title: "Recipient required",
        description: "Please enter a username or select a recipient",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // If we have recipientId, use it directly
      if (recipientId) {
        await sendMessage(recipientId, message);
        toast({
          title: "Message sent",
          description: `Message sent to ${recipientName || 'user'}`,
        });
        onClose();
        setMessage('');
      } else {
        // TODO: Look up user by username and send message
        // For now, show error
        toast({
          title: "Feature coming soon",
          description: "Username search not yet implemented",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!recipientId && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
          )}
          
          {recipientName && (
            <div className="text-sm text-muted-foreground">
              Sending to: <span className="font-medium">{recipientName}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartConversationModal;