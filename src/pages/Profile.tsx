import React, { useState } from 'react';
import { User, MapPin, Globe, Mail, Calendar, Edit3, Settings, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ProfileEditModal from '@/components/ProfileEditModal';

const Profile = () => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  const skills = user.skills || ['UI/UX Design', 'React', 'Figma', 'Adobe Creative Suite'];
  const projects = [
    { title: 'E-commerce App', type: 'Mobile Design', status: 'Completed' },
    { title: 'Brand Identity', type: 'Branding', status: 'In Progress' },
    { title: 'Dashboard UI', type: 'Web Design', status: 'Completed' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-blue-500 p-1 mx-auto mb-4">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-primary" />
                        )}
                      </div>
                    </div>
                    <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary hover:bg-primary/90">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h1 className="text-2xl font-bold mb-2">{user.full_name}</h1>
                  <p className="text-muted-foreground mb-4">{user.bio || 'Creative Designer & Developer'}</p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {user.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-6">
                    <Button className="flex-1" onClick={() => setShowEditModal(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  
                  {user.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {user.website}
                      </a>
                    </div>
                  )}

                  {user.is_freelancer && user.hourly_rate && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">Hourly Rate</p>
                      <p className="text-lg font-bold text-primary">${user.hourly_rate}/hr</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 mt-6">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="glass border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </CardContent>
              </Card>
              <Card className="glass border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">1.2k</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </CardContent>
              </Card>
              <Card className="glass border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">432</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.type}</p>
                      </div>
                      <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Uploaded a new project: "Modern Dashboard Design"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Received 15 likes on "E-commerce Mobile App"</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Started following @designguru</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProfileEditModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
      />
    </div>
  );
};

export default Profile;
