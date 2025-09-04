
import React from 'react';
import { Heart, MessageCircle, Share2, Eye, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  user_id: string
  tags: string[]
  likes_count: number
  comments_count: number
  views_count: number
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url?: string | null
  }
}

interface ProjectCardProps {
  project: Project;
  onDelete?: (projectId: string) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(project.id);
      toast({
        title: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="project-card bg-card rounded-xl overflow-hidden opacity-0 fade-in">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-500 p-0.5">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {project.user?.full_name || 'Unknown User'}
                </h3>
                <p className="text-sm text-muted-foreground">{formatDate(project.created_at)}</p>
              </div>
            </div>
            {user && user.id === project.user_id && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="hover:text-red-500 text-muted-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors cursor-pointer">
          {project.title}
        </h2>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{project.views_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{project.likes_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{project.comments_count}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="hover:text-red-400">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="hover:text-blue-400">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="hover:text-green-400">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
