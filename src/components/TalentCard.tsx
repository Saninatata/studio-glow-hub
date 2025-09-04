import React from 'react';
import { Star, MapPin, Clock, DollarSign, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Talent {
  id: string
  user_id: string
  title: string
  description: string
  skills: string[]
  hourly_rate: string | null
  availability: string | null
  location: string | null
  experience: string | null
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url?: string | null
  } | null
}

interface TalentCardProps {
  talent: Talent;
  onDelete?: (talentId: string) => Promise<void>;
}

const TalentCard: React.FC<TalentCardProps> = ({ talent, onDelete }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(talent.id);
      toast({
        title: "Talent profile deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting talent profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass border-white/10 project-card">
      <CardHeader className="text-center">
        <div className="flex justify-between items-start mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-500 p-0.5 mx-auto">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>
          {user && user.id === talent.user_id && (
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
        <CardTitle className="text-lg">{talent.user?.full_name || 'Unknown User'}</CardTitle>
        <p className="text-muted-foreground text-sm">{talent.title}</p>
        
        <div className="flex items-center justify-center space-x-4 mt-2">
          {talent.hourly_rate && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium">{talent.hourly_rate}/hr</span>
            </div>
          )}
          {talent.availability && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm">{talent.availability}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{talent.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {talent.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {talent.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{talent.skills.length - 3}
            </Badge>
          )}
        </div>
        
        {talent.location && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            {talent.location}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <Button size="sm" className="glow-hover bg-primary hover:bg-primary/90">
            Hire Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentCard;