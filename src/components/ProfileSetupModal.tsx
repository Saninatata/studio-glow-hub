
import React, { useState } from 'react';
import { X, Upload, User, Calendar, MapPin, Globe, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileSetupModal = ({ isOpen, onClose }: ProfileSetupModalProps) => {
  const { user, supabaseUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: '',
    location: '',
    website: '',
    skills: [] as string[],
    role: 'student', // 'student' or 'mentor'
    date_of_birth: '',
    experience_level: '',
  });
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUser) return;

    setLoading(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        bio: formData.bio || null,
        location: formData.location || null,
        website: formData.website || null,
        skills: formData.skills,
        // Note: We're not storing DOB and role as they're not in the current schema
        // but we can extend the user table later if needed
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', supabaseUser.id);

      if (error) throw error;

      toast({
        title: "Profile setup completed!",
        description: "Welcome to StudioLink! Your profile has been created.",
      });

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error setting up profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Complete Your Profile</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                <p className="text-muted-foreground">Tell us about yourself</p>
              </div>

              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Are you a mentor or student?</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student - Looking to learn and grow</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentor" id="mentor" />
                    <Label htmlFor="mentor">Mentor - Ready to share knowledge and guide others</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Professional Details</h3>
                <p className="text-muted-foreground">Share your expertise and interests</p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    rows={4}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Skills & Interests</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill or interest"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Examples: UI/UX Design, React, Photography, Illustration, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Input
                  id="experience_level"
                  value={formData.experience_level}
                  onChange={(e) => handleInputChange('experience_level', e.target.value)}
                  placeholder="e.g., Beginner, Intermediate, Expert, 2+ years"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Online Presence</h3>
                <p className="text-muted-foreground">Connect your work and social profiles</p>
              </div>

              <div>
                <Label htmlFor="website">Website/Portfolio</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Profile Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData.full_name || 'Not provided'}</p>
                  <p><strong>Role:</strong> {formData.role === 'mentor' ? 'Mentor' : 'Student'}</p>
                  <p><strong>Location:</strong> {formData.location || 'Not provided'}</p>
                  <p><strong>Skills:</strong> {formData.skills.length > 0 ? formData.skills.join(', ') : 'None added'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t mt-6">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Skip for now
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
