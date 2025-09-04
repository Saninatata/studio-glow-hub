import React from 'react';
import { DollarSign, Clock, MapPin, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string
  user_id: string
  title: string
  company: string
  location: string | null
  salary: string | null
  job_type: string | null
  description: string
  requirements: string | null
  tags: string[]
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url?: string | null
  } | null
}

interface JobCardProps {
  job: Job;
  onDelete?: (jobId: string) => Promise<void>;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(job.id);
      toast({
        title: "Job deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting job",
        description: "Please try again later.",
        variant: "destructive",
      });
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

  return (
    <Card className="glass border-white/10 project-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 hover:text-primary transition-colors cursor-pointer">
              {job.title}
            </CardTitle>
            <p className="text-muted-foreground mb-4">{job.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {user && user.id === job.user_id && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              className="hover:text-red-500 text-muted-foreground ml-4"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {job.salary && (
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-semibold">{job.salary}</span>
            </div>
          )}
          {job.job_type && (
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span>{job.job_type}</span>
            </div>
          )}
          {job.location && (
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              <span>{job.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Posted by <span className="font-medium">{job.company}</span> • {formatTimeAgo(job.created_at)}
          </div>
          <Button className="glow-hover bg-primary hover:bg-primary/90">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;