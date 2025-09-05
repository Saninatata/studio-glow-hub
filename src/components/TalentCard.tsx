import React from 'react';
import { Star, MapPin, Clock, DollarSign, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserProfile from '@/components/UserProfile';
import ExpandableText from '@/components/ExpandableText';
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
  user_full_name: string | null
  user_avatar_url: string | null
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
      <CardHeader>
        <div className="flex items-start justify-between">
          <UserProfile
            userId={talent.user_id}
            fullName={talent.user_full_name}
            avatarUrl={talent.user_avatar_url}
          />
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
        <CardTitle className="text-lg">{talent.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ExpandableText 
          text={talent.description}
          maxLength={100}
          className="text-muted-foreground mb-4"
        />
        
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
        
        <div className="space-y-2 mb-4">
          {talent.hourly_rate && (
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 text-green-500 mr-2" />
              <span className="font-medium">{talent.hourly_rate}/hr</span>
            </div>
          )}
          
          {talent.availability && (
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-blue-500 mr-2" />
              <span>{talent.availability}</span>
            </div>
          )}
          
          {talent.location && (
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 text-purple-500 mr-2" />
              <span>{talent.location}</span>
            </div>
          )}
        </div>
        
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