import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  jobCreatorId: string;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  jobCreatorId,
}) => {
  const [proposal, setProposal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !proposal.trim()) return;

    setIsSubmitting(true);
    try {
      // Create job application
      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          proposal: proposal.trim(),
        });

      if (applicationError) {
        if (applicationError.code === '23505') {
          toast({
            title: "Already applied",
            description: "You have already applied to this job.",
            variant: "destructive",
          });
          return;
        }
        throw applicationError;
      }

      // Create notification for job creator
      await supabase
        .from('notifications')
        .insert({
          user_id: jobCreatorId,
          type: 'job_application',
          title: 'New Job Application',
          message: `${user.full_name} applied to your job "${jobTitle}"`,
          related_id: jobId,
        });

      toast({
        title: "Application submitted!",
        description: "Your proposal has been sent to the job creator.",
      });

      onClose();
      setProposal('');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error submitting application",
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
          <h2 className="text-xl font-semibold">Apply for Job</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">{jobTitle}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Write a compelling proposal explaining why you're the perfect fit for this job.
            </p>
          </div>

          <div>
            <label htmlFor="proposal" className="block text-sm font-medium mb-2">
              Your Proposal
            </label>
            <Textarea
              id="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Describe your experience, approach, and why you're the best candidate for this job..."
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
              disabled={!proposal.trim() || isSubmitting}
              className="glow-hover"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default JobApplicationModal;