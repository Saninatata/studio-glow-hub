import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HireRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentId: string;
  talentTitle: string;
  talentUserId: string;
  talentName: string;
}

const HireRequestModal: React.FC<HireRequestModalProps> = ({
  isOpen,
  onClose,
  talentId,
  talentTitle,
  talentUserId,
  talentName,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    setIsSubmitting(true);
    try {
      // Create hire request
      const { error: requestError } = await supabase
        .from('hire_requests')
        .insert({
          talent_id: talentId,
          requester_id: user.id,
          message: message.trim(),
        });

      if (requestError) {
        if (requestError.code === '23505') {
          toast({
            title: "Request already sent",
            description: "You have already sent a hire request to this talent.",
            variant: "destructive",
          });
          return;
        }
        throw requestError;
      }

      // Create notification for talent
      await supabase
        .from('notifications')
        .insert({
          user_id: talentUserId,
          type: 'hire_request',
          title: 'New Hire Request',
          message: `${user.full_name} wants to hire you for "${talentTitle}"`,
          related_id: talentId,
        });

      toast({
        title: "Hire request sent!",
        description: `Your message has been sent to ${talentName}.`,
      });

      onClose();
      setMessage('');
    } catch (error) {
      console.error('Error sending hire request:', error);
      toast({
        title: "Error sending request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-card rounded-lg border max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Hire Talent</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Hiring {talentName}</h3>
            <p className="text-sm text-muted-foreground mb-2">{talentTitle}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Send a message describing your project and requirements.
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Your Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your project, timeline, budget, and any specific requirements..."
              rows={6}
              required
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!message.trim() || isSubmitting}
              className="glow-hover"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Hire Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default HireRequestModal;