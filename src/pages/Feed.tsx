
import React from 'react';
import Header from '@/components/Header';
import ProjectFeed from '@/components/ProjectFeed';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

const Feed = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.full_name || 'User'}</span>
          </h1>
          <p className="text-muted-foreground">
            Discover amazing projects from the design community
          </p>
        </div>

        <ProjectFeed />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Feed;
