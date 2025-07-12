
import React from 'react';
import { X, MessageSquare, Briefcase, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PostOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'post' | 'project' | 'job' | 'talent') => void;
}

const PostOptionsModal = ({ isOpen, onClose, onSelectOption }: PostOptionsModalProps) => {
  const options = [
    {
      id: 'post' as const,
      title: 'Create Post',
      description: 'Share your thoughts, tips, and inspiration',
      icon: MessageSquare,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'project' as const,
      title: 'Share Project',
      description: 'Showcase your latest work and designs',
      icon: Lightbulb,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'job' as const,
      title: 'Post Job',
      description: 'Find talented designers for your projects',
      icon: Briefcase,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'talent' as const,
      title: 'Offer Talent',
      description: 'Showcase your skills and availability',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const handleOptionSelect = (optionId: 'post' | 'project' | 'job' | 'talent') => {
    onSelectOption(optionId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">What would you like to create?</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                variant="ghost"
                className="flex items-start p-4 h-auto text-left hover:bg-accent"
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className={`p-3 rounded-lg ${option.color} text-white mr-4 flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostOptionsModal;
