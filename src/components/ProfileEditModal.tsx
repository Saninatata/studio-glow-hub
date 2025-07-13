
import React, { useState, useEffect } from 'react';
import { X, Save, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const { user, supabaseUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    skills: [] as string[],
    is_freelancer: false,
    hourly_rate: '',
    avatar_url: '',
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        skills: user.skills || [],
        is_freelancer: user.is_freelancer || false,
        hourly_rate: user.hourly_rate?.toString() || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${supabaseUser?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      toast({
        title: "Photo uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error uploading photo",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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

  const handleSave = async () => {
    if (!supabaseUser) {
      toast({
        title: "Authentication error",
        description: "Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Format full_name to include @ if it doesn't already
      let formattedFullName = formData.full_name.trim();
      if (formattedFullName && !formattedFullName.startsWith('@')) {
        formattedFullName = `@${formattedFullName}`;
      }

      const updateData = {
        full_name: formattedFullName,
        bio: formData.bio || null,
        location: formData.location || null,
        website: formData.website || null,
        skills: formData.skills,
        is_freelancer: formData.is_freelancer,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        avatar_url: formData.avatar_url || null,
      };

      console.log('Updating profile with data:', updateData);

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', supabaseUser.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });

      // Force page reload to refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
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
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-blue-500 p-1">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                disabled={uploading}
              >
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </label>
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Username</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your username (e.g., mansur)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Will be displayed as @{formData.full_name.replace('@', '')}
              </p>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
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
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Freelancer Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Available for freelance work</Label>
                <p className="text-sm text-muted-foreground">
                  Show that you're available for hire
                </p>
              </div>
              <Switch
                checked={formData.is_freelancer}
                onCheckedChange={(checked) => handleInputChange('is_freelancer', checked)}
              />
            </div>

            {formData.is_freelancer && (
              <div>
                <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                  placeholder="50"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
